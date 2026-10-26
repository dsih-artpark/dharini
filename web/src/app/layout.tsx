import { Provider } from "jotai";
import type { Metadata } from "next";
import Script from "next/script";
import { ToastContainer, Zoom } from "react-toastify";

import EnvBanner from "../components/nav/env-banner";
import "./globals.css";

// Pages are rendered per request so they use the settings the container was
// started with (see env.ts), not the ones present when the image was built.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dharini",
  description: "Dharini",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <Script src="/runtime-config" strategy="beforeInteractive" />
        <EnvBanner />
        <Provider>
          {children}
          <ToastContainer
            position="bottom-center"
            pauseOnFocusLoss={false}
            limit={3}
            transition={Zoom}
            hideProgressBar={true}
            autoClose={2000}
            theme="colored"
            icon={false}
          />
        </Provider>
      </body>
    </html>
  );
}
