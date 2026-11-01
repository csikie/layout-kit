import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Renders an element to static markup and returns its root DOM node. */
export function render(element: ReactElement): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(element);
  const root = host.firstElementChild;
  if (!(root instanceof HTMLElement)) throw new Error("Nothing rendered");
  return root;
}

export function classes(element: Element): string[] {
  return (element.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
}
