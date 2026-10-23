"use client";

import { env } from "@/env";
import { useState } from "react";

export default function EnvBanner() {
  const app_env = env.APP_ENV;
  const [showBanner, setShowBanner] = useState(true);

  const bannerMessage =
    app_env === "staging"
      ? "This is a development environment. It may contain non-accurate test data and should not be used for real-world applications. Data will be deleted regularly."
      : app_env === "demo"
        ? "This is a demonstration environment. It may contain non-accurate test data and should not be used for real-world applications. Data will be deleted regularly."
        : null;

  return (
    bannerMessage &&
    showBanner && (
      <div className="w-full bg-amber-600 text-white px-4 py-2 text-sm font-medium flex items-start justify-center shadow-md relative">
        <p className="text-center max-w-5xl">{bannerMessage}</p>
        <button
          onClick={() => setShowBanner(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    )
  );
}
