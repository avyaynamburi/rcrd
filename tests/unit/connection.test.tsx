import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

const state = vi.hoisted(() => ({ connection: "checking" }));
vi.mock("@/components/shell/connection-provider", () => ({
  useConnection: () => state.connection,
}));

describe("save availability", () => {
  for (const connection of ["checking", "offline", "online"]) {
    it(`gates explicit and implicit submits while ${connection}`, () => {
      state.connection = connection;
      for (const type of [undefined, "submit"] as const) {
        const html = renderToStaticMarkup(<Button type={type}>Save</Button>);
        expect(html.includes('disabled=""')).toBe(connection !== "online");
      }
      expect(
        renderToStaticMarkup(<Button type="button">Cancel</Button>),
      ).not.toContain('disabled=""');
      expect(
        renderToStaticMarkup(<Button type="reset">Reset</Button>),
      ).not.toContain('disabled=""');
      expect(
        renderToStaticMarkup(
          <Button type="submit" disabled>
            Save
          </Button>,
        ),
      ).toContain('disabled=""');
    });
  }
});
