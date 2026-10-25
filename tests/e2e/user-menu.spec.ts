import { expect, test } from "@playwright/test";

test("user account opens by keyboard, dismisses and links to help without a fabricated session", async ({
  page,
}) => {
  await page.goto("/patients");
  const trigger = page.getByRole("button", {
    name: "User account",
    exact: true,
  });
  const panel = page.locator("[popover]");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("Not signed in");
  await expect(panel).toContainText("Clinic sign-in is not configured");
  await expect(
    panel.getByRole("button", { name: "Change password" }),
  ).toBeDisabled();
  await expect(
    panel.getByRole("button", { name: "Switch center" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await panel.getByRole("button", { name: "Close", exact: true }).click();
  await expect(panel).not.toBeVisible();
  await trigger.click();
  await page.getByRole("heading", { name: "Patients", exact: true }).click();
  await expect(panel).not.toBeVisible();
  await trigger.click();
  await panel.getByRole("link", { name: "Need Help?" }).click();
  await expect(
    page.getByRole("heading", { name: "Using your user menu" }),
  ).toBeVisible();
  await expect(panel).not.toBeVisible();
  for (const width of [1920, 1366, 375]) {
    await page.setViewportSize({ width, height: 768 });
    await trigger.click();
    await expect(panel).toBeInViewport({ ratio: 1 });
    await expect(
      panel.getByRole("button", { name: "Close", exact: true }),
    ).toBeInViewport();
    await page.keyboard.press("Escape");
  }
});
