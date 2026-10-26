import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";

import { sampleAtom } from "@/src/store/sampleAtom";
import {
  getSampleApi,
  getLabTestApi,
} from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import Loader from "@/src/components/ui/loader";

export default function SampleInfoCard() {
  const { sampleId } = useParams<{ sampleId: string }>();
  const [sample, setSample] = useAtom(sampleAtom);
  // 4.4: workspace-admins have no user.project, so fall back to the current
  // workspace's first project.
  const { resolveProjectId } = useCurrentProjectResolver();
  const currentProjectId = resolveProjectId();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSampleData = async () => {
      setLoading(true);
      try {
        if (!currentProjectId) {
          throw new Error("There is no associated project for the lab user");
        }
        const sampleResponse = await getSampleApi(currentProjectId, sampleId);
        const labTestResponse = await getLabTestApi(currentProjectId, sampleId);
        setSample({ ...sampleResponse.data, labTests: labTestResponse.data });
      } catch (error) {
        console.log("Error fetching sample and lab test data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentProjectId && sampleId !== sample?.id) fetchSampleData();
  }, [currentProjectId, sampleId]);

  return (
    <div className="px-7 py-4 flex flex-col gap-5 self-stretch bg-white rounded-2xl border border-grey-20 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-10/40 via-white to-transparent" />
      {loading && <Loader />}
      {sampleId === sample?.id && (
        <>
          <div className="relative z-10 flex items-start justify-between w-full">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-grey-80 font-noto-serif">
                {sample?.sampleType?.name ?? "-"}
              </h1>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-10 text-blue-50 text-xs font-medium rounded-full">
                  {sample?.sampleStatus?.replaceAll("-", " ") || "In progress"}
                </span>
                {sample?.diseases?.map((disease) => (
                  <div
                    key={disease.id}
                    className={`px-2 py-1 rounded-full justify-center items-center gap-1 flex ${
                      DISEASE_COLOR_CODE.BG_COLOR[disease.index % 6 || 0]
                    }`}
                  >
                    <p className="text-grey-80 text-xs uppercase leading-[18px] tracking-tight whitespace-nowrap">
                      {disease?.shortName || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-grey-20 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-10 flex items-center justify-center text-blue-50">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 4H15V6H5V4ZM4 7H16V15H4V7Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path d="M7 10H13" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-grey-60">Sample ID</p>
                <p className="text-grey-80 text-sm font-semibold">
                  {sample?.barcode || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
