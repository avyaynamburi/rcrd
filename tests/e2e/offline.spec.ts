import { expect, test } from "@playwright/test";

test("server outage preserves typed contents, blocks submit, and recovers", async ({
  page,
}) => {
  await page.goto("/calendar");
  await expect(
    page.getByRole("status", { name: "Server reachable" }),
  ).toBeVisible();
  // Synthetic unfinished form exercises the shell guard without adding a clinic write path.
  await page.locator("main").evaluate((main) => {
    const form = document.createElement("form");
    form.innerHTML =
      '<label>Draft note<textarea name="note"></textarea></label><button type="submit">Save draft</button>';
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.dataset.submitted = "yes";
    });
    main.append(form);
  });
  await page.getByLabel("Draft note").fill("Synthetic unsaved draft");
  await page.route("**/api/health", (route) => route.fulfill({ status: 503 }));
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  const warning = page
    .getByRole("alert")
    .filter({ hasText: "Changes can’t be saved" });
  await expect(warning).toBeVisible();
  await expect(
    page.getByRole("status", { name: "Server unavailable" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(
    page.locator("form").filter({ has: page.getByLabel("Draft note") }),
  ).not.toHaveAttribute("data-submitted", "yes");
  await expect(page.getByLabel("Draft note")).toHaveValue(
    "Synthetic unsaved draft",
  );
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Rcrd", exact: true }),
  ).not.toBeVisible();
  await warning.getByRole("button", { name: "Need Help?" }).click();
  await expect(
    page.getByRole("heading", { name: "When the connection is unavailable" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.unroute("**/api/health");
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(warning).toHaveCount(0);
  await expect(page.getByLabel("Draft note")).toHaveValue(
    "Synthetic unsaved draft",
  );
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(
    page.locator("form").filter({ has: page.getByLabel("Draft note") }),
  ).toHaveAttribute("data-submitted", "yes");
});

test("device offline warning fits phones and recovers without a reload", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/calendar");
  await page.getByRole("button", { name: "More", exact: true }).click();
  await expect(page.getByText(/^Server reachable · v/)).toBeVisible();
  await page.keyboard.press("Escape");
  await context.setOffline(true);
  const warning = page
    .getByRole("alert")
    .filter({ hasText: "Changes can’t be saved" });
  await expect(warning).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.setOffline(false);
  await expect(warning).toHaveCount(0);
});
