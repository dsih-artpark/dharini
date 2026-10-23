import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";

import CustomModal from "@/src/components/ui/custom-modal";
import Loader from "@/src/components/ui/loader";
import { sampleAtom } from "@/src/store/sampleAtom";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { ALL_PROJECTS_ID } from "@/src/lib/super-admin-lab-flow";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import {
  getSampleApi,
  getLabTestApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import SampleAccessionDetails from "@/src/components/lab/sample-modal/sample-accession-details";
import AccessionSampleCard from "@/src/components/lab/sample-modal/accession-sample-card";
import Link from "next/link";
import { isValidUrl } from "@/src/utils";
import Carousel from "@/src/components/ui/carousel";
import Spinner from "@/src/components/ui/spinner";
import { SAMPLE_STATUS_MAPPING } from "@/src/utils/constant";
import { useHasPermission } from "@/src/hooks/check-permission";

export default function SampleDetailModal({
  isOpen,
  onClose,
  sampleId,
  hideProcessButton,
}: {
  isOpen: boolean;
  onClose: () => void;
  sampleId: string;
  hideProcessButton?: boolean;
}) {
  const isAll = useAtomValue(labAllProjectsAtom);
  const { resolveProjectId } = useCurrentProjectResolver();
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const effectiveProjectId = isAll ? ALL_PROJECTS_ID : resolveProjectId();
  const [sample, setSample] = useAtom(sampleAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const hasPermission = useHasPermission();
  // Scoped to the loaded sample's own project, not effectiveProjectId - the
  // latter can be the ALL_PROJECTS_ID sentinel in the super-admin "all
  // projects" view, which is not a real project id a role can be scoped to.
  const canUpdateLabTest = hasPermission(
    "update",
    "sample-test",
    sample?.project?.id,
  );

  useEffect(() => {
    const fetchSampleData = async () => {
      setLoading(true);
      try {
        if (!effectiveProjectId) {
          throw new Error("There is no associated project for the lab user");
        }
        const sampleResponse = await getSampleApi(effectiveProjectId, sampleId);
        const labTestResponse = await getLabTestApi(
          effectiveProjectId,
          sampleId,
        );
        setSample({
          ...sampleResponse.data,
          labTests: labTestResponse.data,
        });
      } catch (error) {
        console.log("Error fetching sample and lab test data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && effectiveProjectId && sampleId) fetchSampleData();
  }, [isOpen, effectiveProjectId, sampleId, setSample]);

  return (
    <CustomModal isOpen={isOpen}>
      {/* previous */}
      {/* <button
        className="h-10 p-2 bg-white rounded-[999px] justify-center items-center inline-flex overflow-hidden mr-4 cursor-pointer"
        onClick={handlePrevious}
        disabled={activeTab === "overview"}
      >
        <div className="w-6 h-6 relative overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10.828 12.0007L15.778 16.9507L14.364 18.3647L8 12.0007L14.364 5.63672L15.778 7.05072L10.828 12.0007Z"
              fill={activeTab === "overview" ? "#D7DBDF" : "#284DB6"}
            />
          </svg>
        </div>
      </button> */}

      <div className="w-full sm:w-[839px] h-[calc(100%-100px)] sm:h-auto bg-white justify-start items-start inline-flex rounded flex-col-reverse sm:flex-row overflow-y-auto">
        {/* left-side */}
        <div className="sm:h-[656px] w-full sm:w-[295px] px-4 py-5 bg-white border-r border-grey-20 flex flex-col justify-between gap-4">
          {sample && sampleId === sample?.id ? (
            <div className="flex flex-col gap-4 items-center sm:items-start">
              {/* carousel */}
              <div className="w-[263px]">
                <Carousel
                  items={sample?.photos ?? []}
                  renderItem={(photo, index) =>
                    isValidUrl(photo) ? (
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        width={263}
                        height={121}
                        className="rounded h-[121px] w-[263px]"
                      />
                    ) : (
                      <div className="w-[263px] h-[121px] bg-grey-20 rounded" />
                    )
                  }
                />
              </div>
              {/* detail */}
              <AccessionSampleCard sampleDetail={sample} />
              {/* toast */}
              {sample?.sampleStatus !== "rejected" &&
                (sample?.diseases?.length ?? 0) -
                  (sample?.labTests?.length ?? 0) >
                  0 && (
                  <div className="self-stretch bg-yellow-10 py-2 px-4 flex gap-2 justify-start items-center">
                    <svg
                      width="16"
                      height="21"
                      viewBox="0 0 16 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_5896_22885)">
                        <path
                          d="M8.00065 16.6668C4.31865 16.6668 1.33398 13.6822 1.33398 10.0002C1.33398 6.31816 4.31865 3.3335 8.00065 3.3335C11.6827 3.3335 14.6673 6.31816 14.6673 10.0002C14.6673 13.6822 11.6827 16.6668 8.00065 16.6668ZM8.00065 15.3335C9.41514 15.3335 10.7717 14.7716 11.7719 13.7714C12.7721 12.7712 13.334 11.4147 13.334 10.0002C13.334 8.58567 12.7721 7.22912 11.7719 6.22893C10.7717 5.22873 9.41514 4.66683 8.00065 4.66683C6.58616 4.66683 5.22961 5.22873 4.22941 6.22893C3.22922 7.22912 2.66732 8.58567 2.66732 10.0002C2.66732 11.4147 3.22922 12.7712 4.22941 13.7714C5.22961 14.7716 6.58616 15.3335 8.00065 15.3335ZM7.33398 6.66683H8.66732V8.00016H7.33398V6.66683ZM7.33398 9.3335H8.66732V13.3335H7.33398V9.3335Z"
                          fill="#9B6323"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5896_22885">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0 2)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="text-yellow-30 text-xs">
                      Testing remaining for{" "}
                      {(sample?.diseases?.length ?? 0) -
                        (sample?.labTests?.length ?? 0)}{" "}
                      disease
                    </p>
                  </div>
                )}
              {/* site detail */}
              <div className="self-stretch border border-grey-20 p-3 flex flex-col gap-2 rounded">
                <p className="text-grey-70 text-sm font-normal">
                  Collected From
                </p>
                <div className="">
                  <p className="text-grey-80 text-base font-medium">
                    {sample?.site?.name}
                  </p>
                  <p className="text-grey-80 text-sm font-normal">
                    {sample?.site?.address},{" "}
                    {sample?.site?.location?.region?.name},{" "}
                    {sample?.site?.location?.region?.parentRegion?.name} -{" "}
                    {sample?.site?.pinCode}
                  </p>
                </div>
              </div>
              {/* status */}
              <div className="self-stretch p-3 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-3 flex">
                <p className="text-grey-70 text-sm font-normal capitalize">
                  Status:{" "}
                  <span className="text-grey-80">
                    {(
                      SAMPLE_STATUS_MAPPING[
                        sample.sampleStatus as keyof typeof SAMPLE_STATUS_MAPPING
                      ] ?? sample.sampleStatus
                    )?.replaceAll("-", " ")}
                  </span>
                </p>
                {sample?.sampleStatus === "rejected" &&
                  sample?.rejectReason && (
                    <p className="text-grey-70 text-base font-normal leading-relaxed">
                      Reason for Rejection :{" "}
                      <span className="text-grey-80">
                        {sample?.rejectReason || "-"}
                      </span>
                    </p>
                  )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-[100px]">
              <Spinner />
            </div>
          )}

          {/* button */}
          {!hideProcessButton &&
            !isAll &&
            canUpdateLabTest &&
            sample?.sampleStatus &&
            !["rejected", "test-report-generated"].includes(
              sample?.sampleStatus,
            ) && (
              <Link
                href={"/lab/" + sampleId}
                className="flex items-center justify-center bg-blue-40 text-white p-3 text-base font-medium rounded"
                onClick={onClose}
              >
                {sample?.sampleStatus === "picked-up" ? "Accession" : "Process"}
              </Link>
            )}
        </div>
        {/* right-side */}
        <div className="relative flex-1 self-stretch bg-blue-10">
          <div className="z-10 sticky top-0 bg-blue-10 w-full px-4 pt-5 pb-2 self-stretch inline-flex justify-between items-center">
            <h3 className="font-noto-serif text-grey-80 text-xl font-semibold leading-[26px]">
              Sample Overview
            </h3>
            <div
              className="p-1 rounded-[999px] justify-center items-center gap-2 flex cursor-pointer"
              onClick={onClose}
            >
              <div className="w-5 h-5 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.99865 8.82227L14.1236 4.69727L15.302 5.8756L11.177 10.0006L15.302 14.1256L14.1236 15.3039L9.99865 11.1789L5.87365 15.3039L4.69531 14.1256L8.82031 10.0006L4.69531 5.8756L5.87365 4.69727L9.99865 8.82227Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full sm:h-[600px] flex flex-col items-center justify-center overflow-y-auto">
            {loading ? (
              <Loader />
            ) : (
              <SampleAccessionDetails sampleDetail={sample} />
            )}
          </div>
        </div>
      </div>

      {/* next */}
      {/* <button
        className="h-10 p-2 bg-white rounded-[999px] justify-center items-center inline-flex overflow-hidden ml-4 cursor-pointer"
        onClick={handleNext}
        disabled={(activeTab as number) + 1 === visit?.samples?.length}
      >
        <div className="w-6 h-6 relative overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M13.1727 12.0007L8.22266 7.05072L9.63666 5.63672L16.0007 12.0007L9.63666 18.3647L8.22266 16.9507L13.1727 12.0007Z"
              fill={
                (activeTab as number) + 1 === visit?.samples?.length
                  ? "#D7DBDF"
                  : "#284DB6"
              }
            />
          </svg>
        </div>
      </button> */}
    </CustomModal>
  );
}
