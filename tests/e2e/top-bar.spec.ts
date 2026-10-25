import { expect, test } from "@playwright/test";

test("clinic top bar fits the shell and explains its setup state", async ({
  page,
}) => {
  for (const width of [1366, 1920, 375]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto("/calendar");
    const bar = page.getByRole("banner", { name: "Clinic top bar" });
    await expect(bar).toBeVisible();
    await expect(bar).toContainText("Clinic not configured");
    await expect(
      bar.getByRole("link", { name: "Back", exact: true }),
    ).toHaveCount(0);
    const bounds = await bar.boundingBox();
    expect(bounds?.height).toBe(60);
    expect(bounds?.x).toBe(70);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
  }
  await page.goto("/");
  await page.getByRole("link", { name: "Need Help?", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Using the top bar" }),
  ).toBeVisible();
});
