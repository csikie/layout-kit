import "server-only";
import { createHighlighter, type BundledLanguage } from "shiki";

const languages = ["tsx", "ts", "css", "bash", "json"] satisfies BundledLanguage[];
export type CodeLanguage = (typeof languages)[number];

const highlighterPromise = createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: languages,
});

/** Produces dual-theme HTML; globals.css swaps the palette per theme. */
export async function highlight(code: string, lang: CodeLanguage = "tsx") {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
