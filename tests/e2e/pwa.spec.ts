import { expect, test } from "@playwright/test";

test("installs the worker and serves a standalone manifest without caching clinic data", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration?.active?.state;
      }),
    )
    .toBe("activated");
  expect(await page.evaluate(() => caches.keys())).toEqual([]);
  const worker = await request.get("/sw.js");
  expect(worker.headers()["cache-control"]).toContain("no-store");
  await page.getByRole("link", { name: "Need Help?" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Rcrd shortcut" }),
  ).toBeVisible();
});

test("offers a waiting update without reloading current work", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const worker = {
      postMessage: () => {
        document.documentElement.dataset.updateRequested = "true";
      },
    };
    Object.defineProperty(navigator, "serviceWorker", {
      value: {
        controller: {},
        register: async () => ({
          waiting: worker,
          installing: null,
          addEventListener() {},
          removeEventListener() {},
          update: async () => {},
        }),
      },
    });
  });
  await page.goto("/");
  const apply = page.getByRole("button", { name: "Apply update" });
  await expect(apply).toBeVisible();
  await apply.click();
  await expect(page.getByRole("status")).toContainText("Update requested");
  await expect(page.locator("html")).toHaveAttribute(
    "data-update-requested",
    "true",
  );
  await expect(apply).toHaveCount(0);
});

test("keeps the workspace usable when registration fails", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "serviceWorker", {
      value: {
        register: async () => {
          throw new Error("offline");
        },
      },
    });
  });
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "App updates are unavailable",
  );
  await expect(page.getByRole("link", { name: "Need Help?" })).toBeVisible();
});
