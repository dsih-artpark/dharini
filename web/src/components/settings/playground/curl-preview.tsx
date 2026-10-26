"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { env } from "@/env";
import { getAuthToken } from "@/src/utils/auth";

type ResponseType = "json" | "csv";

type CurlPreviewProps = {
  projectIds: string[];
  responseType: ResponseType;
};

export default function CurlPreview({
  projectIds,
  responseType,
}: CurlPreviewProps) {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getAuthToken()
      .then((value) => setToken(typeof value === "string" ? value : null))
      .catch(() => setToken(null));
  }, []);

  const baseUrl = (env.API_URL || "").replace(/\/$/, "");
  const body = JSON.stringify({ projectId: projectIds });
  const curlCommand = [
    `curl -X 'POST' '${baseUrl}/projects/details?responseType=${responseType}'`,
    `  -H 'accept: application/json'`,
    `  -H 'Authorization: Bearer ${token ?? "<unable to load token>"}'`,
    `  -H 'Content-Type: application/json'`,
    `  -d '${body}'`,
  ].join(" \\\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-grey-80 text-sm font-semibold">
          cURL Command
        </label>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!token || !projectIds.length}
          className="text-blue-50 hover:text-blue-60 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="w-full bg-grey-90 text-grey-10 text-xs rounded-lg p-4 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all">
        {projectIds.length
          ? curlCommand
          : "Select at least one project to generate a command."}
      </pre>
    </div>
  );
}
