import { expect, test } from "@playwright/test";

test("phone navigation exposes every destination and dismisses More", async ({
  page,
}) => {
  for (const width of [375, 700]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(nav).toBeInViewport();
    await expect(nav.getByRole("link")).toHaveCount(3);
    await nav.getByRole("link", { name: "Patients", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Patients" })).toBeVisible();
    const more = nav.getByRole("button", { name: "More", exact: true });
    await more.click();
    await expect(nav.getByRole("link")).toHaveCount(10);
    await expect(
      nav.getByRole("button", { name: "Logout", exact: true }),
    ).toBeInViewport();
    await page.keyboard.press("Escape");
    await expect(more).toBeFocused();
    await more.click();
    await nav.getByRole("link", { name: "Settings", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Settings", exact: true }),
    ).toBeVisible();
    await expect(
      nav.getByRole("button", { name: "Close navigation" }),
    ).toBeHidden();
    await more.click();
    await nav.getByRole("button", { name: "User account" }).click();
    await expect(
      page.getByRole("heading", { name: "User account" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("wide tablets and desktop keep the rail", async ({ page }) => {
  for (const width of [768, 1366, 1920]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInViewport();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeHidden();
  }
});
