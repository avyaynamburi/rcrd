import { test, expect } from "@playwright/test";
test("audit page and exports require an authenticated owner", async ({
  page,
  request,
}) => {
  await page.goto("/admin/access-audit");
  await expect(page).toHaveURL(/\/login/);
  for (const format of ["xlsx", "pdf"]) {
    const response = await request.get(`/api/access-audit?format=${format}`);
    expect(response.status()).toBe(403);
  }
});
