"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AppBreadcrumb } from "./app-breadcrumb";
import { resolveBreadcrumbs } from "./resolve";
import {
  createBreadcrumbRegistry,
  applyBreadcrumbRegistrations,
  type BreadcrumbRegistry,
} from "./registry";
import type { BreadcrumbAppearance, BreadcrumbEntry } from "./types";
import type {
  BreadcrumbProviderProps,
  ContextBreadcrumbProps,
  PageBreadcrumbsOptions,
} from "./context-types";

const RegistryContext = createContext<BreadcrumbRegistry | null>(null);
const ConfigurationContext = createContext<{
  scope: string;
  fallback: readonly BreadcrumbEntry[];
  appearance: BreadcrumbAppearance;
} | null>(null);
const useRegistrationEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function BreadcrumbProvider<TData = unknown>(props: BreadcrumbProviderProps<TData>) {
  const [registry] = useState(createBreadcrumbRegistry);
  if (!props.scope) throw new Error("BreadcrumbProvider requires a nonempty active scope.");
  const fallback = props.items ?? resolveBreadcrumbs(props);
  const {
    scope,
    labels,
    className,
    separator,
    maxVisibleItems,
    compactMaxVisibleItems,
    renderLink,
  } = props;
  const configuration = useMemo(
    () => ({
      scope,
      fallback,
      appearance: {
        labels,
        className,
        separator,
        maxVisibleItems,
        compactMaxVisibleItems,
        renderLink,
      },
    }),
    [
      scope,
      fallback,
      labels,
      className,
      separator,
      maxVisibleItems,
      compactMaxVisibleItems,
      renderLink,
    ],
  );
  return (
    <RegistryContext.Provider value={registry}>
      <ConfigurationContext.Provider value={configuration}>
        {props.children}
      </ConfigurationContext.Provider>
    </RegistryContext.Provider>
  );
}

/** Publishes declarative page-owned items or ID-based labels, with automatic cleanup. */
function usePageBreadcrumbs(options: PageBreadcrumbsOptions): void {
  const registry = useContext(RegistryContext);
  if (!registry) throw new Error("usePageBreadcrumbs must be used inside BreadcrumbProvider.");
  const { scope, enabled = true, items, routeLabels } = options;
  useRegistrationEffect(() => {
    if (!enabled) return;
    return registry.register(
      items !== undefined ? { scope, items } : { scope, routeLabels: routeLabels! },
    );
  }, [registry, scope, enabled, items, routeLabels]);
}

/** Reads the provider's active trail. Render in the layout independently of the page. */
function ContextBreadcrumb(props: ContextBreadcrumbProps) {
  const registry = useContext(RegistryContext);
  const configuration = useContext(ConfigurationContext);
  if (!registry || !configuration)
    throw new Error("ContextBreadcrumb must be used inside BreadcrumbProvider.");
  const registrations = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getServerSnapshot,
  );
  const items = applyBreadcrumbRegistrations(
    configuration.fallback,
    configuration.scope,
    registrations,
  );
  return (
    <AppBreadcrumb
      {...configuration.appearance}
      {...props}
      labels={{ ...configuration.appearance.labels, ...props.labels }}
      items={items}
    />
  );
}

export { BreadcrumbProvider, usePageBreadcrumbs, ContextBreadcrumb };
