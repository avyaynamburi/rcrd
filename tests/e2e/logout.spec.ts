import { expect, test } from "@playwright/test";

test("logout confirms, cancels safely and reports missing authentication", async ({
  page,
}) => {
  await page.goto("/patients");
  const logout = page.getByRole("button", { name: "Logout", exact: true });
  const dialog = page.getByRole("dialog", { name: "Rcrd", exact: true });
  await logout.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription(
    "Are you sure you want to logout?",
  );
  await expect(
    dialog.getByRole("button", { name: "No", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Yes", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "No", exact: true }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: "No", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(logout).toBeFocused();
  await expect(page).toHaveURL(/\/patients$/);
  await logout.click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(logout).toBeFocused();
  await logout.click();
  await dialog.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Sign-in is not configured yet",
  );
  await expect(page).toHaveURL(/\/patients$/);
  await dialog.getByRole("button", { name: "No", exact: true }).click();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "More", exact: true }).click();
  await logout.click();
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await expect(dialog).toBeInViewport();
  await expect(
    dialog.getByRole("button", { name: "Yes", exact: true }),
  ).toBeInViewport();
});
