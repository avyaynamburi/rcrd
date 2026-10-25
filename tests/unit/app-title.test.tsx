import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppTitle } from "@/components/shell/app-title";

describe("clinic top bar", () => {
  it("shows a truthful setup state without inventing a clinic or back destination", () => {
    const html = renderToStaticMarkup(<AppTitle organisationName="  " />);
    expect(html).toContain("Clinic not configured");
    expect(html).not.toContain("<a");
  });
  it("accepts trusted organisation context, a back destination and screen controls", () => {
    const html = renderToStaticMarkup(
      <AppTitle
        organisationName="  Synthetic Clinic  "
        backHref="/patients"
        controls={<button>Calendar controls</button>}
      />,
    );
    expect(html).toContain('title="Synthetic Clinic"');
    expect(html).toContain('href="/patients"');
    expect(html).toContain('aria-label="Back"');
    expect(html).toContain("Calendar controls");
  });
});
