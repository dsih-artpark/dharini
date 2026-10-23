import React from "react";

import AuthDialogProvider from "./auth/auth-dialog-provider";
import type { AuthMode } from "./auth/auth-dialog";
import Devices from "./devices";
import Footer from "./footer";
import Hero from "./hero";
import HowItWorks from "./how-it-works";
import Nav from "./nav";
import Partners from "./partners";
import { PageShell } from "./ui";

// Server-rendered marketing page. Only the nav, the rotating diagram and the
// auth dialog are client components.
export default function LandingPage({
  initialAuthMode = null,
}: {
  initialAuthMode?: AuthMode | null;
}) {
  return (
    <AuthDialogProvider initialMode={initialAuthMode}>
      <PageShell>
        <Nav />
        <main>
          <Hero />
          <HowItWorks />
          <Devices />
          <Partners />
        </main>
        <Footer />
      </PageShell>
    </AuthDialogProvider>
  );
}
