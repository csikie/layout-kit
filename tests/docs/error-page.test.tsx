// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import ErrorPage from "@/app/error";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  vi.spyOn(console, "error").mockImplementation(() => {});
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

test("logs the error, shows its digest and retries on demand", () => {
  const error = Object.assign(new Error("boom"), { digest: "abc123" });
  const retry = vi.fn();
  act(() => root.render(<ErrorPage error={error} retry={retry} />));

  expect(console.error).toHaveBeenCalledWith(error);
  expect(container.querySelector("h1")?.textContent).toContain("Something went wrong");
  expect(container.textContent).toContain("Reference: abc123");
  expect(container.querySelector('a[href="/"]')).not.toBeNull();

  const button = [...container.querySelectorAll("button")].find(
    (candidate) => candidate.textContent === "Try again",
  );
  act(() => button?.click());
  expect(retry).toHaveBeenCalledOnce();
});

test("omits the reference for values thrown without a digest", () => {
  act(() => root.render(<ErrorPage error="plain string" retry={() => {}} />));
  expect(container.textContent).not.toContain("Reference:");
});
