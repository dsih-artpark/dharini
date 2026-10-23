import { Fragment } from "react";
import Image from "next/image";
import { Sample, SubtypeKitDetail } from "@/src/types/sample";
import {
  formatDate,
  formatTime,
  getFileNameFromS3Url,
  isValidUrl,
} from "@/src/utils";
import { Disease } from "@/src/types/global";

export default function SampleAccessionDetails({
  children,
  sampleDetail,
  showPhotos,
}: {
  children?: React.ReactNode;
  sampleDetail?: Sample;
  showPhotos?: boolean;
}) {
  return (
    <div className="relative w-full sm:w-[544px] px-4 py-5 bg-blue-10 rounded-tr flex-col justify-start items-start gap-4 inline-flex overflow-y-auto">
      {children}
      <div className="self-stretch p-5 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch flex-col justify-start items-start gap-5 flex">
          <div className="self-stretch justify-start items-center gap-3 inline-flex">
            <div className="p-2 bg-purple-10 rounded-[99px] justify-start items-center gap-2.5 flex">
              <div className="w-5 h-5 relative  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M14.1654 2.16602V3.83268H13.332V15.4993C13.332 17.341 11.8404 18.8327 9.9987 18.8327C8.15703 18.8327 6.66536 17.341 6.66536 15.4993V3.83268H5.83203V2.16602H14.1654ZM11.6654 8.83268H8.33203V15.4993C8.33203 16.4202 9.07786 17.166 9.9987 17.166C10.9195 17.166 11.6654 16.4202 11.6654 15.4993V8.83268ZM10.832 12.9993C11.292 12.9993 11.6654 13.3727 11.6654 13.8327C11.6654 14.2927 11.292 14.666 10.832 14.666C10.372 14.666 9.9987 14.2927 9.9987 13.8327C9.9987 13.3727 10.372 12.9993 10.832 12.9993ZM9.16536 10.4993C9.62536 10.4993 9.9987 10.8727 9.9987 11.3327C9.9987 11.7927 9.62536 12.166 9.16536 12.166C8.70536 12.166 8.33203 11.7927 8.33203 11.3327C8.33203 10.8727 8.70536 10.4993 9.16536 10.4993ZM11.6654 3.83268H8.33203V7.16602H11.6654V3.83268Z"
                    fill="#11181C"
                  />
                </svg>
              </div>
            </div>
            <p className="grow shrink basis-0 text-grey-80 text-base font-semibold font-noto-serif leading-tight">
              Collection Details
            </p>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-[18px] flex">
            <div className="h-6 justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Collector Org
              </p>
              <p className="text-grey-80 text-base leading-normal">
                {sampleDetail?.team?.teamName ?? "-"}
              </p>
            </div>
            <div className="self-stretch justify-start items-start gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Assigned To
              </p>
              <p className="text-grey-80 text-base leading-normal">
                {sampleDetail?.site?.collectionCollector &&
                typeof sampleDetail?.site?.collectionCollector !== "string"
                  ? `${sampleDetail?.site?.collectionCollector?.firstName} ${sampleDetail?.site?.collectionCollector?.lastName}`
                  : "-"}
              </p>
            </div>
            <div className="self-stretch justify-start items-start gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Completed By
              </p>
              <p className="text-grey-80 text-base leading-normal">
                {sampleDetail?.visit?.visitedBy
                  ? `${sampleDetail.visit.visitedBy.firstName} ${sampleDetail.visit.visitedBy.lastName}`
                  : "-"}
              </p>
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Date & Time
              </p>
              <div className="justify-start items-start gap-1 flex">
                <p className="text-grey-80 text-base leading-normal">
                  {sampleDetail?.collectionTime
                    ? formatDate(sampleDetail?.collectionTime)
                    : ""}
                  <span> | </span>
                  {sampleDetail?.collectionTime
                    ? formatTime(sampleDetail?.collectionTime)
                    : ""}
                </p>
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Sample Quantity
              </p>
              <p className="text-grey-80 text-base leading-normal">
                {sampleDetail?.quantity ?? "-"} {sampleDetail?.unit}
              </p>
            </div>
            <div className="self-stretch justify-start items-start gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Comments
              </p>
              <div className="grow shrink basis-0 px-4 py-3 bg-subtle rounded border border-grey-20 justify-start items-start flex overflow-hidden">
                <p className="grow shrink basis-0 text-grey-80 text-sm leading-[21px]">
                  {sampleDetail?.comment ?? "NA"}
                </p>
              </div>
            </div>
            {showPhotos && !!sampleDetail?.photos?.length && (
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                  Photos
                </p>
                <div className="self-stretch justify-start items-start gap-2 flex">
                  {sampleDetail?.photos?.slice(0, 3).map((photo, i) => {
                    return (
                      <div
                        key={i}
                        className="w-[80px] h-[80px] bg-blue-10 rounded justify-center items-center flex"
                      >
                        {isValidUrl(photo) && (
                          <Image
                            className="w-[80px] h-[80px] rounded"
                            src={photo}
                            width={80}
                            height={80}
                            alt="sample photo"
                          />
                        )}
                        {sampleDetail.photos &&
                          sampleDetail?.photos?.length > 3 && (
                            <p className="absolute text-white text-xl leading-[25px]">
                              +{sampleDetail?.photos?.length}
                            </p>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!!(
        sampleDetail?.preprocessingPerformedBy ||
        sampleDetail?.preprocessingDate ||
        sampleDetail?.preprocessingSteps?.length
      ) && (
        <div className="self-stretch p-5 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-4 flex">
          <div className="self-stretch flex-col justify-start items-start gap-5 flex">
            <div className="self-stretch justify-start items-center gap-3 inline-flex">
              <div className="p-2 bg-purple-10 rounded-[99px] justify-start items-center gap-2.5 flex">
                <div className="w-5 h-5 relative  overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                  >
                    <path
                      d="M4.16536 7.99935C4.38638 7.99935 4.59834 8.08715 4.75462 8.24343C4.9109 8.39971 4.9987 8.61167 4.9987 8.83268C6.30798 8.83075 7.57952 9.27124 8.60703 10.0827H10.4154C11.5262 10.0827 12.5237 10.566 13.2104 11.3327H15.832C16.6197 11.3325 17.3914 11.5555 18.0575 11.9761C18.7236 12.3966 19.2568 12.9973 19.5954 13.7085C17.6245 16.3093 14.4337 17.9993 10.832 17.9993C8.50703 17.9993 6.54036 17.4968 4.9487 16.6177C4.8904 16.7786 4.7839 16.9175 4.64371 17.0157C4.50353 17.1138 4.33648 17.1663 4.16536 17.166H1.66536C1.44435 17.166 1.23239 17.0782 1.07611 16.9219C0.919829 16.7657 0.832031 16.5537 0.832031 16.3327V8.83268C0.832031 8.61167 0.919829 8.39971 1.07611 8.24343C1.23239 8.08715 1.44435 7.99935 1.66536 7.99935H4.16536ZM4.99953 10.4993L4.9987 14.6843L5.0362 14.711C6.53203 15.761 8.48036 16.3327 10.832 16.3327C13.3354 16.3327 15.6645 15.3693 17.3612 13.7243L17.472 13.6135L17.372 13.5302C16.9785 13.222 16.5015 13.0391 16.0029 13.0052L15.832 12.9993H14.0729C14.1329 13.2677 14.1654 13.546 14.1654 13.8327V14.666H6.66536V12.9993L12.3237 12.9985L12.2954 12.9335C12.1357 12.5998 11.89 12.3146 11.5836 12.1072C11.2773 11.8999 10.9212 11.7778 10.552 11.7535L10.4154 11.7493H7.9737C7.58646 11.3533 7.12392 11.0387 6.6133 10.824C6.10268 10.6093 5.55428 10.499 5.00036 10.4993H4.99953ZM3.33203 9.66602H2.4987V15.4993H3.33203V9.66602ZM14.9987 4.66602C15.6617 4.66602 16.2976 4.92941 16.7665 5.39825C17.2353 5.86709 17.4987 6.50297 17.4987 7.16602C17.4987 7.82906 17.2353 8.46494 16.7665 8.93378C16.2976 9.40262 15.6617 9.66602 14.9987 9.66602C14.3357 9.66602 13.6998 9.40262 13.2309 8.93378C12.7621 8.46494 12.4987 7.82906 12.4987 7.16602C12.4987 6.50297 12.7621 5.86709 13.2309 5.39825C13.6998 4.92941 14.3357 4.66602 14.9987 4.66602ZM14.9987 6.33268C14.7777 6.33268 14.5657 6.42048 14.4094 6.57676C14.2532 6.73304 14.1654 6.945 14.1654 7.16602C14.1654 7.38703 14.2532 7.59899 14.4094 7.75527C14.5657 7.91155 14.7777 7.99935 14.9987 7.99935C15.2197 7.99935 15.4317 7.91155 15.588 7.75527C15.7442 7.59899 15.832 7.38703 15.832 7.16602C15.832 6.945 15.7442 6.73304 15.588 6.57676C15.4317 6.42048 15.2197 6.33268 14.9987 6.33268ZM9.16537 2.16602C9.82841 2.16602 10.4643 2.42941 10.9331 2.89825C11.402 3.36709 11.6654 4.00297 11.6654 4.66602C11.6654 5.32906 11.402 5.96494 10.9331 6.43378C10.4643 6.90262 9.82841 7.16602 9.16537 7.16602C8.50232 7.16602 7.86644 6.90262 7.3976 6.43378C6.92876 5.96494 6.66536 5.32906 6.66536 4.66602C6.66536 4.00297 6.92876 3.36709 7.3976 2.89825C7.86644 2.42941 8.50232 2.16602 9.16537 2.16602ZM9.16537 3.83268C8.94435 3.83268 8.73239 3.92048 8.57611 4.07676C8.41983 4.23304 8.33203 4.445 8.33203 4.66602C8.33203 4.88703 8.41983 5.09899 8.57611 5.25527C8.73239 5.41155 8.94435 5.49935 9.16537 5.49935C9.38638 5.49935 9.59834 5.41155 9.75462 5.25527C9.9109 5.09899 9.9987 4.88703 9.9987 4.66602C9.9987 4.445 9.9109 4.23304 9.75462 4.07676C9.59834 3.92048 9.38638 3.83268 9.16537 3.83268Z"
                      fill="#11181C"
                    />
                  </svg>
                </div>
              </div>
              <p className="grow shrink basis-0 text-grey-80 text-base font-semibold font-noto-serif leading-tight">
                Receiving Details
              </p>
            </div>
            <div className="self-stretch flex-col justify-start items-start gap-[18px] flex">
              <div className="h-6 justify-start items-center gap-2 inline-flex">
                <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                  Diagnostician
                </p>
                {sampleDetail?.receivedBy ? (
                  <p className="text-grey-80 text-base leading-normal">
                    {sampleDetail?.receivedBy?.firstName}{" "}
                    {sampleDetail?.receivedBy?.lastName}
                  </p>
                ) : (
                  "-"
                )}
              </div>
              <div className="justify-start items-center gap-2 inline-flex">
                <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                  Date & Time
                </p>
                <p className="text-grey-80 font-regular text-sm">
                  {sampleDetail?.receivedAt
                    ? `${formatDate(sampleDetail?.receivedAt)} | ${formatTime(
                        sampleDetail?.receivedAt,
                      )}`
                    : "-"}
                </p>
              </div>
              <div className="justify-start items-center gap-2 inline-flex">
                <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                  Sample Volume
                </p>
                <p className="text-grey-80 font-regular text-sm">
                  {sampleDetail?.receivedVolumeValue || "-"}{" "}
                  {sampleDetail?.receivedVolumeUnit}
                </p>
              </div>
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                  Storage Details
                </p>
                <p className="text-grey-80 text-base leading-normal">
                  {sampleDetail?.receivedLabStorageDetails || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="self-stretch p-5 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch flex-col justify-start items-start gap-5 flex">
          <div className="self-stretch justify-start items-center gap-3 inline-flex">
            <div className="p-2 bg-purple-10 rounded-[99px] justify-start items-center gap-2.5 flex">
              <div className="w-5 h-5 relative  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M14.1654 2.16602V3.83268H13.332V15.4993C13.332 17.341 11.8404 18.8327 9.9987 18.8327C8.15703 18.8327 6.66536 17.341 6.66536 15.4993V3.83268H5.83203V2.16602H14.1654ZM11.6654 8.83268H8.33203V15.4993C8.33203 16.4202 9.07786 17.166 9.9987 17.166C10.9195 17.166 11.6654 16.4202 11.6654 15.4993V8.83268ZM10.832 12.9993C11.292 12.9993 11.6654 13.3727 11.6654 13.8327C11.6654 14.2927 11.292 14.666 10.832 14.666C10.372 14.666 9.9987 14.2927 9.9987 13.8327C9.9987 13.3727 10.372 12.9993 10.832 12.9993ZM9.16536 10.4993C9.62536 10.4993 9.9987 10.8727 9.9987 11.3327C9.9987 11.7927 9.62536 12.166 9.16536 12.166C8.70536 12.166 8.33203 11.7927 8.33203 11.3327C8.33203 10.8727 8.70536 10.4993 9.16536 10.4993ZM11.6654 3.83268H8.33203V7.16602H11.6654V3.83268Z"
                    fill="#11181C"
                  />
                </svg>
              </div>
            </div>
            <p className="grow shrink basis-0 text-grey-80 text-base font-semibold font-noto-serif leading-tight">
              Pre-processing Details
            </p>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-[18px] flex">
            <div className="h-6 justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Pre-processed By
              </p>
              {sampleDetail?.preprocessingPerformedBy ? (
                <p className="text-grey-80 text-base leading-normal">
                  {sampleDetail?.preprocessingPerformedBy?.firstName}{" "}
                  {sampleDetail?.preprocessingPerformedBy?.lastName}
                </p>
              ) : (
                "-"
              )}
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Date & Time
              </p>
              <p className="text-grey-80 font-regular text-sm">
                {sampleDetail?.preprocessingDate
                  ? `${formatDate(
                      sampleDetail?.preprocessingDate,
                    )} | ${formatTime(sampleDetail?.preprocessingDate)}`
                  : "-"}
              </p>
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Storage Temperature
              </p>
              <p className="text-grey-80 text-base leading-normal">
                {sampleDetail?.preprocessingStorageTemperature || "-"}
              </p>
            </div>
            <div className="self-stretch justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Storage Details
              </p>
              <p className="text-grey-80 text-base leading-normal">
                {sampleDetail?.preprocessingStorageDetails || "-"}
              </p>
            </div>
            <div className="self-stretch justify-start items-start gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Steps Performed
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleDetail?.preprocessingSteps?.length ? (
                  sampleDetail?.preprocessingSteps.map((step, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-10 text-green-30 rounded text-xs capitalize"
                    >
                      {step.type}
                    </span>
                  ))
                ) : (
                  <span className="text-grey-80 text-sm leading-[21px]">-</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch p-5 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch flex-col justify-start items-start gap-5 flex">
          <div className="self-stretch justify-start items-center gap-3 inline-flex">
            <div className="p-2 bg-purple-10 rounded-[99px] justify-start items-center gap-2.5 flex">
              <div className="w-5 h-5 relative overflow-hidden">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.91667 1.66663C7.68654 1.66663 7.5 1.85318 7.5 2.08329V3.74996C7.5 3.98008 7.68654 4.16663 7.91667 4.16663H8.33333V4.697C8.09058 4.78279 7.91667 5.01429 7.91667 5.28642V16.25C7.91667 17.4005 8.84942 18.3333 10 18.3333C11.1506 18.3333 12.0833 17.4005 12.0833 16.25V5.28642C12.0833 5.01429 11.9094 4.78279 11.6667 4.697V4.16663H12.0833C12.3135 4.16663 12.5 3.98008 12.5 3.74996V2.08329C12.5 1.85318 12.3135 1.66663 12.0833 1.66663H7.91667ZM8.75 5.45917C8.99275 5.37338 9.16667 5.14188 9.16667 4.86975V4.16663H10.8333V4.86975C10.8333 5.14188 11.0072 5.37338 11.25 5.45917V7.49996H8.75V5.45917ZM11.25 10.4105L9.17304 8.33329H8.75V8.81533L11.25 11.3153V10.4105ZM10.3515 8.33329L11.25 9.23192V8.74383L10.8395 8.33329H10.3515ZM11.25 12.4939L8.75 9.99388V10.8987L11.25 13.3987V12.4939ZM11.25 15.482L8.75 12.982V12.0772L11.25 14.5772V15.482ZM11.1978 16.6084L8.75 14.1605V15.0653L10.8506 17.1659C11.0117 17.0163 11.1332 16.8246 11.1978 16.6084ZM10 17.5C9.30962 17.5 8.75 16.9403 8.75 16.25V16.2438L10.0061 17.5H10ZM8.33333 2.49996V3.33329H11.6667V2.49996H8.33333Z"
                    fill="#11181C"
                  />
                </svg>
              </div>
            </div>
            <p className="grow shrink basis-0 text-grey-80 text-base font-semibold font-noto-serif leading-tight">
              Extraction Details
            </p>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-[18px] flex">
            <div className="h-6 justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Diagnostician
              </p>
              {sampleDetail?.extractedBy ? (
                <p className="text-grey-80 text-base leading-normal">
                  {sampleDetail?.extractedBy?.firstName}{" "}
                  {sampleDetail?.extractedBy?.lastName}
                </p>
              ) : (
                "-"
              )}
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Date & Time
              </p>
              <p className="text-grey-80 font-regular text-sm">
                {sampleDetail?.extractionDateTime
                  ? `${formatDate(
                      sampleDetail?.extractionDateTime,
                    )} | ${formatTime(sampleDetail?.extractionDateTime)}`
                  : "-"}
              </p>
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Used Sample Volume
              </p>
              <p className="text-grey-80 font-regular text-sm">
                {sampleDetail?.extractionSampleUsedValue || "-"}{" "}
                {sampleDetail?.extractionSampleUsedUnit}
              </p>
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Nucleic acid extracted
              </p>
              <p className="text-grey-80 font-regular text-sm">
                {sampleDetail?.details?.extraction?.nucleicAcidType || "-"}
              </p>
            </div>
            <div className="justify-start items-center gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Extraction method/kit
              </p>
              <p className="text-grey-80 font-regular text-sm">
                {sampleDetail?.details?.extraction?.method || "-"}
              </p>
            </div>
            <div className="self-stretch justify-start items-start gap-2 inline-flex">
              <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                Comments
              </p>
              <div className="grow shrink basis-0 min-h-[45px] px-4 py-3 bg-subtle rounded border border-grey-20 justify-start items-start gap-2.5 flex overflow-hidden">
                <p className="text-grey-80 text-sm leading-[21px]">
                  {sampleDetail?.extractionComments ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch px-5 pt-5 pb-6 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch flex-col justify-start items-center gap-5 flex">
          <div className="self-stretch justify-start items-center gap-3 inline-flex">
            <div className="p-2 bg-purple-10 rounded-[99px] justify-start items-center gap-2.5 flex">
              <div className="w-6 h-6 relative overflow-hidden">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 2C6.72385 2 6.5 2.22386 6.5 2.5V4C6.5 4.27614 6.72385 4.5 7 4.5H7.5V5.63645C7.2087 5.7394 7 6.0172 7 6.34375V19.5C7 20.8807 8.1193 22 9.5 22C10.5722 22 11.4868 21.3249 11.842 20.3766C10.7178 19.4598 10 18.0637 10 16.5C10 14.8642 10.7856 13.4118 12 12.4997V6.34375C12 6.0172 11.7913 5.7394 11.5 5.63645V4.5H12C12.2761 4.5 12.5 4.27614 12.5 4V2.5C12.5 2.22386 12.2761 2 12 2H7ZM8.5 5.84375V4.5H10.5V5.84375C10.5 6.1703 10.7087 6.4481 11 6.55105V9H8V6.55105C8.2913 6.4481 8.5 6.1703 8.5 5.84375ZM16.3787 18.5858C16.1163 18.7596 15.8192 18.8852 15.5 18.95V19.5C15.7761 19.5 16 19.7239 16 20C16 20.2761 15.7761 20.5 15.5 20.5H14.5C14.2239 20.5 14 20.2761 14 20C14 19.7239 14.2239 19.5 14.5 19.5V18.95C14.1808 18.8852 13.8837 18.7596 13.6213 18.5858L13.2071 19C13.4023 19.1953 13.4023 19.5119 13.2071 19.7071C13.0118 19.9024 12.6953 19.9024 12.5 19.7071L11.7928 19C11.5976 18.8048 11.5976 18.4882 11.7928 18.2929C11.9881 18.0977 12.3047 18.0977 12.5 18.2929L12.9142 17.8787C12.7404 17.6163 12.6148 17.3192 12.55 17H12C12 17.2761 11.7761 17.5 11.5 17.5C11.2239 17.5 11 17.2761 11 17V16C11 15.7239 11.2239 15.5 11.5 15.5C11.7761 15.5 12 15.7239 12 16H12.55C12.6148 15.6808 12.7404 15.3837 12.9142 15.1213L12.5 14.7072C12.3047 14.9024 11.9882 14.9024 11.7929 14.7072C11.5977 14.5119 11.5977 14.1953 11.7929 14L12.1418 13.6512C12.1433 13.6496 12.1449 13.648 12.1465 13.6465C12.148 13.6449 12.1496 13.6433 12.1512 13.6418L12.5 13.2929C12.6953 13.0976 13.0119 13.0976 13.2072 13.2929C13.4024 13.4882 13.4024 13.8048 13.2072 14L13.6213 14.4142C13.8837 14.2404 14.1808 14.1148 14.5 14.05V13.5C14.2239 13.5 14 13.2761 14 13C14 12.7239 14.2239 12.5 14.5 12.5H15.5C15.7761 12.5 16 12.7239 16 13C16 13.2761 15.7761 13.5 15.5 13.5V14.05C15.8192 14.1148 16.1163 14.2404 16.3787 14.4142L16.7929 14C16.5977 13.8047 16.5977 13.4881 16.7929 13.2928C16.9882 13.0976 17.3048 13.0976 17.5 13.2928L18.2071 14C18.4024 14.1952 18.4024 14.5118 18.2071 14.7071C18.0118 14.9024 17.6953 14.9024 17.5 14.7071L17.0858 15.1213C17.2596 15.3837 17.3852 15.6808 17.45 16H18C18 15.7239 18.2239 15.5 18.5 15.5C18.7761 15.5 19 15.7239 19 16V17C19 17.2761 18.7761 17.5 18.5 17.5C18.2239 17.5 18 17.2761 18 17H17.45C17.3852 17.3192 17.2596 17.6163 17.0858 17.8787L17.5 18.2929C17.6953 18.0977 18.0118 18.0977 18.2071 18.2929C18.4024 18.4882 18.4024 18.8048 18.2071 19L17.5 19.7071C17.3048 19.9024 16.9882 19.9024 16.7929 19.7071C16.5977 19.5119 16.5977 19.1953 16.7929 19L16.3787 18.5858Z"
                    fill="#11181C"
                  />
                </svg>
              </div>
            </div>
            <p className="text-grey-80 text-base font-semibold font-noto-serif leading-tight">
              Testing Details & Report
            </p>
          </div>
          {sampleDetail?.labTests?.length ? (
            sampleDetail?.labTests?.map((labTest, index) => (
              <Fragment key={labTest.id}>
                <div className="self-stretch flex-col justify-start items-start gap-3 flex">
                  <p className="text-grey-80 text-base font-semibold leading-normal capitalize">
                    Test {index + 1}
                  </p>
                  <p className="text-grey-70 text-sm leading-normal">
                    {(labTest?.disease as Disease)?.shortName} -{" "}
                    {(labTest?.disease as Disease)?.name}
                  </p>
                  <div className="self-stretch flex-col justify-start items-start gap-[18px] flex">
                    <div className="h-6 justify-start items-center gap-2 inline-flex">
                      <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                        Diagnostician
                      </p>
                      {labTest?.testedBy ? (
                        <p className="text-grey-80 text-base leading-normal">
                          {labTest?.testedBy?.firstName}{" "}
                          {labTest?.testedBy?.lastName}
                        </p>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="h-6 justify-start items-center gap-2 inline-flex">
                      <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                        Kit or Protocol
                      </p>
                      <p className="text-grey-80 text-base leading-normal">
                        {labTest?.kitOrProtocol ?? "-"}
                      </p>
                    </div>
                    {labTest?.details?.testing?.targetAssay && (
                      <div className="h-6 justify-start items-center gap-2 inline-flex">
                        <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                          Screening
                        </p>
                        <p className="text-grey-80 text-base leading-normal">
                          {labTest?.details?.testing?.targetAssay}
                        </p>
                      </div>
                    )}
                    <div className="justify-start items-center gap-2 inline-flex">
                      <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                        Tested Date
                      </p>
                      <p className="text-grey-80 font-regular text-sm">
                        {labTest?.testedAt
                          ? `${formatDate(labTest?.testedAt)} | ${formatTime(labTest?.testedAt)}`
                          : "-"}
                      </p>
                    </div>

                    {labTest?.testResult && (
                      <>
                        <div className="h-6 justify-start items-center gap-2 inline-flex">
                          <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                            Result
                          </p>
                          <p
                            className={`${
                              {
                                positive: "text-red-30",
                                negative: "text-green-30",
                                unclear: "text-yellow-30",
                                "": "text-grey-80",
                              }[labTest?.testResult?.toLowerCase() ?? ""] ??
                              "text-grey-80"
                            } text-base leading-normal capitalize`}
                          >
                            {labTest?.testResult ?? "-"}
                          </p>
                        </div>
                        {labTest.ctValue && (
                          <div className="h-6 justify-start items-center gap-2 inline-flex">
                            <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                              CT Value
                            </p>
                            <p className="text-grey-80 text-base leading-normal">
                              {labTest.ctValue}
                            </p>
                          </div>
                        )}
                        {labTest.details?.testing?.subtypeKits && (
                          <div className="self-stretch justify-start items-start gap-2 inline-flex">
                            <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                              Subtype Details
                            </p>
                            <div className="flex flex-col gap-2 grow">
                              {labTest.details.testing.subtypeKits.map(
                                (kit: SubtypeKitDetail, i: number) => (
                                  <div
                                    key={i}
                                    className="p-2 bg-grey-5 rounded border border-grey-20 text-xs text-grey-80"
                                  >
                                    <p className="font-semibold mb-1">
                                      {kit.kitName || "Unknown Kit"}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {kit.targets?.map(
                                        (
                                          target: {
                                            name: string;
                                            ctValue: string;
                                            result: string;
                                          },
                                          j: number,
                                        ) => (
                                          <div
                                            key={j}
                                            className="px-2 py-1 bg-white rounded border border-grey-10"
                                          >
                                            <span className="font-medium">
                                              {target.name}:
                                            </span>{" "}
                                            {target.ctValue} ({target.result})
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                        {labTest.variant && (
                          <div className="h-6 justify-start items-center gap-2 inline-flex">
                            <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                              Subtype
                            </p>
                            <p className="text-grey-80 text-base leading-normal">
                              {labTest.variant}
                            </p>
                          </div>
                        )}
                        {labTest.viralLoad && (
                          <div className="h-6 justify-start items-center gap-2 inline-flex">
                            <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                              Viral Load
                            </p>
                            <p className="text-grey-80 text-base leading-normal">
                              {labTest.viralLoad}
                            </p>
                          </div>
                        )}
                        <div className="justify-start items-center gap-2 inline-flex">
                          <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                            Result Date
                          </p>
                          <p className="text-grey-80 text-base leading-normal">
                            {labTest?.resultDate
                              ? `${formatDate(labTest?.resultDate)} | ${formatTime(labTest?.resultDate)}`
                              : "-"}
                          </p>
                        </div>
                        <div className="grow shrink basis-0 justify-start items-center gap-2 inline-flex">
                          <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                            Report
                          </p>
                          {labTest.testResultReport ? (
                            <a
                              href={labTest.testResultReport ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="min-h-[29px] px-2 py-1 bg-blue-10 rounded-[99px] border border-grey-20 justify-start items-center gap-1 flex"
                            >
                              <div className="w-4 h-4 relative overflow-hidden">
                                <svg
                                  width="13"
                                  height="14"
                                  viewBox="0 0 13 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.88536 4.67133L5.1147 8.44266C5.05102 8.50416 5.00023 8.57772 4.96529 8.65906C4.93036 8.7404 4.91196 8.82788 4.9112 8.9164C4.91043 9.00492 4.92729 9.0927 4.96081 9.17463C4.99433 9.25656 5.04384 9.331 5.10643 9.39359C5.16903 9.45619 5.24346 9.50569 5.32539 9.53921C5.40732 9.57273 5.49511 9.5896 5.58363 9.58883C5.67215 9.58806 5.75963 9.56967 5.84096 9.53473C5.9223 9.49979 5.99586 9.449 6.05736 9.38533L9.8287 5.61466C10.2038 5.23956 10.4145 4.73081 10.4145 4.20033C10.4145 3.66985 10.2038 3.1611 9.8287 2.786C9.45359 2.41089 8.94484 2.20016 8.41436 2.20016C7.88388 2.20016 7.37513 2.41089 7.00003 2.786L3.2287 6.55733C2.91275 6.86542 2.66111 7.23317 2.4884 7.63926C2.31569 8.04535 2.22533 8.4817 2.22256 8.92298C2.2198 9.36427 2.30468 9.80171 2.47229 10.2099C2.63991 10.6182 2.88691 10.989 3.19897 11.3011C3.51104 11.6131 3.88195 11.86 4.2902 12.0276C4.69845 12.1951 5.1359 12.28 5.57719 12.2771C6.01847 12.2743 6.4548 12.1839 6.86087 12.0111C7.26694 11.8383 7.63465 11.5867 7.9427 11.2707L11.714 7.5L12.6567 8.44266L8.88536 12.214C8.452 12.6474 7.93752 12.9911 7.37131 13.2257C6.80509 13.4602 6.19823 13.5809 5.58536 13.5809C4.9725 13.5809 4.36563 13.4602 3.79941 13.2257C3.2332 12.9911 2.71872 12.6474 2.28536 12.214C1.852 11.7806 1.50824 11.2662 1.2737 10.6999C1.03917 10.1337 0.918457 9.52686 0.918457 8.914C0.918457 8.30113 1.03917 7.69426 1.2737 7.12805C1.50824 6.56183 1.852 6.04736 2.28536 5.614L6.05736 1.84333C6.68604 1.23614 7.52804 0.900155 8.40203 0.907749C9.27602 0.915344 10.1121 1.26591 10.7301 1.88393C11.3481 2.50196 11.6987 3.338 11.7063 4.21199C11.7139 5.08598 11.3779 5.92799 10.7707 6.55666L7.00003 10.3293C6.81425 10.5151 6.59371 10.6624 6.351 10.7629C6.10829 10.8634 5.84816 10.9151 5.58546 10.9151C5.32276 10.915 5.06264 10.8633 4.81996 10.7627C4.57727 10.6621 4.35676 10.5148 4.17103 10.329C3.9853 10.1432 3.83797 9.92268 3.73747 9.67997C3.63697 9.43725 3.58526 9.17712 3.58529 8.91443C3.58532 8.65173 3.63709 8.39161 3.73765 8.14892C3.83821 7.90623 3.98559 7.68573 4.17136 7.5L7.9427 3.72866L8.88536 4.67133Z"
                                    fill="#11181C"
                                  />
                                </svg>
                              </div>
                              <p className="max-w-[150px] sm:max-w-[250px] text-grey-80 text-sm leading-[21px] truncate whitespace-nowrap">
                                {getFileNameFromS3Url(
                                  labTest.testResultReport ?? "",
                                )}
                              </p>
                            </a>
                          ) : (
                            "-"
                          )}
                        </div>
                      </>
                    )}

                    {(labTest?.labComment || labTest?.resultComment) && (
                      <div className="self-stretch justify-start items-start gap-2 inline-flex">
                        <p className="w-24 sm:w-40 text-grey-70 text-sm leading-[21px]">
                          Comments
                        </p>
                        <div className="grow shrink basis-0 min-h-[45px] px-4 py-3 bg-subtle rounded border border-grey-20 justify-start items-start gap-2.5 flex overflow-hidden flex-col">
                          {labTest?.labComment && (
                            <p className="text-grey-80 text-sm leading-[21px]">
                              <span className="font-semibold text-xs text-grey-60 block">
                                Lab Comments:
                              </span>
                              {labTest.labComment}
                            </p>
                          )}
                          {labTest?.resultComment && (
                            <p className="text-grey-80 text-sm leading-[21px] mt-2">
                              <span className="font-semibold text-xs text-grey-60 block">
                                Result Comments:
                              </span>
                              {labTest.resultComment}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {index < sampleDetail?.labTests?.length - 1 && (
                  <div className="self-stretch h-px relative border-t border-grey-20" />
                )}
              </Fragment>
            ))
          ) : (
            <div className="self-stretch flex-col justify-center items-center gap-2 flex">
              <div className="p-2 bg-grey-10 rounded-[99px] justify-start items-center gap-2.5 inline-flex">
                <div className="w-6 h-6 relative " />
              </div>
              <p className="text-center text-grey-50 text-sm leading-[21px]">
                No Testing Details Added
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
