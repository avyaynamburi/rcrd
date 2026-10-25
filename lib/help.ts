import { readFile } from "node:fs/promises";
import path from "node:path";

// Explicit public documentation allowlist; never resolve a user-supplied path.
export const helpKeys = [
  "advanced-security",
  "access-audit",
  "workspace",
  "accounts",
  "offline",
  "assistant",
  "user-menu",
  "screen-preview",
] as const;
export type HelpKey = (typeof helpKeys)[number];
export type HelpArticle = { title: string; paragraphs: string[] };
export type HelpArticles = Record<HelpKey, HelpArticle | null>;

export function parseHelpArticle(markdown: string): HelpArticle {
  const [heading, ...paragraphs] = markdown.trim().split(/\n\s*\n/);
  return {
    title: heading.replace(/^#\s+/, ""),
    paragraphs,
  };
}

export async function loadHelpArticles(): Promise<HelpArticles> {
  const entries = await Promise.all(
    helpKeys.map(async (key) => {
      try {
        const content = await readFile(
          path.join(process.cwd(), "docs/help", `${key}.md`),
          "utf8",
        );
        return [key, parseHelpArticle(content)] as const;
      } catch {
        return [key, null] as const;
      }
    }),
  );
  return Object.fromEntries(entries) as HelpArticles;
}
