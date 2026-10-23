"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { initPostHog } from "@/src/lib/analytics";

// useSearchParams makes the nearest Suspense boundary render on the client
// only, so it lives in its own component with its own boundary. Wrapping the
// whole app in it would turn every static page (including the landing page)
// into an empty HTML shell.
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // React runs child effects before parent effects, so this tracker's first
    // pageview would reach posthog before the provider's own init. Init is
    // idempotent: call it here too so the pageview is never dropped.
    initPostHog();
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

export default PostHogProvider;
