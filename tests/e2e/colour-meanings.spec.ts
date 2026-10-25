import { expect, test } from "@playwright/test";

test("shell uses semantic colours with named status indicators and help", async ({
  page,
}) => {
  await page.goto("/settings");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toHaveCSS("background-color", "rgb(30, 42, 74)");
  await expect(page.locator('.rail-item[aria-current="page"] svg')).toHaveCSS(
    "color",
    "rgb(224, 123, 57)",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "color",
    "rgb(30, 42, 74)",
  );
  const statuses = page.getByRole("navigation", {
    name: "Today's appointment statuses",
  });
  for (const [name, color] of [
    ["Checked in", "rgb(214, 69, 69)"],
    ["Engaged", "rgb(224, 123, 57)"],
    ["Checked out", "rgb(46, 158, 91)"],
    ["Missed", "rgb(75, 85, 99)"],
    ["Cancelled", "rgb(199, 204, 212)"],
  ]) {
    await expect(
      statuses.getByRole("link", { name: `${name}: Unavailable` }),
    ).toHaveCSS("border-top-color", color);
  }
  await page.goto("/");
  const help = page.getByRole("button", { name: "Need Help?" });
  await expect(help).toHaveCSS("color", "rgb(163, 77, 22)");
  await help.click();
  await expect(
    page.getByRole("heading", { name: "Colour meanings" }),
  ).toBeVisible();
});
