import type { ReactNode } from "react";

import { Providers } from "@/app/providers";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="base:app_id" content="69cb445fa7654b8774320f28" />
        <meta
          name="talentapp:project_verification"
          content="289ae01750d59ec470ff2db1f8d6bb627e14f32aacc3a2c70463e86889283fd1186b85806f4792bd62c986139410f8b4caee35f19b5fc1ef9c3d6e9c23b42726"
        />
        {/* BASE_APP_ID_PLACEHOLDER */}
        {/* TALENT_VERIFICATION_PLACEHOLDER */}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}