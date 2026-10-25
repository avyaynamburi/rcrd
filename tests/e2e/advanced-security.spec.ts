import { expect, test } from "@playwright/test";

test("Clinic shows unavailable Advanced Security with an accessible explanation and help", async ({
  page,
}) => {
  await page.goto("/settings/clinic");
  await expect(
    page.getByRole("heading", { name: "Clinic", exact: true }),
  ).toBeVisible();
  const toggle = page.getByRole("checkbox", {
    name: "Advanced Security",
    exact: true,
  });
  await expect(toggle).toBeDisabled();
  await expect(toggle).not.toBeChecked();
  await expect(
    page.getByRole("status").filter({ hasText: "Two-step verification" }),
  ).toContainText("have not been connected");
  await page.getByText("About Advanced Security", { exact: true }).click();
  await expect(
    page.getByText(/Requires a second verification step/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Need Help?" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "do not assume a session will expire",
  );
});

test("security settings fit a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/settings/clinic");
  await expect(
    page.getByRole("checkbox", { name: "Advanced Security", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
