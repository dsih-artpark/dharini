import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import CustomModal from "@/src/components/ui/custom-modal";
import { formatDate, formatTime, formatWeekDay } from "@/src/utils";
import { visitAtom } from "@/src/store/visitAtom";
import { getVisitDetailApi } from "@/src/app/(dashboard)/projects/[id]/sites/[siteId]/loader";
import VisitOverview from "@/src/components/projects/sites/visit/visit-overview";
import SampleAccessionDetails from "@/src/components/lab/sample-modal/sample-accession-details";
import AccessionSampleCard from "@/src/components/lab/sample-modal/accession-sample-card";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import { getLabTestApi } from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import { getAllSamplesApi } from "@/src/app/(dashboard)/lab/loader";

export default function VisitDetailsModal({
  isOpen,
  onClose,
  visitId,
}: {
  isOpen: boolean;
  onClose: () => void;
  visitId: string;
}) {
  const { id } = useParams<{ id: string; siteId: string }>();
  const [visit, setVisit] = useAtom(visitAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string | number>("overview");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      setCollapse(false);
    }
  }, [isOpen]);

  const fetchVisitDetail = async () => {
    try {
      setLoading(true);
      const response = await getVisitDetailApi(id, visitId);
      const { data: samples } = await getAllSamplesApi(id, {
        visitId,
        limit: 200,
      });
      setVisit({ ...response.data, samples });
    } catch (e) {
      console.log("error fetching visit detail", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleLabTestsDetail = async (index: number) => {
    const sampleId = visit?.samples ? visit?.samples[index as number]?.id : "";
    if (!sampleId) return;

    try {
      setLoading(true);
      const response = await getLabTestApi(id, sampleId);
      setVisit((prev) => {
        if (!prev) return prev;
        const newSamples = [...(prev?.samples || [])];
        if (newSamples[index]) {
          newSamples[index] = { ...newSamples[index], labTests: response.data };
        }
        return { ...prev, samples: newSamples };
      });
    } catch (e) {
      console.log("error fetching lab tests for sample", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visitId && !loading) {
      fetchVisitDetail();
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab !== "overview" && visit?.samples?.length) {
      if (!visit?.samples[activeTab as number]?.labTests?.length) {
        fetchSampleLabTestsDetail(activeTab as number);
      }
    }
  }, [activeTab]);

  const handlePrevious = () => {
    setActiveTab((prev) => (prev === 0 ? "overview" : (prev as number) - 1));
  };

  const handleNext = () => {
    setActiveTab((prev) => (prev === "overview" ? 0 : (prev as number) + 1));
  };

  return (
    <CustomModal isOpen={isOpen}>
      {/* previous */}
      <button
        className="absolute left-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full border border-blue-40 bg-blue-40 shadow-lg ring-4 ring-white/20 justify-center items-center inline-flex overflow-hidden cursor-pointer transition hover:bg-blue-50 hover:border-blue-50 sm:static sm:mr-4 sm:h-12 sm:w-12 sm:translate-y-0 disabled:cursor-not-allowed disabled:border-grey-20 disabled:bg-white disabled:shadow-sm disabled:ring-0"
        onClick={handlePrevious}
        disabled={activeTab === "overview"}
        aria-label="Previous visit detail"
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
              fill={activeTab === "overview" ? "#D7DBDF" : "#FFFFFF"}
            />
          </svg>
        </div>
      </button>

      <div className="w-full sm:w-[796px] h-[calc(100%-100px)] sm:h-auto overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-xl flex-col justify-start items-start inline-flex">
        {/* header */}
        <div className="self-stretch px-5 py-4 sm:px-6 bg-white border-b border-grey-20 justify-between items-center inline-flex">
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Visit Details
          </h3>
          <div
            className="h-9 w-9 rounded-full border border-grey-20 bg-grey-10 justify-center items-center gap-2 flex cursor-pointer transition hover:bg-blue-10"
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
        <div className="w-full overflow-y-auto bg-grey-10">
          {/* content */}
          <div className="w-full px-5 py-5 sm:px-6 bg-white border-b border-grey-20 flex-col justify-start items-center gap-6 inline-flex">
            <div className="self-stretch justify-between items-start inline-flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <p className="self-stretch text-grey-80 text-xl leading-[25px]">
                  {visit?.visitedAt ? formatDate(visit.visitedAt) : ""}
                </p>
                <p className="self-stretch text-grey-70 text-base leading-normal">
                  {visit?.visitedAt ? formatWeekDay(visit.visitedAt) : ""},{" "}
                  {visit?.visitedAt ? formatTime(visit.visitedAt) : ""}
                </p>
              </div>
              <div className="justify-end items-center gap-2 flex flex-wrap">
                {visit?.diseases?.map((disease) => (
                  <div
                    key={disease.id}
                    className={`px-2 py-1 ${
                      DISEASE_COLOR_CODE.BG_COLOR[disease.index % 6]
                    } rounded justify-center items-center gap-1 inline-flex`}
                  >
                    <p className="text-grey-80 text-xs uppercase leading-[18px] tracking-tight">
                      {disease.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="self-stretch flex sm:h-[500px] flex-col sm:flex-row">
            <div className="w-full sm:w-[252px] bg-white border-r border-grey-20 flex-col justify-start items-start inline-flex">
              <div
                className={`self-stretch p-4 justify-center items-center gap-2 inline-flex cursor-pointer transition ${
                  activeTab === "overview"
                    ? "bg-blue-10 border-l-4 border-blue-40"
                    : "border-b border-grey-20 hover:bg-grey-10"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <div className="w-5 h-5 relative overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                  >
                    <path
                      d="M16.6667 18.8327H3.33333C3.11232 18.8327 2.90036 18.7449 2.74408 18.5886C2.5878 18.4323 2.5 18.2204 2.5 17.9993V2.99935C2.5 2.77834 2.5878 2.56637 2.74408 2.41009C2.90036 2.25381 3.11232 2.16602 3.33333 2.16602H16.6667C16.8877 2.16602 17.0996 2.25381 17.2559 2.41009C17.4122 2.56637 17.5 2.77834 17.5 2.99935V17.9993C17.5 18.2204 17.4122 18.4323 17.2559 18.5886C17.0996 18.7449 16.8877 18.8327 16.6667 18.8327ZM15.8333 17.166V3.83268H4.16667V17.166H15.8333ZM6.66667 6.33268H13.3333V7.99935H6.66667V6.33268ZM6.66667 9.66602H13.3333V11.3327H6.66667V9.66602ZM6.66667 12.9993H10.8333V14.666H6.66667V12.9993Z"
                      fill="#889096"
                    />
                  </svg>
                </div>
                <p className="grow shrink basis-0 text-grey-80 text-base leading-normal">
                  Visit Overview
                </p>
              </div>
              <div className="self-stretch flex-col justify-start items-start flex">
                <div className="self-stretch p-4 border-b border-grey-20 justify-center items-center gap-2 inline-flex bg-white">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                    >
                      <path
                        d="M14.1654 2.16602V3.83268H13.332V15.4993C13.332 17.341 11.8404 18.8327 9.9987 18.8327C8.15703 18.8327 6.66536 17.341 6.66536 15.4993V3.83268H5.83203V2.16602H14.1654ZM11.6654 8.83268H8.33203V15.4993C8.33203 16.4202 9.07786 17.166 9.9987 17.166C10.9195 17.166 11.6654 16.4202 11.6654 15.4993V8.83268ZM10.832 12.9993C11.292 12.9993 11.6654 13.3727 11.6654 13.8327C11.6654 14.2927 11.292 14.666 10.832 14.666C10.372 14.666 9.9987 14.2927 9.9987 13.8327C9.9987 13.3727 10.372 12.9993 10.832 12.9993ZM9.16536 10.4993C9.62536 10.4993 9.9987 10.8727 9.9987 11.3327C9.9987 11.7927 9.62536 12.166 9.16536 12.166C8.70536 12.166 8.33203 11.7927 8.33203 11.3327C8.33203 10.8727 8.70536 10.4993 9.16536 10.4993ZM11.6654 3.83268H8.33203V7.16602H11.6654V3.83268Z"
                        fill="#889096"
                      />
                    </svg>
                  </div>
                  <p className="grow shrink basis-0 text-grey-80 text-base leading-normal">
                    Samples ({visit?.samples?.length})
                  </p>
                  <div
                    className={`w-6 h-6 relative overflow-hidden cursor-pointer ${
                      collapse ? "rotate-180" : ""
                    }`}
                    onClick={() => setCollapse((prev) => !prev)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                    >
                      <path
                        d="M12.0007 13.6727L16.9507 8.72266L18.3647 10.1367L12.0007 16.5007L5.63672 10.1367L7.05072 8.72266L12.0007 13.6727Z"
                        fill="#284DB6"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={`self-stretch flex-col justify-start items-start flex transition-all duration-300	${
                    collapse ? "max-h-0" : "max-h-[500px]"
                  } overflow-hidden`}
                >
                  {visit?.samples?.map((sample, i) => (
                    <div
                      key={sample.id}
                      className={`self-stretch pl-11 pr-4 py-3 justify-center items-center gap-2 inline-flex cursor-pointer transition ${
                        activeTab === i
                          ? "bg-blue-10 border-l-4 border-blue-40"
                          : "border-b border-grey-20 hover:bg-grey-10"
                      }`}
                      onClick={() => setActiveTab(i)}
                    >
                      <p className="grow shrink basis-0 text-grey-70 text-sm leading-[21px]">
                        {sample.sampleType?.name ?? "sample type"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {activeTab === "overview" ? (
              <VisitOverview />
            ) : (
              <SampleAccessionDetails
                sampleDetail={
                  visit?.samples && visit?.samples[activeTab as number]
                }
                showPhotos={true}
              >
                <AccessionSampleCard
                  sampleDetail={
                    visit?.samples && visit?.samples[activeTab as number]
                  }
                  showStatus={true}
                />
              </SampleAccessionDetails>
            )}
          </div>
        </div>
      </div>

      {/* next */}
      <button
        className="absolute right-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full border border-blue-40 bg-blue-40 shadow-lg ring-4 ring-white/20 justify-center items-center inline-flex overflow-hidden cursor-pointer transition hover:bg-blue-50 hover:border-blue-50 sm:static sm:ml-4 sm:h-12 sm:w-12 sm:translate-y-0 disabled:cursor-not-allowed disabled:border-grey-20 disabled:bg-white disabled:shadow-sm disabled:ring-0"
        onClick={handleNext}
        disabled={(activeTab as number) + 1 === visit?.samples?.length}
        aria-label="Next visit detail"
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
                  : "#FFFFFF"
              }
            />
          </svg>
        </div>
      </button>
    </CustomModal>
  );
}
