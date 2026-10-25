import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ToastMessage } from "@/components/blocks/toast-provider";

describe("toast messages", () => {
  it.each(["success", "error"] as const)(
    "renders an accessible %s with escaped plain text",
    (kind) => {
      const html = renderToStaticMarkup(
        <ToastMessage
          toast={{ kind, message: "<script>private</script>" }}
          onDismiss={() => {}}
        />,
      );
      expect(html).toContain(`toast-${kind}`);
      expect(html).toContain(`role="${kind === "error" ? "alert" : "status"}"`);
      expect(html).toContain(kind === "success" ? "Success:" : "Error:");
      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain('aria-label="Dismiss notification"');
    },
  );
});
