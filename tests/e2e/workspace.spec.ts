import { expect, test } from "@playwright/test";
test("workspace and help are available without clinic data", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Rcrd");
  await expect(
    page.getByRole("heading", { name: "Your clinic workspace starts here" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Need Help?" }).click();
  await expect(
    page.getByRole("heading", { name: "Workspace setup" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to workspace" }).click();
  await expect(page).toHaveURL("/");
});
test("workspace fits small screens and supports keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
