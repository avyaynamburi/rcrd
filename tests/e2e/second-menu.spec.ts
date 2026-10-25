import { expect, test } from "@playwright/test";

test("second menu supports multiple groups, page selection and remembered state", async ({
  page,
}) => {
  await page.goto("/settings");
  const menu = page.getByRole("navigation", { name: "Section navigation" });
  await menu.getByRole("button", { name: "Practice", exact: true }).click();
  await menu.getByRole("button", { name: "Payment Mode", exact: true }).click();
  await menu.getByRole("link", { name: "Clinic", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Clinic", exact: true }),
  ).toBeVisible();
  await expect(
    menu.getByRole("link", { name: "Clinic", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.reload();
  await expect(
    menu.getByRole("button", { name: "Practice", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    menu.getByRole("button", { name: "Payment Mode", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  const bounds = await menu.boundingBox();
  expect(bounds?.x).toBe(70);
  expect(bounds?.width).toBe(290);
  await menu.getByRole("button", { name: "Practice", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    menu.getByRole("link", { name: "Clinic", exact: true }),
  ).toBeHidden();
  await page.getByRole("link", { name: "Need Help?" }).click();
  await expect(
    page.getByRole("heading", { name: "Using the second menu" }),
  ).toBeVisible();
});

test("all second menus work when storage is denied and fit phone screens", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Storage denied");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage denied");
    };
  });
  for (const [section, group, item] of [
    ["admin", "Team", "Access Audit"],
    ["crm", "Practice Growth", "Patient Tracker"],
    ["notifications", "Alert", "Recent Features"],
  ]) {
    await page.goto(`/${section}`);
    const menu = page.getByRole("navigation", { name: "Section navigation" });
    await menu.getByRole("button", { name: group, exact: true }).click();
    await menu.getByRole("link", { name: item, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: item, exact: true }),
    ).toBeVisible();
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.goto("/calendar");
  await expect(
    page.getByRole("navigation", { name: "Section navigation" }),
  ).toHaveCount(0);
});
