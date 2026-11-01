import type { BreadcrumbEntry } from "./types";
import type { PageBreadcrumbsOptions } from "./context-types";

interface BreadcrumbRegistration {
  lease: symbol;
  options: PageBreadcrumbsOptions;
}
/** One registry per provider; immutable snapshots make React subscriptions deterministic. */
function createBreadcrumbRegistry() {
  const serverSnapshot: readonly BreadcrumbRegistration[] = [];
  let snapshot = serverSnapshot;
  const listeners = new Set<() => void>();
  const publish = (next: readonly BreadcrumbRegistration[]) => {
    snapshot = next;
    for (const listener of listeners) listener();
  };
  return {
    getSnapshot: () => snapshot,
    // Hydration must read the same fallback snapshot even if a sibling page committed first.
    getServerSnapshot: () => serverSnapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    register: (options: PageBreadcrumbsOptions) => {
      if (!options.scope) throw new Error("Page breadcrumbs require a nonempty scope.");
      for (const registration of snapshot) {
        const other = registration.options;
        if (other.scope !== options.scope) continue;
        if (options.items !== undefined && other.items !== undefined) {
          throw new Error(`Only one page may own breadcrumb items for scope: ${options.scope}`);
        }
        for (const id of Object.keys(options.routeLabels ?? {})) {
          if (Object.hasOwn(other.routeLabels ?? {}, id)) {
            throw new Error(
              `Multiple breadcrumb label owners for ${id} in scope: ${options.scope}`,
            );
          }
        }
      }
      const lease = Symbol(options.scope);
      publish([...snapshot, { lease, options }]);
      return () => {
        // An old cleanup cannot remove a newer registration, even within the same scope.
        if (snapshot.some((registration) => registration.lease === lease)) {
          publish(snapshot.filter((registration) => registration.lease !== lease));
        }
      };
    },
  };
}
type BreadcrumbRegistry = ReturnType<typeof createBreadcrumbRegistry>;

function applyBreadcrumbRegistrations(
  fallback: readonly BreadcrumbEntry[],
  scope: string,
  registrations: readonly BreadcrumbRegistration[],
): readonly BreadcrumbEntry[] {
  const active = registrations.filter((registration) => registration.options.scope === scope);
  const owner = active.find((registration) => registration.options.items !== undefined);
  const items = owner?.options.items ?? fallback;
  const labels = new Map(
    active.flatMap(({ options }) => Object.entries(options.routeLabels ?? {})),
  );
  return items.map((item) => {
    const label = labels.get(item.id);
    // Unavailable partial data preserves the provider's fallback/loading label.
    return label === undefined || label === null || typeof label === "boolean" || label === ""
      ? item
      : { ...item, label, pending: false };
  });
}

export { createBreadcrumbRegistry, applyBreadcrumbRegistrations };
export type { BreadcrumbRegistration, BreadcrumbRegistry };
