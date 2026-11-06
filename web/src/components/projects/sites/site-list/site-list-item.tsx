import { ReactNode, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

import { Site } from "@/src/types/site";
import { collectorNames, formatDate } from "@/src/utils";
import { DISEASE_SITE_CONFIG } from "@/src/utils/constant";

// The header and every row are separate grids, so they share one column
// template to stay aligned. Each track has a fixed minimum (never `auto`),
// so a long or empty value can't resize its column in one row only.
// Below xl each row is laid out as a card and the header is hidden.
const COLUMNS =
  "xl:grid-cols-[minmax(190px,3fr)_minmax(90px,1fr)_minmax(80px,1fr)_minmax(72px,1fr)_minmax(110px,1.5fr)_84px]";
const COLUMNS_WITH_ACTIONS =
  "xl:grid-cols-[minmax(190px,3fr)_minmax(90px,1fr)_minmax(80px,1fr)_minmax(72px,1fr)_minmax(110px,1.5fr)_84px_212px]";

const siteListColumns = (showActions?: boolean) =>
  showActions ? COLUMNS_WITH_ACTIONS : COLUMNS;

// Column minimums + 12px gaps + 20px side padding. Narrower than this, the
// header and rows scroll sideways together instead of squeezing columns.
// 950px fits a 1280px screen with the sidebar open.
export const siteListMinWidth = (showActions?: boolean) =>
  showActions ? "xl:min-w-[950px]" : "xl:min-w-[726px]";

const EMPTY_VALUE = "—";

export function SiteListHeader({ showActions }: { showActions?: boolean }) {
  const labels = [
    "Site ID",
    "Farm Type",
    "Sub Type",
    "Site Type",
    "Collector",
    "Status",
    ...(showActions ? ["Actions"] : []),
  ];

  return (
    <div
      className={`hidden gap-x-3 border-b border-grey-20 bg-grey-10 px-5 py-3 xl:grid ${siteListColumns(showActions)}`}
    >
      {labels.map((label) => (
        <p
          key={label}
          className={`text-sm text-grey-70 ${label === "Actions" ? "text-right" : ""}`}
        >
          {label}
        </p>
      ))}
    </div>
  );
}

// One table cell. Below xl it also shows its column name, since the header
// row is hidden there.
function Cell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-wide text-grey-60 xl:hidden">
        {label}
      </span>
      {children}
    </div>
  );
}

function TextValue({ value }: { value?: string }) {
  return (
    <p
      className="truncate text-sm capitalize text-grey-70"
      title={value || undefined}
    >
      {value || EMPTY_VALUE}
    </p>
  );
}

function PhotoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-blue-10 ${className}`}>
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
  );
}

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
  const collector = collectorNames(site);


  return (
    <Link
      href={`/projects/${id}/sites/${site.id}`}
      className={`grid grid-cols-2 gap-x-4 gap-y-3 border-b border-grey-20 bg-white px-4 py-4 transition-colors hover:bg-grey-10/50 sm:grid-cols-3 sm:px-5 xl:items-center xl:gap-x-3 xl:gap-y-0 xl:py-3 ${siteListColumns(canUpdateCollectionPlan)}`}
    >
      <div className="col-span-full flex min-w-0 items-center gap-3 xl:col-span-1">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
          {site.photos?.length ? (
            <>
              {isLoading && <PhotoPlaceholder className="absolute inset-0" />}
              <Image
                className="h-full w-full object-cover"
                src={site.photos[0]}
                width={64}
                height={64}
                alt={"site photo"}
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : (
            <PhotoPlaceholder className="h-full w-full" />
          )}
        </div>
        <p
          className="line-clamp-2 min-w-0 text-base font-medium capitalize text-grey-80"
          title={site.name}
        >
          {site.name}
        </p>
      </div>

      <Cell label="Farm Type">
        <TextValue value={farmTypeLabel(site.farmType)} />
      </Cell>
      <Cell label="Sub Type">
        <TextValue value={site.siteSubType} />
      </Cell>
      <Cell label="Site Type">
        <TextValue value={site.siteType} />
      </Cell>
      <Cell label="Collector">
        {collector ? (
          <p className="truncate text-sm text-grey-80" title={collector}>
            {collector}
          </p>
        ) : (
          <p className="text-xs text-grey-70">[not assigned]</p>
        )}
      </Cell>

      <Cell label="Status" className="group relative">
        <span className="w-fit self-start rounded bg-yellow-20 px-2 py-1 text-[10px] font-bold uppercase leading-[15px] tracking-tight text-grey-80">
          {site.testResult ?? "-"}
        </span>
        <div className="absolute bottom-10 left-[-20px] z-10 hidden h-16 w-max flex-col justify-center gap-2 rounded bg-grey-80 p-3 shadow-lg group-hover:flex">
          <p className="text-[10px] font-bold uppercase leading-[15px] tracking-tight text-grey-40">
            Last visited on
          </p>
          <p className="text-sm text-white">
            {site?.lastVisited ? formatDate(new Date(site.lastVisited)) : ""}
          </p>
        </div>
      </Cell>

      {canUpdateCollectionPlan && (
        <div className="col-span-full flex items-center xl:col-span-1 xl:justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUpdateCollectionPlan?.(site);
            }}
            className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 sm:w-auto"
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
