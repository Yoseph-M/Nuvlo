import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { RouteTransition } from "../components/transitions/RouteTransition";
import { SiteNav } from "../components/nav/SiteNav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This stay isn't on the map.</p>
        <Link to="/" className="mt-6 inline-block border-b border-ink pb-1 text-xs uppercase tracking-[0.2em]">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something stalled.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again, or head home.</p>
        <div className="mt-6 flex justify-center gap-4 text-xs uppercase tracking-[0.2em]">
          <button onClick={() => { router.invalidate(); reset(); }} className="border-b border-ink pb-1">Retry</button>
          <a href="/" className="border-b border-ink pb-1">Home</a>
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
      { title: "Bet · ቤት — Considered stays across Ethiopia" },
      { name: "description", content: "Hand-edited short-term homes across Addis Ababa, Lalibela, Gondar, Bahir Dar, Axum, Harar and the Simien — booked in Birr, hosted by Ethiopians." },
      { name: "author", content: "Bet" },
      { property: "og:title", content: "Bet · ቤት — Considered stays across Ethiopia" },
      { property: "og:description", content: "Short-term homes across Ethiopia, hosted by Ethiopians." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
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
      <SiteNav />
      <RouteTransition>
        <Outlet />
      </RouteTransition>
    </QueryClientProvider>
  );
}
