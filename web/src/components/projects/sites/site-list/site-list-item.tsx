import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

import { Site } from "@/src/types/site";
import { formatDate } from "@/src/utils";
import { User } from "@/src/types/global";
import { DISEASE_SITE_CONFIG } from "@/src/utils/constant";

export default function SiteListItem({
  site,
  onUpdateCollectionPlan,
  canUpdateCollectionPlan,
}: {
  site: Site;
  onUpdateCollectionPlan?: (site: Site) => void;
  canUpdateCollectionPlan?: boolean;
}) {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const farmTypeLabel = (farmType: string | undefined) => {
    if (!farmType) return "";
    for (const options of Object.values(DISEASE_SITE_CONFIG)) {
      const option = options.find((opt) => opt.value === farmType);
      if (option) return option.label;
    }
    return farmType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Link
      href={`/projects/${id}/sites/${site.id}`}
      className="flex items-center gap-6 border-b border-grey-20 bg-white px-5 py-3 transition-colors hover:bg-grey-10/50"
    >
      <div className="flex min-w-[250px] flex-1 items-center gap-4">
        {site.photos?.length ? (
          <>
            {isLoading && (
              <div className="absolute flex items-center justify-center rounded-lg bg-blue-10 p-5">
                <div className="h-6 w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M20.5 5H4.5V19L13.792 9.706C13.9795 9.51853 14.2338 9.41321 14.499 9.41321C14.7642 9.41321 15.0185 9.51853 15.206 9.706L20.5 15.01V5ZM2.5 3.993C2.50183 3.73038 2.6069 3.47902 2.79251 3.29322C2.97813 3.10742 3.22938 3.00209 3.492 3H21.508C22.056 3 22.5 3.445 22.5 3.993V20.007C22.4982 20.2696 22.3931 20.521 22.2075 20.7068C22.0219 20.8926 21.7706 20.9979 21.508 21H3.492C3.22881 20.9997 2.9765 20.895 2.79049 20.7088C2.60448 20.5226 2.5 20.2702 2.5 20.007V3.993ZM8.5 11C7.96957 11 7.46086 10.7893 7.08579 10.4142C6.71071 10.0391 6.5 9.53043 6.5 9C6.5 8.46957 6.71071 7.96086 7.08579 7.58579C7.46086 7.21071 7.96957 7 8.5 7C9.03043 7 9.53914 7.21071 9.91421 7.58579C10.2893 7.96086 10.5 8.46957 10.5 9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11Z"
                      fill="#D7DBDF"
                    />
                  </svg>
                </div>
              </div>
            )}
            <Image
              className="h-16 w-16 rounded-lg object-cover"
              src={site.photos[0]}
              width={64}
              height={64}
              alt={"site photo"}
              onLoad={() => setIsLoading(false)}
            />
          </>
        ) : (
          <div className="flex items-center justify-center rounded-lg bg-blue-10 p-5">
            <div className="h-6 w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M20.5 5H4.5V19L13.792 9.706C13.9795 9.51853 14.2338 9.41321 14.499 9.41321C14.7642 9.41321 15.0185 9.51853 15.206 9.706L20.5 15.01V5ZM2.5 3.993C2.50183 3.73038 2.6069 3.47902 2.79251 3.29322C2.97813 3.10742 3.22938 3.00209 3.492 3H21.508C22.056 3 22.5 3.445 22.5 3.993V20.007C22.4982 20.2696 22.3931 20.521 22.2075 20.7068C22.0219 20.8926 21.7706 20.9979 21.508 21H3.492C3.22881 20.9997 2.9765 20.895 2.79049 20.7088C2.60448 20.5226 2.5 20.2702 2.5 20.007V3.993ZM8.5 11C7.96957 11 7.46086 10.7893 7.08579 10.4142C6.71071 10.0391 6.5 9.53043 6.5 9C6.5 8.46957 6.71071 7.96086 7.08579 7.58579C7.46086 7.21071 7.96957 7 8.5 7C9.03043 7 9.53914 7.21071 9.91421 7.58579C10.2893 7.96086 10.5 8.46957 10.5 9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11Z"
                  fill="#D7DBDF"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-grey-80 capitalize line-clamp-1">
            {site.name}
          </p>
        </div>
      </div>

      <div className="flex w-[120px] items-center">
        <p className="text-sm text-grey-70 capitalize">
          {farmTypeLabel(site.farmType)}
        </p>
      </div>
      <div className="flex w-[120px] items-center">
        <p className="text-sm text-grey-70 capitalize">{site.siteSubType}</p>
      </div>
      <div className="flex w-[120px] items-center">
        <p className="text-sm text-grey-70 capitalize">
          {site.siteType || "—"}
        </p>
      </div>
      <div className="flex w-[200px] items-center">
        <p className="truncate text-sm text-grey-80">
          {site.collectionCollector ? (
            (site.collectionCollector as User)?.firstName &&
            (site.collectionCollector as User)?.lastName ? (
              `${(site.collectionCollector as User)?.firstName} ${
                (site.collectionCollector as User)?.lastName ?? ""
              }`
            ) : (
              (site.collectionCollector as User)?.email
            )
          ) : (
            <span className="text-xs text-grey-70">[not assigned]</span>
          )}
        </p>
      </div>

      <div className="group relative flex w-[120px] items-center justify-end">
        <div className="inline-flex items-center gap-1 rounded bg-yellow-20 px-2 py-1">
          <p className="text-[10px] font-bold uppercase leading-[15px] tracking-tight text-grey-80">
            {site.testResult ?? "-"}
          </p>
        </div>
        <div className="absolute bottom-10 left-[-20px] hidden h-16 w-max flex-col justify-center gap-2 rounded bg-grey-80 p-3 shadow-lg group-hover:flex">
          <p className="text-[10px] font-bold uppercase leading-[15px] tracking-tight text-grey-40">
            Last visited on
          </p>
          <p className="text-sm text-white">
            {site?.lastVisited ? formatDate(new Date(site.lastVisited)) : ""}
          </p>
        </div>
      </div>
      {canUpdateCollectionPlan && (
        <div className="flex w-[160px] items-center justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUpdateCollectionPlan?.(site);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
            Update Collection Plan
          </button>
        </div>
      )}
    </Link>
  );
}
