"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
const convex = new ConvexReactClient(url);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!url) {
    return (
      <div className="config-screen">
        <h1>Set Convex URL</h1>
        <p>
          Create <code>.env.local</code> with{" "}
          <code>NEXT_PUBLIC_CONVEX_URL</code> from your project in the Convex
          dashboard, then restart <code>next dev</code>.
        </p>
        <p className="config-hint">
          Run <code>npm run dev:convex</code> if you still need to link this
          folder to a deployment.
        </p>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
