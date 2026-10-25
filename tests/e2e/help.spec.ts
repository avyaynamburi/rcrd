import { expect, test } from "@playwright/test";

test("screen help preserves selection, traps focus and fits desktop and phone", async ({
  page,
}) => {
  await page.goto("/settings?page=Clinic");
  const trigger = page.getByRole("button", { name: "Need Help?", exact: true });
  for (const width of [1366, 1920, 375]) {
    await page.setViewportSize({ width, height: 768 });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const panel = page.getByRole("dialog", { name: "Clinic", exact: true });
    await expect(panel).toBeInViewport({ ratio: 1 });
    await expect(panel).toContainText("This screen is a setup preview");
    const close = panel.getByRole("button", { name: "Close help" });
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    expect(
      await panel.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(page).toHaveURL(/settings\?page=Clinic$/);
  }
});

test("assistant help opens above its panel and returns to it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Rcrd Assistant" }).click();
  const assistant = page.getByRole("dialog", {
    name: "Rcrd Assistant",
    exact: true,
  });
  const trigger = assistant.getByRole("button", { name: "Need Help?" });
  await trigger.click();
  const help = page
    .getByRole("dialog")
    .filter({ has: page.getByRole("button", { name: "Close help" }) });
  await expect(help).toContainText(
    "The setup preview uses a separate preference identity",
  );
  await help.getByRole("button", { name: "Close help" }).click();
  await expect(trigger).toBeFocused();
  await expect(assistant).toBeVisible();
});
