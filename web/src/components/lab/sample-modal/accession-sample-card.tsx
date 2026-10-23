import { Sample } from "@/src/types/sample";
import {
  DISEASE_COLOR_CODE,
  SAMPLE_STATUS_MAPPING,
} from "@/src/utils/constant";

export default function AccessionSampleCard({
  sampleDetail,
  showStatus,
}: {
  sampleDetail?: Sample;
  showStatus?: boolean;
}) {
  if (!sampleDetail) return <div />;

  return (
    <div className="self-stretch p-3 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-3 flex">
      <div className="self-stretch flex-col justify-start items-start gap-1 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <p className="text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
            {sampleDetail?.sampleType?.name}
          </p>
          {sampleDetail?.sampleStatus !== "rejected" && (
            <div className="justify-start items-start flex">
              <div className="px-2 py-1 bg-blue-20 rounded justify-center items-center gap-1 flex">
                <p className="text-blue-50 text-[10px] uppercase leading-[15px] tracking-tight">
                  tested {sampleDetail?.labTests?.length ?? 0}/
                  {sampleDetail?.diseases?.length ?? 0}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="justify-start items-center gap-1 inline-flex">
          <div className="w-[15px] h-[15px] relative  overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
            >
              <path
                d="M9.375 2.375H13.125V5.5H11.875V3.625H9.375V2.375ZM5.625 2.375V3.625H3.125V5.5H1.875V2.375H5.625ZM9.375 13.625V12.375H11.875V10.5H13.125V13.625H9.375ZM5.625 13.625H1.875V10.5H3.125V12.375H5.625V13.625ZM4.375 10.5V5.5H5V10.5H4.375Z"
                fill="#687076"
              />
              <path d="M6.25 5.5V10.5H6.875V5.5H6.25Z" fill="#687076" />
              <path d="M8.125 5.5V10.5H8.75V5.5H8.125Z" fill="#687076" />
              <path d="M10 5.5V10.5H10.625V5.5H10Z" fill="#687076" />
            </svg>
          </div>
          <div className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
            {sampleDetail?.barcode}
          </div>
        </div>
      </div>

      <div className="self-stretch h-px relative border-t border-grey-20" />

      <div className="self-stretch justify-between items-start gap-1 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          {sampleDetail?.diseases?.map((disease) => (
            <div
              key={disease.id}
              className={`px-2 py-1 rounded justify-center items-center gap-1 flex ${
                DISEASE_COLOR_CODE.BG_COLOR[disease.index % 6 || 0]
              }`}
            >
              <p className="text-grey-80 text-xs uppercase leading-[18px] tracking-tight whitespace-nowrap">
                {disease?.shortName || "N/A"}
              </p>
            </div>
          ))}
        </div>
        {showStatus && (
          <p className="text-grey-70 text-sm font-normal leading-relaxed capitalize">
            Status:{" "}
            <span className="text-grey-80">
              {(
                SAMPLE_STATUS_MAPPING[
                  sampleDetail.sampleStatus as keyof typeof SAMPLE_STATUS_MAPPING
                ] ?? sampleDetail.sampleStatus
              )?.replaceAll("-", " ")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
