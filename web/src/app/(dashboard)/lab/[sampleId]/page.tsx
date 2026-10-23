"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";

import SampleInfoCard from "@/src/components/lab/sample-accession/sample-info-card";
import SidebarAccordion from "@/src/components/lab/sample-accession/sidebar-accordion";
import AccessionProgressbar from "@/src/components/lab/sample-accession/accession-progressbar";
import SampleReceiving from "@/src/components/lab/sample-accession/sample-receiving";
import SamplePreprocessing from "@/src/components/lab/sample-accession/sample-preprocessing";
import SampleExtraction from "@/src/components/lab/sample-accession/sample-extraction";
import SampleTesting from "@/src/components/lab/sample-accession/sample-testing";
import VirusIsolation from "@/src/components/lab/sample-accession/virus-isolation";
import SampleAccessionCompleted from "@/src/components/lab/sample-accession/sample-accession-completed";

import { sampleAtom } from "@/src/store/sampleAtom";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { SampleStatusType } from "@/src/types/sample";
import { useHasPermission } from "@/src/hooks/check-permission";

const STATUS_TO_STEPS_MAPPING = {
  "picked-up": 0,
  received: 1,
  "virus-isolation": 2,
  "pre-processed": 3,
  extracted: 4,
  tested: 5,
  "test-report-generated": 5,
  rejected: 5,
};

const STATUS_TO_ACCORDION_MAPPING = {
  "picked-up": 0,
  received: 2,
  "virus-isolation": 3,
  "pre-processed": 4,
  extracted: 5,
  tested: 5,
  "test-report-generated": 5,
  rejected: 5,
};

export default function SampleAccessionProcess() {
  const { sampleId } = useParams<{ sampleId: string }>();
  const isAll = useAtomValue(labAllProjectsAtom);
  const sample = useAtomValue(sampleAtom);
  const setSample = useSetAtom(sampleAtom);
  const [accordionIndex, setAccordionIndex] = useState<number | null>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const hasPermission = useHasPermission();
  // Scoped to the sample's own project, not an ambient "current" project -
  // this page is not under /projects/:id, so without this the permission
  // hook would have no route project id to resolve against.
  const canUpdateLabTest = hasPermission(
    "update",
    "sample-test",
    sample?.project?.id,
  );

  const handleCollapse = (index: number) => {
    setAccordionIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const newStepIndex =
      STATUS_TO_STEPS_MAPPING[
        sample?.sampleStatus as keyof typeof STATUS_TO_STEPS_MAPPING
      ];
    const newAccordionIndex =
      STATUS_TO_ACCORDION_MAPPING[
        sample?.sampleStatus as keyof typeof STATUS_TO_ACCORDION_MAPPING
      ];
    if (newStepIndex !== undefined) {
      setStepIndex(newStepIndex);
    }
    if (newAccordionIndex !== undefined) {
      setAccordionIndex(newAccordionIndex);
    }
  }, [sample?.sampleStatus]);

  if (isAll) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-66px)] bg-grey-10 px-4 text-center">
        <p className="text-grey-80 text-lg font-medium">
          Processing isn&apos;t available in &ldquo;All Projects&rdquo; view
        </p>
        <p className="text-grey-70 text-sm max-w-md">
          Select a specific project from the lab project picker to accession or
          process this sample.
        </p>
        <Link
          href="/lab"
          className="px-4 py-2 rounded-lg bg-blue-40 text-white text-sm font-medium"
        >
          Back to Lab
        </Link>
      </div>
    );
  }

  return (
    <div className="flex bg-grey-10 flex-col sm:flex-row">
      {/* sidebar */}
      <div className="w-full sm:w-[360px] bg-grey-0 border-r border-grey-20">
        {/* top header */}
        <Link
          href="/lab"
          className="flex items-center justify-start gap-2 px-7 py-5 border-b border-grey-20"
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
          <p className="text-sm text-blue-40 font-medium">Back to List</p>
        </Link>
        {/* accordion */}
        <SidebarAccordion
          accordionIndex={accordionIndex}
          handleCollapse={handleCollapse}
        />
      </div>
      {/* right content */}
      <div className="px-4 sm:px-8 py-7 flex gap-2 self-stretch flex-col flex-1 min-h-[calc(100vh-66px)] h-fit min-w-0 overflow-x-hidden">
        {/* header card */}
        <SampleInfoCard />

        {/* progress */}
        <div className="p-7 flex flex-col gap-5 self-stretch bg-white rounded-2xl border border-grey-20 shadow-sm relative overflow-hidden">
          <AccessionProgressbar stepIndex={stepIndex} />
        </div>

        {/* form */}
        {canUpdateLabTest && sampleId === sample?.id && (
          <div className="flex-1 min-h-0 min-w-0 pr-1">
            <div className="p-4 sm:p-7 flex flex-col gap-7 rounded-2xl bg-white border border-grey-20 min-w-0 overflow-hidden">
              {/* content */}
              {(() => {
                const handleStepBack = () => {
                  const stepOrder: (keyof typeof STATUS_TO_STEPS_MAPPING)[] = [
                    "picked-up",
                    "received",
                    "virus-isolation",
                    "pre-processed",
                    "extracted",
                    "tested",
                  ];

                  let prevStatus = stepOrder[stepIndex - 1];

                  // Custom logic for going back from Extraction
                  if (stepIndex === 3) {
                    const isAI =
                      sample?.hasAI ||
                      sample?.diseases?.some(
                        (d) => d.shortName?.toUpperCase() === "AI",
                      );
                    if (!isAI) {
                      prevStatus = "received"; // Skip virus-isolation and go to pre-processing
                    }
                  }

                  if (prevStatus) {
                    // Update the atom locally so the UI stays on the previous step
                    setSample((prev) =>
                      prev
                        ? {
                            ...prev,
                            sampleStatus: prevStatus as SampleStatusType,
                          }
                        : undefined,
                    );
                  }
                };

                return (
                  <>
                    {stepIndex === 0 && <SampleReceiving />}
                    {stepIndex === 1 && (
                      <SamplePreprocessing onBack={handleStepBack} />
                    )}
                    {stepIndex === 2 && (
                      <VirusIsolation onBack={handleStepBack} />
                    )}
                    {stepIndex === 3 && (
                      <SampleExtraction onBack={handleStepBack} />
                    )}
                    {stepIndex === 4 && (
                      <SampleTesting onBack={handleStepBack} />
                    )}
                    {stepIndex === 5 && <SampleAccessionCompleted />}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
