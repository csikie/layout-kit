// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import { TasksDemo } from "@/components/demos/data-table/tasks-demo";

async function click(element: Element | null | undefined) {
  expect(element).toBeTruthy();
  await act(async () => (element as HTMLElement).click());
}
function button(text: string) {
  return [...document.querySelectorAll("button")].find((item) => item.textContent === text);
}

test("full reset restores records, table state, filter search and generated IDs", async () => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(TasksDemo, { mode: "controlled" })));
    await click(button("Add sample task"));
    expect(container.textContent).toContain("101 tasks in this local demo");
    expect(container.querySelector("tbody tr")?.textContent).toContain("TASK-2001");
    await click(container.querySelector('button[aria-label="Actions for TASK-1001"]'));
    await click(
      [...document.querySelectorAll('[role="menuitem"]')].find(
        (item) => item.textContent === "Delete",
      ),
    );
    expect(container.querySelector('button[aria-label="Actions for TASK-1001"]')).toBeNull();
    await click(container.querySelector('[role="checkbox"][aria-label="Select row"]'));
    await click(button("Priority"));
    const input = document.querySelector<HTMLInputElement>('input[placeholder="Search options…"]')!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "Low");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await click(document.querySelector('[role="checkbox"][aria-label="Low"]'));
    expect(
      document.querySelector('[role="checkbox"][aria-label="Low"]')?.getAttribute("aria-checked"),
    ).toBe("true");
    await click(button("Reset table state"));
    expect(container.textContent).toContain("100 tasks in this local demo");
    expect(container.querySelector("tbody tr")?.textContent).toContain("TASK-1001");
    expect(container.textContent).not.toContain("TASK-2001");
    expect(container.textContent).toContain("0 of 100 row(s) selected");
    expect(container.textContent).toContain("Page 1 of 10");
    expect(
      container.querySelector('input[placeholder="Filter tasks…"]')?.getAttribute("value"),
    ).toBe("");
    expect(JSON.parse(container.querySelector("details pre")!.textContent!).columnFilters).toEqual(
      [],
    );
    await click(button("Priority"));
    expect(
      document.querySelector<HTMLInputElement>('input[placeholder="Search options…"]')?.value,
    ).toBe("");
    expect(
      document.querySelector('[role="checkbox"][aria-label="Low"]')?.getAttribute("aria-checked"),
    ).toBe("false");
    await click(button("Reset table state"));
    await click(button("Add sample task"));
    expect(container.querySelector("tbody tr")?.textContent).toContain("TASK-2001");
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
