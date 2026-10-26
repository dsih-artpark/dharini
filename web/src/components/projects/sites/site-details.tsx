"use client";

import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

import EditSiteDetailModal from "@/src/components/projects/sites/edit-site-details";
import UpdateCollectionPlanModal from "@/src/components/projects/sites/update-collection-plan";
import PhotosCommentsModal from "@/src/components/projects/sites/photos-comments";
import { projectAtom } from "@/src/store/projectAtom";
import { siteAtom } from "@/src/store/siteAtom";
import { getProjectDetailApi } from "@/src/app/(dashboard)/projects/[id]/loader";
import { getSiteDetailApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { User } from "@/src/types/global";
import { useHasPermission } from "@/src/hooks/check-permission";
import Spinner from "@/src/components/ui/spinner";

const MapRenderer = dynamic(() => import("@/src/components/ui/map-renderer"), {
  ssr: false,
});

const EditIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-7 w-7 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-blue-10"
    aria-label="Edit"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4.16667 15.8324H5.345L13.1067 8.07076L11.9283 6.89243L4.16667 14.6541V15.8324ZM17.5 17.4991H2.5V13.9633L13.6958 2.76743C13.8521 2.6112 14.064 2.52344 14.285 2.52344C14.506 2.52344 14.7179 2.6112 14.8742 2.76743L17.2317 5.12493C17.3879 5.2812 17.4757 5.49312 17.4757 5.71409C17.4757 5.93506 17.3879 6.14699 17.2317 6.30326L7.7025 15.8324H17.5V17.4991ZM13.1067 5.71409L14.285 6.89243L15.4633 5.71409L14.285 4.53576L13.1067 5.71409Z"
        fill="currentColor"
      />
    </svg>
  </button>
);

const EmptyBadge = () => (
  <div className="inline-flex items-center rounded bg-yellow-10 px-2 py-1">
    <p className="text-[10px] font-medium uppercase leading-[15px] tracking-tight text-yellow-30">
      not assigned
    </p>
  </div>
);

// collectionConsent is stored as the string "true"/"false", or null if never recorded
const getCollectionConsentLabel = (consent?: string | null) => {
  if (consent === "true") return "Yes";
  if (consent === "false") return "No";
  return "Not Recorded";
};

const DetailIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-10 text-teal-40">
    {children}
  </div>
);

