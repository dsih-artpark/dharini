import { useAtomValue } from "jotai";
import Image from "next/image";

import { visitAtom } from "@/src/store/visitAtom";
import { formatDate } from "@/src/utils";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

export default function VisitOverview() {
  const visit = useAtomValue(visitAtom);
  return (
    <div className="w-full sm:w-[544px] p-5 bg-white flex-col justify-start items-start gap-4 inline-flex overflow-y-auto">
      <div className="self-stretch flex-col justify-start items-center gap-6 flex">
        <div className="self-stretch flex-col justify-start items-start gap-5 flex">
          <div className="self-stretch p-4 rounded border border-grey-20 justify-start items-end gap-5 inline-flex flex-col sm:flex-row">
            <div className="grow shrink basis-0 self-stretch rounded flex-col justify-start items-start inline-flex">
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <p className="grow shrink basis-0 text-grey-70 text-sm leading-[21px]">
                  Suspected Positives
                </p>
              </div>
              <div className="self-stretch justify-start items-center gap-2 inline-flex mt-1">
                {visit?.suspectedPositives?.filter(
                  (sp) => sp.isSuspectedPositive,
                )?.length
                  ? visit?.suspectedPositives
                      ?.filter((sp) => sp.isSuspectedPositive)
                      ?.map((suspectedPositive) => (
                        <div
                          key={suspectedPositive.disease?.id}
                          className={`px-2 py-1 ${
                            DISEASE_COLOR_CODE.BG_COLOR[
                              (suspectedPositive.disease?.index as number) % 6
                            ]
                          } rounded justify-center items-center gap-1 inline-flex`}
                        >
                          <p className="text-grey-80 text-xs uppercase leading-[18px] tracking-tight">
                            {suspectedPositive?.disease?.shortName}
                          </p>
                        </div>
                      ))
                  : "N/A"}
              </div>
            </div>
            <div className="hidden sm:block w-px h-[47px] bg-grey-20" />
            <div className="self-stretch grow shrink basis-0 rounded flex-col justify-start items-start inline-flex">
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <p className="grow shrink basis-0 text-grey-70 text-sm leading-[21px]">
                  Scheduled Date
                </p>
                {visit && (
                  <div
                    className={`w-min px-2 py-1 ${
                      {
                        upcoming: "bg-yellow-10",
                        overdue: "bg-red-10",
                        completed: "bg-green-10",
                        skipped: "bg-olive-10",
                      }[visit.visitStatus]
                    } rounded justify-center items-center gap-1 flex`}
                  >
                    <p
                      className={`text-xs uppercase leading-[18px] tracking-tight ${
                        {
                          upcoming: "text-yellow-30",
                          overdue: "text-red-30",
                          completed: "text-green-30",
                          skipped: "text-olive-30",
                        }[visit.visitStatus]
                      }`}
                    >
                      {visit.visitStatus}
                    </p>
                  </div>
                )}
              </div>
              <div className="rounded flex-col justify-center items-start gap-1 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                  <p className="text-grey-80 text-base leading-normal">
                    {visit?.visitScheduledAt
                      ? formatDate(visit.visitScheduledAt)
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch bg-white rounded flex-col justify-start items-start gap-4 flex">
            <p className="text-grey-80 text-base font-semibold font-noto-serif leading-tight">
              Visited by
            </p>
            <div className="self-stretch rounded border border-grey-20 flex-col justify-start items-start flex overflow-hidden">
              {visit?.collector ? (
                <div className="self-stretch p-3 bg-white justify-start items-center gap-3 inline-flex">
                  <div className="w-9 h-9 p-2 bg-teal-10 rounded-[100px] flex-col justify-center items-center gap-2.5 inline-flex overflow-hidden">
                    <p className="self-stretch text-center text-grey-80 text-xs uppercase leading-[18px] tracking-tight">
                      {visit.collector.firstName?.charAt(0) ?? ""}
                      {visit.collector.lastName?.charAt(0) ?? ""}
                    </p>
                  </div>
                  <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                    <div className="self-stretch justify-center items-center gap-4 inline-flex">
                      <p className="grow shrink basis-0 text-grey-80 text-sm leading-[21px]">
                        {visit.collector.firstName ?? ""}{" "}
                        {visit.collector.lastName ?? ""}
                      </p>
                    </div>
                    <p className="self-stretch text-grey-70 text-sm leading-[21px]">
                      {visit.collector.email}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="self-stretch rounded flex-col justify-center items-start gap-4 flex">
          <div className="self-stretch justify-start items-start gap-6 inline-flex">
            <p className="grow shrink basis-0 text-grey-80 text-base font-semibold font-noto-serif leading-tight">
              Photos & Comments
            </p>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-6 flex">
            <div className="justify-start items-start gap-2 inline-flex">
              {visit?.photos?.length ? (
                visit?.photos?.slice(0, 3).map((photo, i) => {
                  return (
                    <div
                      key={i}
                      className="w-[104px] h-[104px] bg-blue-10 rounded justify-center items-center flex"
                    >
                      <Image
                        className="w-[104px] h-[104px] rounded"
                        src={photo}
                        width={104}
                        height={104}
                        alt="visit photo"
                      />
                      {visit.photos && visit?.photos?.length > 3 && (
                        <p className="absolute text-white text-xl leading-[25px]">
                          +{visit?.photos?.length}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-grey-70 text-sm leading-[21px]">
                  No photos added
                </p>
              )}
            </div>
            <div className="self-stretch h-[104px] flex-col justify-start items-start gap-2 flex">
              <p className="text-grey-60 text-[10px] uppercase leading-[15px] tracking-tight">
                Comments
              </p>
              <div className="self-stretch grow shrink basis-0 px-4 py-3 bg-subtle rounded justify-start items-start gap-2.5 inline-flex">
                <p className="grow shrink basis-0 text-grey-80 text-sm leading-[21px]">
                  {visit?.comment ?? "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
