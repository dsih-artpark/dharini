import React, { useState } from "react";
import { useAtomValue } from "jotai";

import { sampleAtom } from "@/src/store/sampleAtom";
import { formatDate, formatTime, getFileNameFromS3Url } from "@/src/utils";
import { Disease } from "@/src/types/global";
import SampleDetailModal from "@/src/components/lab/sample-modal/sample-detail-modal";
import { useHasPermission } from "@/src/hooks/check-permission";

export default function SidebarAccordion({
  accordionIndex,
  handleCollapse,
}: {
  accordionIndex: number | null;
  handleCollapse: (index: number) => void;
}) {
  const sample = useAtomValue(sampleAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [sampleId, setSampleId] = useState("");
  const hasPermission = useHasPermission();
  // Scoped to the sample's own project, not an ambient "current" project -
  // this page is not under /projects/:id, so without this the permission
  // hook would have no route project id to resolve against.
  const canUpdateLabTest = hasPermission(
    "update",
    "sample-test",
    sample?.project?.id,
  );

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    setSampleId(sample?.id ?? "");
  };

  return (
    <div className="sm:h-[calc(100vh-127px)] overflow-y-auto">
      {[
        "Collection Details",
        "Receiving Details",
        "Pre-processing Details",
        "Virus Isolation Details",
        "Extraction Details",
        "Testing Details",
      ].map((a, i) => {
        return (
          <React.Fragment key={a}>
            <div
              className={`flex items-center justify-between px-7 py-4 border-b border-grey-20 cursor-pointer ${
                accordionIndex === i ? "bg-blue-10" : ""
              }`}
              onClick={() => handleCollapse(i)}
            >
              {a}
              <div
                className={`w-4 h-4 ${
                  accordionIndex === i ? "rotate-180" : ""
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_5606_43710)">
                    <path
                      d="M7.99999 8.78145L11.3 5.48145L12.2427 6.42411L7.99999 10.6668L3.75732 6.42411L4.69999 5.48145L7.99999 8.78145Z"
                      fill="#11181C"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5606_43710">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            {/* step 1 - Collection Details */}
            <div
              className={`${
                accordionIndex === 0 && accordionIndex === i ? "flex" : "hidden"
              } px-8 py-4 flex-col gap-4 bg-blue-10`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Replicate Available?
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.replicates ?? "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Collection Date & Time
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.collectionTime
                      ? `${formatDate(sample?.collectionTime)} | ${formatTime(
                          sample?.collectionTime,
                        )}`
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">Comments</p>
                  <p className="px-3 py-2 text-grey-80 font-regular text-sm bg-white rounded-sm">
                    {sample?.comment ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {/* step 2 - Receiving Details */}
            <div
              className={`${
                accordionIndex === 1 && accordionIndex === i ? "flex" : "hidden"
              } px-8 py-4 flex-col gap-4 bg-blue-10`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Sample Volume
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.receivedVolumeValue || "-"}{" "}
                    {sample?.receivedVolumeUnit}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Lab Storage Details
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.receivedLabStorageDetails || "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Diagnostician
                  </p>
                  <div className="flex items-center gap-2">
                    {sample?.receivedBy ? (
                      <>
                        <div className="w-6 h-6 bg-sand-10 rounded-full p-1 text-grey-80 text-[10px] flex items-center justify-center font-medium">
                          {sample?.receivedBy?.firstName?.charAt(0)}
                          {sample?.receivedBy?.lastName?.charAt(0)}
                        </div>
                        <p className="text-grey-80 font-regular text-sm rounded-sm">
                          {sample?.receivedBy?.firstName}{" "}
                          {sample?.receivedBy?.lastName}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* step 3 - Pre-processing Details */}
            <div
              className={`${
                accordionIndex === 2 && accordionIndex === i ? "flex" : "hidden"
              } px-8 py-4 flex-col gap-4 bg-blue-10`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Pre-processing Date
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.preprocessingDate
                      ? formatDate(sample?.preprocessingDate)
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Storage Temperature
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.preprocessingStorageTemperature || "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Storage Details
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.preprocessingStorageDetails || "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Pre-processed By
                  </p>
                  <div className="flex items-center gap-2">
                    {sample?.preprocessingPerformedBy ? (
                      <>
                        <div className="w-6 h-6 bg-sand-10 rounded-full p-1 text-grey-80 text-[10px] flex items-center justify-center font-medium">
                          {sample?.preprocessingPerformedBy?.firstName?.charAt(
                            0,
                          )}
                          {sample?.preprocessingPerformedBy?.lastName?.charAt(
                            0,
                          )}
                        </div>
                        <p className="text-grey-80 font-regular text-sm rounded-sm">
                          {sample?.preprocessingPerformedBy?.firstName}{" "}
                          {sample?.preprocessingPerformedBy?.lastName}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Steps Performed
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sample?.preprocessingSteps?.length ? (
                      sample?.preprocessingSteps.map((step, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-10 text-green-30 rounded text-xs capitalize"
                        >
                          {step.type}
                        </span>
                      ))
                    ) : (
                      <span className="text-grey-80 font-regular text-sm">
                        -
                      </span>
                    )}
                  </div>
                </div>
                {sample?.pooledWith && sample.pooledWith.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-70 font-light text-xs">
                      Pooled Samples
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sample.pooledWith.map((pooled) => (
                        <span
                          key={pooled.id}
                          className="px-2 py-1 bg-blue-10 text-blue-40 rounded text-xs"
                        >
                          {pooled.barcode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* step 4 - Virus Isolation Details */}
            <div
              className={`${
                accordionIndex === 3 && accordionIndex === i ? "flex" : "hidden"
              } px-8 py-4 flex-col gap-4 bg-blue-10`}
            >
              {sample?.details?.virusIsolation ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-grey-70 font-light text-xs">
                      HA Test Result
                    </p>
                    <p className="text-grey-80 font-medium text-sm capitalize">
                      {sample?.details?.virusIsolation?.haTest || "-"}
                    </p>
                  </div>
                  {sample?.details?.virusIsolation?.haTest === "yes" && (
                    <>
                      <div className="flex flex-col gap-1">
                        <p className="text-grey-70 font-light text-xs">
                          Inoculation Date
                        </p>
                        <p className="text-grey-80 font-regular text-sm">
                          {sample?.details?.virusIsolation?.inoculationDate ||
                            "-"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-grey-70 font-light text-xs">
                          Harvesting Date
                        </p>
                        <p className="text-grey-80 font-regular text-sm">
                          {sample?.details?.virusIsolation?.harvestingDate ||
                            "-"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-grey-70 font-light text-xs">
                            HA Titre
                          </p>
                          <p className="text-grey-80 font-regular text-sm">
                            {sample?.details?.virusIsolation?.haTitre || "-"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-grey-70 font-light text-xs">
                            HI Titre
                          </p>
                          <p className="text-grey-80 font-regular text-sm">
                            {sample?.details?.virusIsolation?.hiTitre || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-grey-70 font-light text-xs">
                            H Value
                          </p>
                          <p className="font-regular text-sm text-blue-600 font-bold">
                            {sample?.details?.virusIsolation?.hValue || "-"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-grey-70 font-light text-xs">
                            N Value
                          </p>
                          <p className="font-regular text-sm text-blue-600 font-bold">
                            {sample?.details?.virusIsolation?.nValue || "-"}
                          </p>
                        </div>
                      </div>
                      {sample?.details?.virusIsolation?.ndvPresent && (
                        <div className="flex flex-col gap-1">
                          <p className="text-grey-70 font-light text-xs">
                            NDV Present
                          </p>
                          <p className="font-bold text-sm uppercase text-amber-600">
                            {sample?.details?.virusIsolation?.ndvPresent}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <p className="text-grey-70 font-light text-xs">
                          Allantoic Storage
                        </p>
                        <p className="text-grey-80 font-regular text-sm italic">
                          {sample?.details?.virusIsolation?.allantoicStorage ||
                            "-"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-grey-70 font-light text-xs">
                          Final Volume
                        </p>
                        <p className="text-grey-80 font-bold text-sm">
                          {sample?.details?.virusIsolation?.volume || "-"}{" "}
                          {sample?.details?.virusIsolation?.unit}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-grey-70 font-regular text-sm">
                  No Isolation Data
                </p>
              )}
            </div>
            {/* step 5 - Extraction Details */}
            <div
              className={`${
                accordionIndex === 4 && accordionIndex === i ? "flex" : "hidden"
              } px-8 py-4 flex-col gap-4 bg-blue-10`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Extraction Date & Time
                  </p>
                  <p className="text-grey-80 font-regular text-sm">
                    {sample?.extractionDateTime
                      ? `${formatDate(
                          sample?.extractionDateTime,
                        )} | ${formatTime(sample?.extractionDateTime)}`
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">
                    Extracted By
                  </p>
                  <div className="flex items-center gap-2">
                    {sample?.extractedBy ? (
                      <>
                        <div className="w-6 h-6 bg-sand-10 rounded-full p-1 text-grey-80 text-[10px] flex items-center justify-center font-medium">
                          {sample?.extractedBy?.firstName?.charAt(0)}
                          {sample?.extractedBy?.lastName?.charAt(0)}
                        </div>
                        <p className="text-grey-80 font-regular text-sm rounded-sm">
                          {sample?.extractedBy?.firstName}{" "}
                          {sample?.extractedBy?.lastName}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-grey-70 font-light text-xs">Comments</p>
                  <p className="px-3 py-2 text-grey-80 font-regular text-sm bg-white rounded-sm">
                    {sample?.extractionComments ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {/* step 6 - Testing Details */}
            <div
              className={`${
                accordionIndex === 5 && accordionIndex === i ? "flex" : "hidden"
              } px-8 py-4 flex-col gap-4 bg-blue-10`}
            >
              {sample?.labTests?.length ? (
                sample?.labTests?.map((labTest) => {
                  return (
                    <React.Fragment key={labTest.id}>
                      <div className="flex flex-col gap-4">
                        <h2 className="text-xl text-grey-80">
                          {(labTest.disease as Disease)?.shortName} -{" "}
                          {(labTest.disease as Disease)?.name}
                        </h2>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-grey-70 font-light text-xs">
                              Kit or Protocol
                            </p>
                            <p className="text-grey-80 font-regular text-sm">
                              {labTest?.kitOrProtocol}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-grey-70 font-light text-xs">
                              Result
                            </p>
                            <p
                              className={`${
                                {
                                  positive: "text-red-30",
                                  negative: "text-green-30",
                                  unclear: "text-yellow-30",
                                  "": "text-grey-80",
                                }[labTest?.testResult ?? ""]
                              } font-regular text-sm capitalize`}
                            >
                              {labTest?.testResult ?? "-"}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-grey-70 font-light text-xs">
                              Result Date & Time
                            </p>
                            <p className="text-grey-80 font-regular text-sm">
                              {labTest?.resultDate
                                ? `${formatDate(
                                    labTest?.resultDate,
                                  )} | ${formatTime(labTest?.resultDate)}`
                                : "-"}
                            </p>
                          </div>
                          {labTest.testResultReport && (
                            <div className="px-2 py-1 flex items-center gap-1 bg-white rounded-full">
                              <div className="w-4 h-4">
                                <svg
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_5606_31506)">
                                    <path
                                      d="M9.88487 5.67133L6.11421 9.44266C6.05053 9.50416 5.99975 9.57772 5.96481 9.65906C5.92987 9.7404 5.91148 9.82788 5.91071 9.9164C5.90994 10.0049 5.92681 10.0927 5.96033 10.1746C5.99385 10.2566 6.04335 10.331 6.10594 10.3936C6.16854 10.4562 6.24297 10.5057 6.3249 10.5392C6.40684 10.5727 6.49462 10.5896 6.58314 10.5888C6.67166 10.5881 6.75914 10.5697 6.84048 10.5347C6.92181 10.4998 6.99538 10.449 7.05687 10.3853L10.8282 6.61466C11.2033 6.23956 11.414 5.73081 11.414 5.20033C11.414 4.66985 11.2033 4.1611 10.8282 3.786C10.4531 3.41089 9.94435 3.20016 9.41387 3.20016C8.8834 3.20016 8.37465 3.41089 7.99954 3.786L4.22821 7.55733C3.91226 7.86542 3.66063 8.23317 3.48791 8.63926C3.3152 9.04535 3.22484 9.4817 3.22207 9.92298C3.21931 10.3643 3.30419 10.8017 3.47181 11.2099C3.63942 11.6182 3.88642 11.989 4.19848 12.3011C4.51055 12.6131 4.88146 12.86 5.28971 13.0276C5.69796 13.1951 6.13541 13.28 6.5767 13.2771C7.01798 13.2743 7.45431 13.1839 7.86038 13.0111C8.26645 12.8383 8.63417 12.5867 8.94221 12.2707L12.7135 8.5L13.6562 9.44266L9.88487 13.214C9.45151 13.6474 8.93704 13.9911 8.37082 14.2257C7.80461 14.4602 7.19774 14.5809 6.58487 14.5809C5.97201 14.5809 5.36514 14.4602 4.79893 14.2257C4.23271 13.9911 3.71824 13.6474 3.28487 13.214C2.85151 12.7806 2.50775 12.2662 2.27322 11.6999C2.03868 11.1337 1.91797 10.5269 1.91797 9.914C1.91797 9.30113 2.03868 8.69426 2.27322 8.12805C2.50775 7.56183 2.85151 7.04736 3.28487 6.614L7.05687 2.84333C7.68555 2.23614 8.52756 1.90015 9.40154 1.90775C10.2755 1.91534 11.1116 2.26591 11.7296 2.88393C12.3476 3.50196 12.6982 4.338 12.7058 5.21199C12.7134 6.08598 12.3774 6.92799 11.7702 7.55666L7.99954 11.3293C7.81376 11.5151 7.59322 11.6624 7.35051 11.7629C7.1078 11.8634 6.84767 11.9151 6.58497 11.9151C6.32227 11.915 6.06216 11.8633 5.81947 11.7627C5.57678 11.6621 5.35627 11.5148 5.17054 11.329C4.98481 11.1432 4.83748 10.9227 4.73698 10.68C4.63648 10.4373 4.58477 10.1771 4.5848 9.91443C4.58483 9.65173 4.63661 9.39161 4.73716 9.14892C4.83772 8.90623 4.9851 8.68573 5.17087 8.5L8.94221 4.72866L9.88487 5.67133Z"
                                      fill="#11181C"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_5606_31506">
                                      <rect
                                        width="16"
                                        height="16"
                                        fill="white"
                                        transform="translate(0 0.5)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                              <a
                                href={labTest.testResultReport ?? "#"}
                                className="text-grey-80 font-regular text-sm rounded-sm truncate"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {getFileNameFromS3Url(labTest.testResultReport)}
                              </a>
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <p className="text-grey-70 font-light text-xs">
                              Testing Date & Time
                            </p>
                            <p className="text-grey-80 font-regular text-sm">
                              {labTest?.testedAt
                                ? `${formatDate(
                                    labTest?.testedAt,
                                  )} | ${formatTime(labTest?.testedAt)}`
                                : "-"}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-grey-70 font-light text-xs">
                              Tested By
                            </p>
                            <div className="flex items-center gap-2">
                              {sample?.testedBy ? (
                                <>
                                  <div className="w-6 h-6 bg-sand-10 rounded-full p-1 text-grey-80 text-[10px] flex items-center justify-center font-medium">
                                    {sample?.testedBy?.firstName?.charAt(0)}
                                    {sample?.testedBy?.lastName?.charAt(0)}
                                  </div>
                                  <p className="text-grey-80 font-regular text-sm rounded-sm">
                                    {sample?.testedBy?.firstName}{" "}
                                    {sample?.testedBy?.lastName}
                                  </p>
                                </>
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-grey-70 font-light text-xs">
                              Comments
                            </p>
                            <p className="px-3 py-2 text-grey-80 font-regular text-sm bg-white rounded-sm">
                              {labTest?.labComment ?? "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="h-1 self-stretch border-b border-grey-20" />
                    </React.Fragment>
                  );
                })
              ) : (
                <p className="text-grey-70 font-regular text-sm">
                  No Testing Details Added
                </p>
              )}
            </div>
          </React.Fragment>
        );
      })}
      {canUpdateLabTest && (
        <div className="my-8 px-7 self-stretch">
          <button
            className="w-full p-3 border border-blue-40 rounded flex items-center justify-center gap-2 text-blue-40 font-medium text-base self-stretch"
            onClick={handleOpenModal}
          >
            View all details
          </button>
        </div>
      )}
      <SampleDetailModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        sampleId={sampleId}
      />
    </div>
  );
}
