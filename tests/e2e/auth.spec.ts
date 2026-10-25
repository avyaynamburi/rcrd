import { expect, test } from "@playwright/test";

test("individual login shows configuration state and links recovery and help", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Sign in", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Email or mobile number")).toHaveAttribute(
    "autocomplete",
    "username",
  );
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "password",
  );
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("status").filter({ hasText: "Sign-in is not configured" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("heading", { name: "Reset your password" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
    "type",
    "email",
  );
  await expect(
    page.getByRole("button", { name: "Send reset link" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Need Help?" }).click();
  await expect(page.getByRole("dialog")).toContainText("Your clinic account");
});

test("invalid recovery link has a clear retry path and no open redirect", async ({
  page,
}) => {
  await page.goto(
    "/auth/confirm?token_hash=invalid&type=signup&next=https://example.invalid",
  );
  await expect(page).toHaveURL(/\/forgot-password\?invalid=1$/);
  await expect(
    page.getByRole("alert").filter({ hasText: "invalid or expired" }),
  ).toBeVisible();
});

test("password form fits a phone and never stores credentials in browser storage", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/account/password");
  await expect(
    page.getByRole("heading", { name: "Change password" }),
  ).toBeVisible();
  await page
    .getByLabel("New password", { exact: true })
    .fill("synthetic-password");
  await page.getByLabel("Confirm new password").fill("synthetic-password");
  await expect(
    page.getByRole("button", { name: "Save password" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(() =>
      JSON.stringify({ ...localStorage, ...sessionStorage }),
    ),
  ).not.toContain("synthetic-password");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
