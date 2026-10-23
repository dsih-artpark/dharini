import type { Metadata } from "next";

import LandingPage from "@/src/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Create your account · Dharini",
  description: "Create a Dharini workspace for your surveillance team.",
};

// Signup lives in a dialog on the landing page; this route opens it directly
// so existing /signup links keep working.
export default function Signup() {
  return <LandingPage initialAuthMode="signup" />;
}
