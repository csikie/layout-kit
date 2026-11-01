import { expect, test } from "vite-plus/test";
import {
  createBreadcrumbRegistry,
  applyBreadcrumbRegistrations,
} from "@/components/ui/app-breadcrumb/registry";
const fallback = [{ id: "page", label: "Fallback" }];

test("lease cleanup is idempotent and cannot delete a newer same-scope registration", () => {
  const registry = createBreadcrumbRegistry();
  const old = registry.register({ scope: "p", items: [{ id: "old", label: "Old" }] });
  old();
  const dispose = registry.register({ scope: "p", items: [{ id: "new", label: "New" }] });
  const snapshot = registry.getSnapshot();
  old();
  expect(registry.getSnapshot()).toBe(snapshot);
  expect(applyBreadcrumbRegistrations(fallback, "p", snapshot)[0]?.label).toBe("New");
  dispose();
  expect(registry.getSnapshot()).toEqual([]);
});
test("conflicting owners fail without replacing the existing contribution", () => {
  const registry = createBreadcrumbRegistry();
  registry.register({ scope: "p", items: [{ id: "page", label: "Owner" }] });
  expect(() => registry.register({ scope: "p", items: [] })).toThrow("Only one page");
  registry.register({ scope: "p", routeLabels: { page: "Label" } });
  expect(() => registry.register({ scope: "p", routeLabels: { page: "Conflicting" } })).toThrow(
    "Multiple breadcrumb label owners",
  );
  expect(applyBreadcrumbRegistrations(fallback, "p", registry.getSnapshot())[0]?.label).toBe(
    "Label",
  );
});

test("the server snapshot stays stable after client registrations", () => {
  const registry = createBreadcrumbRegistry();
  const initial = registry.getServerSnapshot();
  registry.register({ scope: "p", items: [{ id: "page", label: "Client page" }] });
  expect(registry.getServerSnapshot()).toBe(initial);
  expect(initial).toEqual([]);
  expect(registry.getSnapshot()).toHaveLength(1);
});
