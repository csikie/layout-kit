// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";
import { Main } from "@/components/shell/main";
import { Providers } from "@/components/shell/providers";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/layout/stack" }));

// next-themes reads the system preference while rendering.
vi.stubGlobal("matchMedia", () => ({
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {},
}));

function renderShell() {
  document.body.innerHTML = renderToStaticMarkup(
    <Providers>
      <Main>
        <h1>Stack</h1>
      </Main>
    </Providers>,
  );
  return document.body;
}

test("the shell has one banner, one main, and one contentinfo landmark", () => {
  const body = renderShell();
  const main = body.querySelectorAll("main");
  expect(main).toHaveLength(1);
  expect(main[0]!.id).toBe("main-content");
  expect(main[0]!.querySelector("h1")?.textContent).toBe("Stack");

  // A header or footer outside <main> and sectioning content is the page's
  // banner or contentinfo landmark.
  const headers = [...body.querySelectorAll("header")];
  const footers = [...body.querySelectorAll("footer")];
  expect(
    headers.filter((header) => !header.closest("main, article, aside, nav, section")),
  ).toHaveLength(1);
  expect(
    footers.filter((footer) => !footer.closest("main, article, aside, nav, section")),
  ).toHaveLength(1);
  expect(main[0]!.querySelector("header, footer")).toBeNull();
});
