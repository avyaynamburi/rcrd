import { expect, test } from "@playwright/test";

test("rail navigation, version and unfinished tools", async ({ page }) => {
  await page.goto("/");
  const rail = page.getByRole("navigation", { name: "Main navigation" });
  await expect(rail).toHaveCSS("width", "70px");
  await expect(rail.getByRole("link")).toHaveCount(10);
  await expect(rail.getByRole("status")).toHaveAccessibleName(
    "Server reachable",
  );
  await expect(rail.getByText("New", { exact: true })).toBeVisible();
  await expect(rail.getByText(/^v\d+\.\d+\.\d+$/)).toBeVisible();
  await expect(
    rail.getByRole("button", { name: "Logout", exact: true }),
  ).toBeEnabled();
  await rail.getByRole("link", { name: "Patients", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Patients" })).toBeVisible();
  await expect(
    rail.getByRole("link", { name: "Patients", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByText(/This tool is not available yet/)).toBeVisible();
  await page.getByRole("link", { name: "Need Help?" }).click();
  await expect(
    page.getByRole("heading", { name: "Workspace setup" }),
  ).toBeVisible();
});

test("connection indicator detects server failure and reconnects", async ({
  page,
}) => {
  await page.route("**/api/health", (route) => route.fulfill({ status: 503 }));
  await page.goto("/");
  await expect(
    page.getByRole("status", { name: "Server unavailable" }),
  ).toBeVisible();
  await page.unroute("**/api/health");
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(
    page.getByRole("status", { name: "Server reachable" }),
  ).toBeVisible();
});

test("rail fits desktop sizes and remains keyboard accessible", async ({
  page,
}) => {
  for (const width of [1366, 1920]) {
    await page.setViewportSize({ width, height: width === 1366 ? 768 : 1080 });
    await page.goto("/");
    const rail = page.getByRole("navigation");
    await expect(rail.getByText(/^v\d/)).toBeInViewport();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Dashboard", exact: true }),
  ).toBeFocused();
});
