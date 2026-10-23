import type { Metadata } from "next";

import PrivacyPolicy from "@/src/components/landing/privacy/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy · Dharini",
  description:
    "What information Dharini collects, how it is stored and protected, with whom it is shared, and the choices available to you.",
};

export default function Privacy() {
  return <PrivacyPolicy />;
}
