import Link from "next/link";
import { useRouter } from "next/navigation";

import { sampleAtom } from "@/src/store/sampleAtom";
import { useAtomValue } from "jotai";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import {
  formatDateTime,
  getDiscardStage,
  getDiscardStageLabel,
  getLastCompletedStep,
  getUserName,
} from "@/src/utils/discard";

export default function SampleAccessionCompleted() {
  const router = useRouter();
  const sample = useAtomValue(sampleAtom);
  const isDiscarded = !!sample?.discardedAt;
  const isRejected = sample?.sampleStatus === "rejected";

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-white border border-grey-20 rounded-2xl p-8 shadow-sm">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDiscarded
            ? "bg-red-10 text-red-30"
            : isRejected
              ? "bg-red-100 text-red-600"
              : "bg-green-10 text-green-30"
        }`}
      >
        {isDiscarded ? (
          <Trash2 size={28} strokeWidth={1.8} />
        ) : isRejected ? (
          <XCircle size={28} strokeWidth={1.8} />
        ) : (
          <CheckCircle2 size={28} strokeWidth={1.8} />
        )}
      </div>
      <p className="text-base text-grey-80 font-normal text-center">
        {isDiscarded
          ? `The sample was discarded at ${getDiscardStageLabel(
              getDiscardStage(sample?.sampleStatus),
            )}`
          : isRejected
            ? "The sample is rejected"
            : "The sample process is completed successfully"}
      </p>
      {isDiscarded && (
        <dl className="w-full max-w-md grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 rounded-xl border border-grey-20 bg-grey-10 px-5 py-4 text-sm">
          <dt className="text-grey-70">Last completed step</dt>
          <dd className="text-grey-80 font-medium">
            {getLastCompletedStep(sample)}
          </dd>
          <dt className="text-grey-70">Reason</dt>
          <dd className="text-grey-80 font-medium">
            {sample?.discardReason || "—"}
            {sample?.discardComment && (
              <span className="block font-normal text-grey-70 mt-0.5">
                {sample.discardComment}
              </span>
            )}
          </dd>
          <dt className="text-grey-70">Discarded by</dt>
          <dd className="text-grey-80 font-medium">
            {getUserName(sample?.discardedBy)}
          </dd>
          <dt className="text-grey-70">On</dt>
          <dd className="text-grey-80 font-medium">
            {formatDateTime(sample?.discardedAt)}
          </dd>
        </dl>
      )}
      {isRejected && !isDiscarded && sample?.rejectReason && (
        <p className="text-grey-80 font-medium text-base text-center">
          Reason for Rejection :{" "}
          <span className="font-light">{sample?.rejectReason || "-"}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
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
        {isDiscarded && (
          <Link
            href="/lab?tab=archive"
            className="flex items-center justify-center px-4 py-2 bg-blue-40 text-white text-base font-medium border border-blue-40 rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
          >
            Open Sample Archive
          </Link>
        )}
      </div>
    </div>
  );
}
