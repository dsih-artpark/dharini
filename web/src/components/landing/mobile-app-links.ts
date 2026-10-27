import { Globe, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { env } from "@/env";

export type LandingLink = { href: string; label: string; Icon: LucideIcon };

// The field app ships as an Android APK and as a web build of the same Flutter
// app. Each link is shown only when its deployment setting is set. A function
// rather than a constant so the settings are read at render time (see env.ts).
export function mobileAppLinks(): LandingLink[] {
  const apkUrl = env.APK_DOWNLOAD_URL;
  const webUrl = env.MOBILE_WEB_URL;
  const links: LandingLink[] = [];
  if (apkUrl) {
    links.push({ href: apkUrl, label: "Android app", Icon: Smartphone });
  }
  if (webUrl) {
    links.push({ href: webUrl, label: "Mobile web", Icon: Globe });
  }
  return links;
}