export default function SiteDetails() {
  const { id, siteId } = useParams<{ id: string; siteId: string }>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCollectionPlan, setIsOpenCollectionPlan] =
    useState<boolean>(false);
  const [isOpenPhotos, setIsOpenPhotos] = useState<boolean>(false);
  const [project, setProject] = useAtom(projectAtom);
  const [siteDetail, setSiteDetail] = useAtom(siteAtom);
  const hasPermission = useHasPermission();
  const canUpdateSite = hasPermission(
    "update",
    "site",
    id,
    siteDetail?.createdBy?.team?.id,
  );
  const canUpdateCollectionPlan = hasPermission(
    "update",
    "collection-plan",
    id,
    siteDetail?.createdBy?.team?.id,
  );

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

  const openMapUrl = () => {
    window.open(
      `https://maps.google.com/?q=${siteDetail?.location?.coordinates?.coordinates?.toReversed()}`,
      "_blank",
    );
  };

  const formatFrequency = () => {
    if (!siteDetail?.collectionFrequency) return "--";

    if (siteDetail.collectionFrequencyInterval === 0) return "Once";

    return `${siteDetail.collectionFrequency} time per ${
      {
        1: "day",
        7: "week",
        14: "fortnight",
        30: "month",
        90: "quarter",
      }[siteDetail.collectionFrequencyInterval ?? 0] ??
      siteDetail.collectionFrequencyInterval
    }`;
  };

  if (!project || !siteDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const ownerInitials = siteDetail?.siteOwnerName
    ?.split(" ")
    .map((c) => c.charAt(0))
    .join("");
  const collector = siteDetail.collectionCollector as User | undefined;

  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_345px]">
      <div className="flex min-w-0 flex-col gap-5">
        <section className="rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-grey-20 pb-4">
            <h2 className="text-base font-semibold text-grey-90">
              Site Details
            </h2>
            {canUpdateSite && <EditIcon onClick={() => setIsOpen(true)} />}
          </div>

          <div className="grid gap-7 pt-5 md:grid-cols-[minmax(0,1fr)_264px]">
            <div className="flex min-w-0 flex-col gap-3">
              <h3 className="text-sm font-semibold text-grey-90">
                Site Address
              </h3>
              <div className="flex flex-col gap-2">
                <p className="text-xs leading-5 text-grey-70">
                  {siteDetail?.address}
                  <br />
                  {siteDetail?.location?.region?.name},{" "}
                  {siteDetail?.location?.region?.parentRegion?.name} -{" "}
                  {siteDetail?.pinCode}
                </p>
                <button
                  type="button"
                  onClick={openMapUrl}
                  className="w-fit text-xs font-medium leading-5 text-primary-500"
                >
                  View on Maps
                </button>
              </div>
              <div className="h-[272px] overflow-hidden rounded-md border border-grey-20 bg-grey-10">
                <MapRenderer
                  location={
                    siteDetail?.location?.coordinates?.coordinates?.toReversed() as [
                      number,
                      number,
                    ]
                  }
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-grey-90">
                  Collection Consent
                </h3>
                <div className="inline-flex w-fit items-center gap-2 rounded-md border border-grey-20 bg-white px-3 py-2 text-xs text-grey-80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 8V21C21 21.2652 20.8946 21.5196 20.7071 21.7071C20.5196 21.8946 20.2652 22 20 22H4C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2H15L21 8ZM19 9H14V4H5V20H19V9Z"
                      fill="currentColor"
                    />
                  </svg>
                  {getCollectionConsentLabel(siteDetail?.collectionConsent)}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-grey-90">
                  Owner&apos;s Contact
                </h3>
                <div className="flex items-center gap-3 rounded-md border border-grey-20 px-3 py-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-20 text-xs font-medium uppercase text-grey-90">
                    {ownerInitials}
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-medium text-grey-90">
                      {siteDetail?.siteOwnerName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-grey-70">
                      <span>Caretaker</span>
                      <span>|</span>
                      <span className="text-primary-500">
                        +91 {siteDetail?.siteOwnerNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <DetailIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2C6.477 2 2 6.477 2 12C2 16.747 5.308 20.722 9.745 21.745L12 24L14.255 21.745C18.692 20.722 22 16.747 22 12C22 6.477 17.523 2 12 2ZM7.012 18.257C8.29 16.87 10.124 16 12.16 16C14.012 16 15.704 16.721 16.955 17.899C15.604 19.199 13.766 20 11.999 20C10.146 20 8.43 19.366 7.012 18.257ZM12 14C10.343 14 9 12.657 9 11C9 9.343 10.343 8 12 8C13.657 8 15 9.343 15 11C15 12.657 13.657 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </DetailIcon>
                  <div>
                    <p className="text-xs text-grey-60">Site Ownership</p>
                    <p className="text-sm font-medium text-grey-90">
                      Government
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DetailIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M16 11C17.657 11 19 9.657 19 8C19 6.343 17.657 5 16 5C14.343 5 13 6.343 13 8C13 9.657 14.343 11 16 11ZM8 11C9.657 11 11 9.657 11 8C11 6.343 9.657 5 8 5C6.343 5 5 6.343 5 8C5 9.657 6.343 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
                        fill="currentColor"
                      />
                    </svg>
                  </DetailIcon>
                  <div>
                    <p className="text-xs text-grey-60">Total Workers</p>
                    <p className="text-sm font-medium text-grey-90">
                      {siteDetail?.workerNumber ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-grey-20 pb-4">
            <div>
              <p className="text-base font-semibold text-grey-90">
                Photos & Comments
              </p>
              <p className="mt-1 text-xs text-grey-60">
                Reference imagery captured during visits.
              </p>
            </div>
            {canUpdateSite && (
              <EditIcon onClick={() => setIsOpenPhotos(true)} />
            )}
          </div>
          <div className="flex flex-col gap-6 pt-5 sm:flex-row">
            <div className="flex w-full flex-col gap-2 sm:w-1/2">
              <div className="text-[10px] uppercase leading-[15px] tracking-tight text-grey-60">
                Comments
              </div>
              <div className="min-h-[104px] rounded bg-subtle px-4 py-3">
                <p className="text-sm leading-[21px] text-grey-80">
                  {siteDetail?.comment ?? "NA"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              {siteDetail?.photos?.slice(0, 3).map((photo, i) => {
                return (
                  <div
                    key={i}
                    className="relative flex h-[104px] w-[104px] items-center justify-center rounded bg-blue-10"
                  >
                    <Image
                      className="h-[104px] w-[104px] rounded object-cover"
                      src={photo}
                      width={104}
                      height={104}
                      alt="site photo"
                    />
                    {siteDetail.photos &&
                      siteDetail?.photos?.length > 3 &&
                      i === 2 && (
                        <p className="absolute text-xl leading-[25px] text-white">
                          +{siteDetail?.photos?.length - 3}
                        </p>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-5">
        <section className="rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-grey-20 pb-4">
            <h2 className="text-base font-semibold text-grey-90">
              Collection Plan
            </h2>
            {canUpdateCollectionPlan && (
              <EditIcon onClick={() => setIsOpenCollectionPlan(true)} />
            )}
          </div>

          <div className="flex flex-col gap-7 pt-5">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-grey-90">
                Plan Details
              </h3>

              <div className="flex items-center gap-3">
                <DetailIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM13 11H17V13H11V6H13V11Z"
                      fill="currentColor"
                    />
                  </svg>
                </DetailIcon>
                <div>
                  <p className="text-xs text-grey-60">Frequency</p>
                  <p className="text-sm font-medium text-grey-90">
                    {formatFrequency()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DetailIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM13 12H17V14H11V7H13V12Z"
                      fill="currentColor"
                    />
                  </svg>
                </DetailIcon>
                <div>
                  <p className="text-xs text-grey-60">Preferred Days</p>
                  <p className="text-sm font-medium text-grey-90">
                    {siteDetail?.collectionDayOfWeek
                      ? siteDetail?.collectionDayOfWeek?.join(" | ")
                      : "--"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DetailIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9H20V5H17V7H15V5H9V7H7V5H4V9ZM4 11V19H20V11H4Z"
                      fill="currentColor"
                    />
                  </svg>
                </DetailIcon>
                <div>
                  <p className="text-xs text-grey-60">Duration</p>
                  <p className="text-sm font-medium text-grey-90">
                    {siteDetail?.collectionFrequencyInterval === 0
                      ? "1 Visit"
                      : siteDetail?.collectionDuration
                        ? `${siteDetail?.collectionDuration / 30} Month`
                        : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-grey-90">
                Assigned Collectors
              </h3>
              {collector ? (
                <div className="flex items-center gap-3 border-t border-grey-20 pt-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-10 text-xs font-medium uppercase text-grey-90">
                    {collector?.firstName?.charAt(0) ??
                      collector?.email?.charAt(0)}
                    {collector?.lastName?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-grey-90">
                      {collector?.firstName} {collector?.lastName}
                    </p>
                    <p className="truncate text-xs text-grey-60">
                      {collector?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyBadge />
              )}
            </div>
          </div>
        </section>
      </aside>

      <EditSiteDetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <UpdateCollectionPlanModal
        isOpen={isOpenCollectionPlan}
        onClose={() => setIsOpenCollectionPlan(false)}
      />
      <PhotosCommentsModal
        projectId={id}
        isOpen={isOpenPhotos}
        onClose={() => setIsOpenPhotos(false)}
      />
    </div>
  );
}
