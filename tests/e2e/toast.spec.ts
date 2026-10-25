import { expect, test } from "@playwright/test";

test("logout failure stays visible after closing its dialog, across navigation and until dismissed", async ({
  page,
}) => {
  await page.goto("/patients");
  const notifications = page.getByRole("region", {
    name: "Notifications",
    exact: true,
  });
  await expect(notifications.getByRole("alert")).toHaveCount(0);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Rcrd", exact: true });
  await dialog.getByRole("button", { name: "Yes", exact: true }).click();
  await dialog.getByRole("button", { name: "No", exact: true }).click();
  await expect(notifications.getByRole("alert")).toContainText(
    "Sign-in is not configured yet",
  );
  await expect(notifications).toBeInViewport();
  await page.getByRole("link", { name: "Calendar", exact: true }).click();
  await expect(notifications.getByRole("alert")).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(notifications).toBeInViewport();
  const close = notifications.getByRole("button", {
    name: "Dismiss notification",
  });
  await close.focus();
  await page.keyboard.press("Enter");
  await expect(notifications.getByRole("alert")).toHaveCount(0);
});
