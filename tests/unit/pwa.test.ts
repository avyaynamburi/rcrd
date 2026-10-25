import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";

describe("PWA lifecycle", () => {
  it("provides standalone installation and both icon sizes", () => {
    expect(manifest()).toMatchObject({
      id: "/",
      start_url: "/",
      scope: "/",
      display: "standalone",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192" },
        { src: "/icons/icon-512.png", sizes: "512x512" },
      ],
    });
  });
  it("activates only on explicit request and never caches requests", () => {
    const handlers = new Map<string, (event: unknown) => void>();
    const skipWaiting = vi.fn();
    const claim = vi.fn().mockResolvedValue(undefined);
    runInNewContext(readFileSync("public/sw.js", "utf8"), {
      self: {
        addEventListener: (name: string, handler: (event: unknown) => void) =>
          handlers.set(name, handler),
        skipWaiting,
        clients: { claim },
      },
    });
    expect(handlers.has("fetch")).toBe(false);
    expect(skipWaiting).not.toHaveBeenCalled();
    handlers.get("message")?.({ data: { type: "OTHER" } });
    expect(skipWaiting).not.toHaveBeenCalled();
    handlers.get("message")?.({ data: { type: "ACTIVATE_UPDATE" } });
    expect(skipWaiting).toHaveBeenCalledOnce();
    const waitUntil = vi.fn();
    handlers.get("activate")?.({ waitUntil });
    expect(claim).toHaveBeenCalledOnce();
    expect(waitUntil).toHaveBeenCalledOnce();
  });
});
