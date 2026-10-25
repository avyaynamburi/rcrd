import { describe, expect, it } from "vitest";
import { helpKeys, loadHelpArticles, parseHelpArticle } from "@/lib/help";

describe("public screen help", () => {
  it("loads every registered help key from repository articles", async () => {
    const articles = await loadHelpArticles();
    expect(Object.keys(articles)).toEqual([...helpKeys]);
    for (const article of Object.values(articles)) {
      expect(article?.title).toBeTruthy();
      expect(article?.paragraphs.length).toBeGreaterThan(0);
    }
  });
  it("preserves headings and inline text without interpreting HTML", () => {
    expect(
      parseHelpArticle("# Title\n\n## Topic\n\nText <script>alert(1)</script>"),
    ).toEqual({
      title: "Title",
      paragraphs: ["## Topic", "Text <script>alert(1)</script>"],
    });
  });
});
