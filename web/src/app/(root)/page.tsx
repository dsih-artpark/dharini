import type { Metadata } from "next";

import LandingPage from "@/src/components/landing/landing-page";

const TITLE = "Dharini · One Health disease surveillance";
const DESCRIPTION =
  "Dharini connects field sample collection, laboratory workflows and genomic surveillance in one record, so teams can understand disease risk across animals and the environment.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Dharini",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
