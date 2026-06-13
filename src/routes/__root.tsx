import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="neo-tile max-w-md p-10 text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-3 text-base text-muted-foreground">
          This page doesn't exist (yet).
        </p>
        <Link
          to="/"
          className="neo-press mt-6 inline-flex items-center justify-center rounded-full neo-border neo-shadow-sm bg-hot px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="neo-tile max-w-md p-10 text-center">
        <h1 className="font-display text-3xl">Whoops.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went sideways. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="neo-press rounded-full neo-border neo-shadow-sm bg-hot px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="neo-press rounded-full neo-border neo-shadow-sm bg-card px-5 py-2.5 text-sm font-bold uppercase tracking-wider"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Treasure — Resale valuation companion" },
      { name: "description", content: "Snap a photo, get a resale valuation. Organize vintage clothing, jewelry, and decor into a colorful inventory." },
      { name: "author", content: "Treasure" },
      { property: "og:title", content: "Treasure — Resale valuation companion" },
      { property: "og:description", content: "Snap, value, list. Your bold resale inventory companion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
