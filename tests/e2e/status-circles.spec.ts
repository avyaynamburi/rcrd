import { expect, test } from "@playwright/test";

test("status circles truthfully show unavailable counts and open each Today filter", async ({
  page,
}) => {
  await page.goto("/calendar");
  const statuses = page.getByRole("navigation", {
    name: "Today's appointment statuses",
  });
  await expect(statuses.getByRole("link")).toHaveCount(7);
  for (const label of [
    "Total today",
    "Scheduled",
    "Checked in",
    "Engaged",
    "Checked out",
    "Missed",
    "Cancelled",
  ]) {
    const link = statuses.getByRole("link", {
      name: `${label}: Unavailable`,
      exact: false,
    });
    await expect(link).toHaveText("—");
    await expect(link).toHaveAttribute("title", /Unavailable/);
    await link.click();
    await expect(
      page.getByRole("heading", {
        name: `Today panel filter: ${label}`,
        exact: true,
      }),
    ).toBeVisible();
  }
  await statuses.getByRole("link").first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/todayStatus=all#today-panel/);
  await page.goto("/help/workspace");
  await expect(
    page.getByRole("heading", { name: "Today's status circles" }),
  ).toBeVisible();
});

test("clock uses India time and updates at a minute boundary", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-08-03T19:29:59Z") });
  await page.goto("/calendar");
  const clock = page.getByLabel("Clinic date and time");
  await expect(clock).toContainText("4 Aug 2026");
  await expect(clock).toContainText("12:59 am");
  await page.clock.runFor(2000);
  await expect(clock).toContainText("1:00 am");
});
