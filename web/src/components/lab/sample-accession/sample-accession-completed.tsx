import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { sampleAtom } from "@/src/store/sampleAtom";
import { useAtomValue } from "jotai";
import { CheckCircle2, XCircle } from "lucide-react";
import analytics from "@/src/lib/analytics";

export default function SampleAccessionCompleted() {
  const router = useRouter();
  const sample = useAtomValue(sampleAtom);

  // Track accession completion on mount (only for non-rejected samples)
  useEffect(() => {
    if (sample?.id && sample?.sampleStatus !== "rejected") {
      analytics.labAccessionCompleted(sample.id);
    }
  }, [sample?.id, sample?.sampleStatus]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-white border border-grey-20 rounded-2xl p-8 shadow-sm">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          sample?.sampleStatus === "rejected"
            ? "bg-red-100 text-red-600"
            : "bg-green-10 text-green-30"
        }`}
      >
        {sample?.sampleStatus === "rejected" ? (
          <XCircle size={28} strokeWidth={1.8} />
        ) : (
          <CheckCircle2 size={28} strokeWidth={1.8} />
        )}
      </div>
      <p className="text-base text-grey-80 font-normal text-center">
        {sample?.sampleStatus === "rejected"
          ? "The sample is rejected"
          : "The sample process is completed successfully"}
      </p>
      {sample?.sampleStatus === "rejected" && sample?.rejectReason && (
        <p className="text-grey-80 font-medium text-base text-center">
          Reason for Rejection :{" "}
          <span className="font-light">{sample?.rejectReason || "-"}</span>
        </p>
      )}
      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-40 text-base font-medium border border-blue-40 rounded-xl shadow-sm"
        onClick={() => router.push("/lab")}
      >
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5606_31815)">
            <path
              d="M5.2185 7.83336H13.3332V9.1667H5.2185L8.7945 12.7427L7.85184 13.6854L2.6665 8.50003L7.85184 3.3147L8.7945 4.25736L5.2185 7.83336Z"
              fill="#284DB6"
            />
          </g>
          <defs>
            <clipPath id="clip0_5606_31815">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0 0.5)"
              />
            </clipPath>
          </defs>
        </svg>
        Back to Lists
      </button>
    </div>
  );
}
