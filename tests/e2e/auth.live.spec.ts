import { defaultGrid } from "@/lib/permissions/access-grid";
import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";

// Runs only through scripts/test-live-auth.ts against reset local Supabase.
// Never accept a hosted URL or use real accounts.
const local = process.env.NEXT_PUBLIC_SUPABASE_URL;
const allowed =
  local === "http://127.0.0.1:54321" || local === "http://localhost:54321";
const password = "Synthetic-test-password-123";
const newPassword = "Synthetic-new-password-456";
const ownerEmail = "synthetic-owner@example.invalid";
const staffEmail = "synthetic-staff@example.invalid";
let ownerId: string;
let staffId: string;

test.beforeAll(async () => {
  if (!allowed || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Local synthetic auth only");
  const admin = createClient(local!, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  // This job owns a reset local database. Recreate only these two synthetic identities on retry.
  const existing = await admin.auth.admin.listUsers();
  for (const user of existing.data.users) {
    if ([ownerEmail, staffEmail].includes(user.email ?? "")) {
      execFileSync(
        "docker",
        [
          "exec",
          "-i",
          "supabase_db_rcrd",
          "psql",
          "-U",
          "postgres",
          "-v",
          "ON_ERROR_STOP=1",
        ],
        {
          input: `delete from public.center_grants where org_id = '11111111-1111-4111-8111-111111111111'; delete from public.centers where org_id = '11111111-1111-4111-8111-111111111111'; delete from public.access_audit where org_id = '11111111-1111-4111-8111-111111111111'; delete from public.memberships where org_id = '11111111-1111-4111-8111-111111111111'; delete from public.organisations where org_id = '11111111-1111-4111-8111-111111111111';`,
          stdio: ["pipe", "pipe", "pipe"],
        },
      );
      await admin.auth.admin.deleteUser(user.id);
    }
  }
  const owner = await admin.auth.admin.createUser({
    email: ownerEmail,
    password,
    email_confirm: true,
  });
  const staff = await admin.auth.admin.createUser({
    email: staffEmail,
    phone: "919876543210",
    phone_confirm: true,
    password,
    email_confirm: true,
  });
  if (!owner.data.user || !staff.data.user)
    throw new Error("Could not create synthetic identities");
  ownerId = owner.data.user.id;
  staffId = staff.data.user.id;
  execFileSync(
    "docker",
    [
      "exec",
      "-i",
      "supabase_db_rcrd",
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
    ],
    {
      input: `
    insert into public.organisations (id,org_id,name) values ('11111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Synthetic auth clinic');
    insert into public.memberships (id,org_id,user_id,login_enabled,is_owner,base_role) values
    ('22222222-2222-4222-8222-222222222221','11111111-1111-4111-8111-111111111111','${ownerId}',true,true,'owner'),
    ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','${staffId}',true,false,'staff');
    insert into public.centers(id,org_id,name) values ('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','Synthetic branch');
  `,
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  const probe = createClient(
    local!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const signup = await probe.auth.signUp({
    email: "unprovisioned-synthetic@example.invalid",
    password,
  });
  if (signup.error?.code !== "signup_disabled")
    throw new Error("Public registration must stay disabled");
  const identity = await probe.auth.signInWithPassword({
    email: ownerEmail,
    password,
  });
  if (identity.error)
    throw new Error(`Synthetic identity probe failed: ${identity.error.code}`);
  const member = await probe
    .from("memberships")
    .select("*")
    .eq("user_id", ownerId)
    .single();
  if (member.error || !member.data?.login_enabled)
    throw new Error(
      `Synthetic membership probe failed: ${member.error?.code ?? "inactive"}`,
    );
  const org = await probe.from("organisations").select("name").single();
  if (org.error || !org.data)
    throw new Error(
      `Synthetic organisation probe failed: ${org.error?.code ?? "missing"}`,
    );
  await probe.auth.signOut({ scope: "local" });
  const phoneProbe = await probe.auth.signInWithPassword({
    phone: "+919876543210",
    password,
  });
  if (phoneProbe.error)
    throw new Error(`Synthetic phone probe failed: ${phoneProbe.error.code}`);
  await probe.auth.signOut({ scope: "local" });
});

test("live login, access denial, mobile access, password change, recovery and logout", async ({
  page,
  browser,
}) => {
  test.setTimeout(90_000);
  async function login(
    target: typeof page,
    identifier: string,
    secret = password,
  ) {
    await target.goto("/login");
    await expect(
      target.getByRole("button", { name: "Sign in", exact: true }),
    ).toBeEnabled();
    await target.getByLabel("Email or mobile number").fill(identifier);
    await target.getByLabel("Password", { exact: true }).fill(secret);
    await target.getByRole("button", { name: "Sign in", exact: true }).click();
  }
  await page.goto("/patients");
  await expect(page).toHaveURL(/\/login$/);
  await login(page, ownerEmail, "synthetic-wrong-password-123");
  await expect(
    page.getByRole("alert").filter({ hasText: "Unable to sign in" }),
  ).toBeVisible();
  await login(page, ownerEmail);
  try {
    await expect(page).toHaveURL(/\/calendar$/);
  } catch {
    throw new Error(
      `Synthetic owner login UI: ${await page.locator("main").innerText()}`,
    );
  }
  await expect(page.getByRole("banner")).toContainText("Synthetic auth clinic");
  await page.goto("/admin/access-audit");
  await expect(
    page.getByRole("heading", { name: "Access Audit", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Area", exact: true })
    .fill("authentication");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByRole("table")).toContainText("auth_login");
  await expect(page.getByRole("table")).toContainText("auth_login_failed");
  for (const format of ["xlsx", "pdf"]) {
    const response = await page.request.get(
      `/api/access-audit?area=authentication&format=${format}`,
    );
    expect(response.status()).toBe(200);
    const bytes = await response.body();
    expect(bytes.subarray(0, format === "pdf" ? 4 : 2).toString()).toBe(
      format === "pdf" ? "%PDF" : "PK",
    );
    expect(response.headers()["cache-control"]).toContain("no-store");
  }
  await page
    .getByRole("textbox", { name: "Area", exact: true })
    .fill("no_such_area");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "No activity matches" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear filters", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Area", exact: true }),
  ).toHaveValue("");
  await page.goto("/account/team");
  const roleForm = page
    .locator("section")
    .filter({
      has: page.getByRole("heading", { name: staffEmail, exact: true }),
    })
    .filter({
      has: page.getByRole("button", { name: "Save role", exact: true }),
    })
    .first();
  const stampMenu = roleForm
    .locator("summary")
    .filter({ hasText: "Record details" });
  await stampMenu.focus();
  await page.keyboard.press("Enter");
  await expect(roleForm.getByRole("note")).toContainText("Created:");
  await expect(roleForm.getByRole("note")).toContainText("Updated:");
  await expect(roleForm.getByRole("note").locator("time")).toHaveCount(2);
  await page.keyboard.press("Enter");
  await expect(roleForm.getByRole("note")).toBeHidden();
  // Promote then demote without a reload: revalidation must replace owner defaults.
  const baseRole = roleForm.getByRole("combobox", {
    name: "Base role",
    exact: true,
  });
  const billingDelete = roleForm.getByLabel(
    "Billing / Invoices: Allow Delete",
    {
      exact: true,
    },
  );
  for (const role of ["owner", "staff"] as const) {
    await baseRole.selectOption(role);
    await roleForm
      .getByRole("button", { name: "Save role", exact: true })
      .click();
    await expect(
      roleForm.getByText("Role and tags saved.", { exact: true }),
    ).toBeVisible();
    await expect(billingDelete).toHaveValue(role === "owner" ? "any" : "none");
    if (role === "owner") await expect(billingDelete).toBeDisabled();
    else await expect(billingDelete).toBeEnabled();
  }
  await stampMenu.click();
  await expect(roleForm.getByRole("note")).toContainText(
    `Updated: ${ownerEmail}`,
  );
  await stampMenu.click();
  await roleForm
    .locator("summary")
    .filter({ hasText: /^Access$/ })
    .click();
  await roleForm
    .getByLabel("Select Copy Access from", { exact: true })
    .selectOption({ label: ownerEmail });
  await expect(billingDelete).toHaveValue("any");
  await expect(
    roleForm.getByText(
      "Access copied into this draft. Review it and save access to apply.",
    ),
  ).toBeVisible();
  // Copy is editable and does not grant anything before Save access.
  await billingDelete.selectOption("same");
  await expect(billingDelete).toHaveValue("same");
  await page.reload();
  await expect(billingDelete).toHaveValue("none");
  await roleForm
    .locator("summary")
    .filter({ hasText: /^Access$/ })
    .click();
  await roleForm
    .locator("details")
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(
    roleForm.getByText("Access saved.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(billingDelete).toHaveValue("none");
  // Verify every persisted cell, including non-rendered areas, uses staff defaults.
  const verifier = createClient(
    local!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const verifiedLogin = await verifier.auth.signInWithPassword({
    email: ownerEmail,
    password,
  });
  expect(verifiedLogin.error).toBeNull();
  const savedAccess = await verifier.rpc("list_member_access");
  expect(savedAccess.error).toBeNull();
  expect(
    savedAccess.data.find(
      (item: { id: string }) =>
        item.id === "22222222-2222-4222-8222-222222222222",
    ).access_grid,
  ).toEqual(defaultGrid("staff"));
  await verifier.auth.signOut({ scope: "local" });
  await roleForm
    .getByRole("combobox", { name: "Base role", exact: true })
    .selectOption("doctor");
  await roleForm.getByLabel("Consultant", { exact: true }).check();
  await roleForm
    .getByRole("button", { name: "Save role", exact: true })
    .click();
  await expect(
    roleForm.getByText("Role and tags saved.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    roleForm.getByRole("combobox", { name: "Base role", exact: true }),
  ).toHaveValue("doctor");
  await expect(
    roleForm.getByLabel("Consultant", { exact: true }),
  ).toBeChecked();
  await roleForm
    .locator("summary")
    .filter({ hasText: /^Access$/ })
    .click();
  await roleForm
    .getByLabel("Billing / Invoices: Allow Edit", { exact: true })
    .selectOption("same");
  await roleForm
    .locator("details")
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(
    roleForm.getByText("Access saved.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await roleForm
    .locator("summary")
    .filter({ hasText: /^Access$/ })
    .click();
  await expect(
    roleForm.getByLabel("Billing / Invoices: Allow Edit", { exact: true }),
  ).toHaveValue("same");
  await roleForm
    .locator("summary")
    .filter({ hasText: /^Access$/ })
    .click();
  await roleForm.getByLabel("Synthetic branch", { exact: true }).check();
  await roleForm
    .getByRole("button", { name: "Save centers", exact: true })
    .click();
  await expect(
    roleForm.getByText("Center access saved.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    roleForm.getByLabel("Synthetic branch", { exact: true }),
  ).toBeChecked();
  await roleForm.getByLabel("Synthetic branch", { exact: true }).uncheck();
  await roleForm
    .getByRole("button", { name: "Save centers", exact: true })
    .click();
  await expect(
    roleForm.getByText("Center access saved.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    roleForm.getByLabel("Synthetic branch", { exact: true }),
  ).not.toBeChecked();
  const staffRow = page.getByRole("region", { name: staffEmail, exact: true });
  const visibilityRow = staffRow.locator("..");
  await visibilityRow
    .getByLabel("Disable export to Excel/PDF in reports")
    .check();
  await visibilityRow
    .getByRole("button", { name: "Save export restriction", exact: true })
    .click();
  await expect(
    visibilityRow
      .getByRole("status")
      .filter({ hasText: "Export restriction saved." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    visibilityRow.getByLabel("Disable export to Excel/PDF in reports"),
  ).toBeChecked();

  await visibilityRow
    .getByLabel("Allowed to see appointments", { exact: true })
    .selectOption("own");
  await visibilityRow
    .getByRole("button", { name: "Save appointment visibility", exact: true })
    .click();
  await expect(
    visibilityRow
      .getByRole("status")
      .filter({ hasText: "Appointment visibility saved." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    visibilityRow.getByLabel("Allowed to see appointments", { exact: true }),
  ).toHaveValue("own");
  await staffRow.getByLabel("Enable Login", { exact: true }).uncheck();
  await staffRow.getByLabel("Enable Mobile Access", { exact: true }).uncheck();
  await staffRow
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(staffRow.getByRole("status")).toHaveText(
    "Account access saved.",
  );
  const staffContext = await browser.newContext();
  const staffPage = await staffContext.newPage();
  await login(staffPage, staffEmail);
  await expect(
    staffPage.getByRole("alert").filter({ hasText: "Unable to sign in" }),
  ).toContainText("Unable to sign in");
  await staffRow.getByLabel("Enable Login", { exact: true }).check();
  await staffRow
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(staffRow.getByRole("status")).toHaveText(
    "Account access saved.",
  );
  const mobileContext = await browser.newContext({
    userAgent: "Mozilla/5.0 iPhone Mobile",
  });
  const mobilePage = await mobileContext.newPage();
  await login(mobilePage, staffEmail);
  await expect(
    mobilePage.getByRole("alert").filter({ hasText: "Unable to sign in" }),
  ).toContainText("Unable to sign in");
  await mobileContext.close();
  const direct = createClient(
    local!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
  const phoneSession = await direct.auth.signInWithPassword({
    phone: "+919876543210",
    password,
  });
  if (phoneSession.error)
    throw new Error(
      `Phone sign-in after access change: ${phoneSession.error.code}`,
    );
  const access = await direct
    .from("memberships")
    .select("login_enabled,mobile_access_enabled")
    .single();
  if (!access.data?.login_enabled)
    throw new Error(
      `Staff access was not reenabled: ${access.error?.code ?? "inactive"}`,
    );
  await direct.auth.signOut({ scope: "local" });
  await login(staffPage, "9876543210");
  await expect(staffPage).toHaveURL(/\/calendar$/);
  await staffPage.goto("/admin/access-audit");
  await expect(staffPage).toHaveURL(/\/login$/);
  expect(
    (await staffPage.request.get("/api/access-audit?format=xlsx")).status(),
  ).toBe(403);
  await staffPage.goto("/account/password");
  await staffPage.getByLabel("New password", { exact: true }).fill(newPassword);
  await staffPage.getByLabel("Confirm new password").fill(newPassword);
  await expect(
    staffPage.getByRole("button", { name: "Save password" }),
  ).toBeEnabled();
  await staffPage.getByRole("button", { name: "Save password" }).click();
  await expect(
    staffPage.getByRole("status").filter({ hasText: "Password changed" }),
  ).toBeVisible();
  await staffPage.getByRole("button", { name: "Logout", exact: true }).click();
  await staffPage
    .getByRole("dialog")
    .getByRole("button", { name: "Yes", exact: true })
    .click();
  await expect(staffPage).toHaveURL(/\/login$/);
  await login(staffPage, staffEmail, newPassword);
  await expect(staffPage).toHaveURL(/\/calendar$/);
  // Existing identity loses access on the very next protected request after disable.
  await staffRow.getByLabel("Enable Login", { exact: true }).uncheck();
  await staffRow
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(staffRow.getByRole("status")).toHaveText(
    "Account access saved.",
  );
  await staffPage.goto("/patients");
  await expect(staffPage).toHaveURL(/\/login$/);
  await staffRow.getByLabel("Enable Login", { exact: true }).check();
  await staffRow
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(staffRow.getByRole("status")).toHaveText(
    "Account access saved.",
  );
  // Auth produces a real single-use recovery token without sending external mail.
  const admin = createClient(local!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: staffEmail,
  });
  if (error || !data.properties?.hashed_token)
    throw new Error("Synthetic recovery token unavailable");
  const recovery = `/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery`;
  await staffPage.goto(recovery);
  await expect(staffPage).toHaveURL(/\/account\/password$/);
  await staffPage.getByLabel("New password", { exact: true }).fill(password);
  await staffPage.getByLabel("Confirm new password").fill(password);
  await expect(
    staffPage.getByRole("button", { name: "Save password" }),
  ).toBeEnabled();
  await staffPage.getByRole("button", { name: "Save password" }).click();
  await expect(
    staffPage.getByRole("status").filter({ hasText: "Password changed" }),
  ).toBeVisible();
  await staffPage.goto(recovery);
  await expect(staffPage).toHaveURL(/\/forgot-password\?invalid=1$/);
  // ACC-18: cancellation, soft delete, live session denial and deliberate restore.
  await login(staffPage, staffEmail, password);
  await expect(staffPage).toHaveURL(/\/calendar$/);
  await page.goto("/account/team");
  // This identity was changed to Doctor earlier in this same workflow.
  await expect(
    roleForm.getByRole("combobox", { name: "Base role", exact: true }),
  ).toHaveValue("doctor");
  await expect(
    roleForm.getByLabel("Send Appointment Summary", { exact: true }),
  ).toBeDisabled();
  await staffRow
    .locator("..")
    .getByRole("button", { name: "Delete person", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(staffRow).toBeVisible();
  await staffRow
    .locator("..")
    .getByRole("button", { name: "Delete person", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(staffRow).toHaveCount(0);
  const deletedDoctors = page.getByRole("region", {
    name: "Deleted Owner & Doctor List",
    exact: true,
  });
  await expect(deletedDoctors).toContainText(staffEmail);
  await staffPage.goto("/patients");
  await expect(staffPage).toHaveURL(/\/login$/);
  await login(staffPage, staffEmail, password);
  await expect(
    staffPage.getByRole("alert").filter({ hasText: "Unable to sign in" }),
  ).toBeVisible();
  await deletedDoctors
    .getByRole("button", { name: "Restore person", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Login stays disabled");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(staffRow).toBeVisible();
  await expect(
    staffRow.getByLabel("Enable Login", { exact: true }),
  ).not.toBeChecked();
  await expect(deletedDoctors).toContainText("No deleted people.");
  await login(staffPage, staffEmail, password);
  await expect(
    staffPage.getByRole("alert").filter({ hasText: "Unable to sign in" }),
  ).toBeVisible();
  await staffRow.getByLabel("Enable Login", { exact: true }).check();
  await staffRow
    .getByRole("button", { name: "Save access", exact: true })
    .click();
  await expect(staffRow.getByRole("status")).toHaveText(
    "Account access saved.",
  );
  await login(staffPage, staffEmail, password);
  await expect(staffPage).toHaveURL(/\/calendar$/);
  await staffContext.close();
});
