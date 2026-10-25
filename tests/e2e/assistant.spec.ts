import { expect, test } from "@playwright/test";

test("assistant greeting remembers dismissal and panel stays safely unavailable", async ({
  page,
}) => {
  await page.goto("/patients");
  await expect(
    page.getByText("I'm Rcrd Assistant — ask me anything"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Dismiss assistant greeting" })
    .click();
  await page.reload();
  await expect(
    page.getByText("I'm Rcrd Assistant — ask me anything"),
  ).toHaveCount(0);
  const trigger = page.getByRole("button", { name: "Open Rcrd Assistant" });
  for (const width of [1366, 1920, 375]) {
    await page.setViewportSize({ width, height: 768 });
    await expect(trigger).toBeInViewport({ ratio: 1 });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const panel = page.getByRole("dialog", { name: "Rcrd Assistant" });
    await expect(panel).toBeInViewport({ ratio: 1 });
    await expect(panel).toContainText("The assistant is not configured yet");
    await expect(panel.getByRole("textbox")).toBeDisabled();
    await expect(
      panel.getByRole("button", { name: "Send message" }),
    ).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await trigger.click();
  await page
    .getByRole("button", { name: "Close assistant", exact: true })
    .click();
  await expect(trigger).toBeFocused();
});

test("assistant remains usable when preference storage fails", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Unavailable");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Unavailable");
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Dismiss assistant greeting" })
    .click();
  await page.getByRole("button", { name: "Open Rcrd Assistant" }).click();
  await expect(
    page.getByRole("dialog", { name: "Rcrd Assistant" }),
  ).toBeVisible();
});
