"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import Breadcrumb from "@/src/components/ui/breadcrumb";
import CollectionPlanForm from "@/src/components/projects/sites/create-site/collection-plan-form";
import { projectAtom } from "@/src/store/projectAtom";
import { siteAtom } from "@/src/store/siteAtom";
import { getProjectDetailApi } from "@/src/app/(dashboard)/projects/[id]/loader";
import { getSiteDetailApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import { useHasPermission } from "@/src/hooks/check-permission";
import Spinner from "@/src/components/ui/spinner";

export default function UpdateSiteCollectionPlanPage() {
  const { id, siteId } = useParams<{ id: string; siteId: string }>();
  const hasPermission = useHasPermission();
  const canCreateCollectionPlan = hasPermission(
    "create",
    "collection-plan",
    id,
  );

  const [project, setProject] = useAtom(projectAtom);
  const [siteDetail, setSiteDetail] = useAtom(siteAtom);

  const fetchProjectDetail = async () => {
    try {
      const { data } = await getProjectDetailApi(id);
      setProject(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    }
  };

  const fetchSiteDetail = async () => {
    try {
      const { data } = await getSiteDetailApi(id, siteId);
      setSiteDetail(data);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => {
    if (project?.id !== id) {
      fetchProjectDetail();
    }
  }, [id]);

  useEffect(() => {
    if (siteDetail?.id !== siteId) {
      fetchSiteDetail();
    }
  }, [siteId]);

  return (
    <div className="flex flex-col bg-blue-10">
      <Breadcrumb
        path={[
          { name: project?.name ?? "Project", href: `/projects/${id}` },
          {
            name: siteDetail?.name ?? "Site details",
            href: `/projects/${id}/sites/${siteId}`,
          },
          {
            name: "Update Collection Plans",
            href: `/projects/${id}/sites/${siteId}`,
          },
        ]}
        // className="!bg-blue-10 border-none !px-0"
      />
      {!!siteDetail ? (
        <div className="w-full sm:w-[846px] flex flex-col gap-4 m-auto mt-6 mb-10">
          <div className="p-7 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-4 inline-flex">
            <div className="self-stretch justify-between items-start inline-flex flex-col sm:flex-row gap-2">
              <div className="w-full sm:w-[659px] flex-col justify-start items-start gap-2 inline-flex">
                <p className="self-stretch text-grey-80 text-2xl font-semibold font-noto-serif leading-[31.20px]">
                  {siteDetail?.name}
                </p>
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                  {/* <div className="justify-start items-center gap-1 flex">
                  <div className="w-4 h-4 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M7.3326 11.9593C5.98775 11.7882 4.75851 11.1114 3.89473 10.0665C3.03095 9.02161 2.59746 7.68701 2.68235 6.33397C2.76724 4.98093 3.36416 3.71098 4.35177 2.78224C5.33938 1.8535 6.64357 1.33567 7.99927 1.33399C9.35663 1.33298 10.6633 1.84954 11.653 2.77844C12.6428 3.70733 13.2411 4.97865 13.3261 6.33334C13.4111 7.68804 12.9764 9.02418 12.1105 10.0695C11.2446 11.1148 10.0128 11.7907 8.66594 11.9593V14.0007H7.3326V11.9593ZM7.99927 10.6673C9.06014 10.6673 10.0776 10.2459 10.8277 9.49575C11.5778 8.7456 11.9993 7.72819 11.9993 6.66732C11.9993 5.60645 11.5778 4.58904 10.8277 3.83889C10.0776 3.08875 9.06014 2.66732 7.99927 2.66732C6.9384 2.66732 5.92099 3.08875 5.17084 3.83889C4.4207 4.58904 3.99927 5.60645 3.99927 6.66732C3.99927 7.72819 4.4207 8.7456 5.17084 9.49575C5.92099 10.2459 6.9384 10.6673 7.99927 10.6673ZM3.3326 14.6673H12.6659V16.0007H3.3326V14.6673Z"
                        fill="#889096"
                      />
                    </svg>
                  </div>
                  <p className="text-grey-70 text-base leading-normal">
                    Site Code: {siteDetail?.siteCode ?? "-"}
                  </p>
                </div> */}
                  <p className="text-grey-70 text-base leading-normal capitalize">
                    {siteDetail?.farmType?.replace(/_/g, " ")}
                    {siteDetail?.siteSubType && (
                      <span>
                        {" "}
                        · {siteDetail.siteSubType.replace(/_/g, " ")}
                      </span>
                    )}
                  </p>
                  <div className="text-grey-70 text-base leading-normal">|</div>
                  <p className="text-grey-70 text-base leading-normal capitalize">
                    {siteDetail?.siteType}
                  </p>
                </div>
              </div>
              <div className="sm:justify-end items-center gap-2 flex flex-wrap">
                {siteDetail?.diseases?.map((disease) => (
                  <div
                    key={disease.id}
                    className={`px-2 py-1 rounded justify-center items-center gap-1 flex ${
                      DISEASE_COLOR_CODE.BG_COLOR[disease.index % 6]
                    }`}
                  >
                    <p className="text-grey-80 text-xs uppercase leading-[18px] tracking-tight whitespace-nowrap">
                      {disease.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {canCreateCollectionPlan ? (
            <div className="p-6 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-6 inline-flex">
              <h2 className="self-stretch text-grey-80 text-2xl font-semibold font-noto-serif leading-[31.20px]">
                Update Collection Plans
              </h2>
              <div className="self-stretch h-px relative border-t border-grey-20" />
              <CollectionPlanForm />
            </div>
          ) : (
            <p>You do not have permission to update collection plan</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      )}
    </div>
  );
}
