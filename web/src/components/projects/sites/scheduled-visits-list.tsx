"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { siteAtom } from "@/src/store/siteAtom";
import UpdateCollectionPlanModal from "@/src/components/projects/sites/update-collection-plan";
import RescheduleVisitModal from "@/src/components/projects/sites/reschedule-visit-modal";
import {
  getScheduledVisitsApi,
  rescheduleVisitApi,
} from "@/src/app/(dashboard)/projects/[id]/sites/[siteId]/loader";
import { Visit } from "@/src/types/visit";
import Spinner from "@/src/components/ui/spinner";
import { Calendar, Edit3, ArrowDown } from "lucide-react";
import { toast } from "react-toastify";

import { formatDate } from "@/src/utils";

export type ScheduleStatus =
  | "Overdue"
  | "Rescheduled"
  | "Scheduled"
  | "Completed"
  | "Skipped";

export interface ScheduleItem {
  id: string;
  dayNumber: string;
  dayOfWeek: string;
  monthYear: string;
  collectorName?: string;
  rescheduledNote?: string;
  status: ScheduleStatus;
  category: "upcoming" | "past";
  dateIso: string;
}

export default function ScheduledVisitsList({
  siteId,
  onCountChange,
}: {
  siteId?: string;
  onCountChange?: (count: number) => void;
}) {
  const { id: projectIdParam, siteId: siteIdParam } = useParams<{
    id: string;
    siteId: string;
  }>();
  const projectId = projectIdParam;
  const targetSiteId = siteId || siteIdParam;

  const siteDetail = useAtomValue(siteAtom);
  const [filterType, setFilterType] = useState<"upcoming" | "past" | "all">("upcoming");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiVisits, setApiVisits] = useState<Visit[]>([]);

  // Reschedule state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [selectedVisitForReschedule, setSelectedVisitForReschedule] =
    useState<ScheduleItem | null>(null);
  const [rescheduledOverrides, setRescheduledOverrides] = useState<
    Record<string, Partial<ScheduleItem>>
  >({});

  const activeRequestIdRef = useRef<number>(0);

  // Fetch visits using the exact mobile app query format with race condition protection
  const fetchScheduledVisits = useCallback(async () => {
    if (!projectId) return;
    const currentRequestId = ++activeRequestIdRef.current;
    try {
      setLoading(true);
      const params: Parameters<typeof getScheduledVisitsApi>[1] = {
        assignedTo: true,
      };
      if (targetSiteId) {
        params.siteId = targetSiteId;
      }
      // Skipped visits are past but never completed, so the past tab fetches
      // them alongside the completed ones.
      const skippedRequest =
        filterType === "past"
          ? getScheduledVisitsApi(projectId, { ...params, visitStatus: "skipped" })
          : undefined;
      if (filterType === "upcoming") {
        params.visitStatus = "upcoming";
      } else if (filterType === "past") {
        params.isCompleted = true;
      }

      const [response, skippedResponse] = await Promise.all([
        getScheduledVisitsApi(projectId, params),
        skippedRequest,
      ]);
      if (currentRequestId === activeRequestIdRef.current) {
        if (response?.success && Array.isArray(response.data)) {
          const skippedVisits =
            skippedResponse?.success && Array.isArray(skippedResponse.data)
              ? skippedResponse.data
              : [];
          setApiVisits([...response.data, ...skippedVisits]);
          if (onCountChange && filterType === "upcoming") {
            const count = response.total ?? response.data.length;
            onCountChange(count);
          }
        }
      }
    } catch (e) {
      if (currentRequestId === activeRequestIdRef.current) {
        console.error("Error fetching scheduled visits from API:", e);
      }
    } finally {
      if (currentRequestId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [projectId, targetSiteId, filterType, onCountChange]);

  useEffect(() => {
    fetchScheduledVisits();
  }, [fetchScheduledVisits]);

  // Derive plan title and subtext from siteDetail if available
  const planTitle = useMemo(() => {
    if (siteDetail?.collectionFrequency) {
      const days = siteDetail.collectionDayOfWeek?.join(", ") || "";
      if (siteDetail.collectionFrequencyInterval === 14) {
        return days ? `Every 2 weeks on ${days}` : "Every 2 weeks";
      }
      if (siteDetail.collectionFrequencyInterval === 7) {
        return days ? `Weekly on ${days}` : "Weekly";
      }
      if (siteDetail.collectionFrequencyInterval === 30) {
        return days ? `Monthly on ${days}` : "Monthly";
      }
      return days
        ? `Every ${siteDetail.collectionFrequencyInterval} days on ${days}`
        : "Collection Plan";
    }
    return "No collection plan configured";
  }, [siteDetail]);

  const planSubtitle = useMemo(() => {
    const collector = siteDetail?.collectionCollector;
    let collectorName = "";
    if (collector) {
      if (typeof collector === "object") {
        const name = `${collector.firstName || ""} ${collector.lastName || ""}`.trim();
        if (name) collectorName = name;
      } else if (typeof collector === "string") {
        collectorName = collector;
      }
    }
    const expiryStr = siteDetail?.collectionExpiryDate
      ? formatDate(siteDetail.collectionExpiryDate)
      : "";
    const parts = [];
    if (expiryStr) parts.push(`Until ${expiryStr}`);
    if (collectorName) parts.push(collectorName);
    return parts.join(" · ");
  }, [siteDetail]);

  // Map API visits directly
  const filteredItems = useMemo(() => {
    const items: ScheduleItem[] = apiVisits.map((v) => {
      const dateStr = v.visitScheduledAt || v.visitedAt || v.createdAt || "";
      const dateObj = new Date(dateStr);
      const dayNumber = isNaN(dateObj.getTime())
        ? "01"
        : String(dateObj.getDate()).padStart(2, "0");
      const dayOfWeek = isNaN(dateObj.getTime())
        ? "Mon"
        : dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const monthYear = isNaN(dateObj.getTime())
        ? ""
        : dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      let status: ScheduleStatus = "Scheduled";
      let rescheduledNote: string | undefined = undefined;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      if (v.isCompleted || v.visitStatus === "completed") {
        status = "Completed";
      } else if (v.visitStatus === "skipped") {
        status = "Skipped";
      } else if (v.rescheduledFrom) {
        status = "Rescheduled";
      } else if (
        v.visitStatus === "overdue" ||
        (!isNaN(dateObj.getTime()) && dateObj.getTime() < todayStart.getTime())
      ) {
        status = "Overdue";
      } else if (v.visitStatus === "upcoming") {
        status = "Scheduled";
      }

      if (v.rescheduledFrom) {
        const oldDate = new Date(v.rescheduledFrom);
        if (!isNaN(oldDate.getTime())) {
          const oldDay = String(oldDate.getDate()).padStart(2, "0");
          const oldMonth = oldDate.toLocaleDateString("en-US", { month: "short" });
          rescheduledNote = `Moved from ${oldDay} ${oldMonth}`;
        }
      }

      const collector = v.collector;
      let collectorName = "";
      if (collector) {
        if (typeof collector === "object") {
          collectorName =
            `${collector.firstName || ""} ${collector.lastName || ""}`.trim() ||
            collector.email ||
            "";
        } else if (typeof collector === "string") {
          collectorName = collector;
        }
      }

      return {
        id: v.id,
        dayNumber,
        dayOfWeek,
        monthYear,
        collectorName,
        rescheduledNote,
        status,
        // The backend refuses to reschedule a skipped visit.
        category: (v.isCompleted || status === "Skipped" ? "past" : "upcoming") as
          | "upcoming"
          | "past",
        dateIso: dateStr,
      };
    });

    // Apply any local reschedule overrides
    const mappedItems = items.map((item) => {
      if (rescheduledOverrides[item.id]) {
        return {
          ...item,
          ...rescheduledOverrides[item.id],
        };
      }
      return item;
    });

    // Chronological sorting
    if (filterType === "past") {
      mappedItems.sort(
        (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime(),
      );
    } else {
      mappedItems.sort(
        (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime(),
      );
    }

    return mappedItems;
  }, [apiVisits, filterType, rescheduledOverrides]);

  // Limit display if not expanded
  const displayItems = useMemo(() => {
    if (filterType === "upcoming" && !expanded && filteredItems.length > 4) {
      return filteredItems.slice(0, 4);
    }
    return filteredItems;
  }, [filteredItems, expanded, filterType]);

  // Group items by monthYear
  const groupedItems = useMemo(() => {
    const groups: { [month: string]: ScheduleItem[] } = {};
    displayItems.forEach((item) => {
      if (!groups[item.monthYear]) {
        groups[item.monthYear] = [];
      }
      groups[item.monthYear].push(item);
    });
    return groups;
  }, [displayItems]);

  const handleOpenReschedule = (item: ScheduleItem) => {
    if (item.category === "past" || item.status === "Completed") {
      const outcome =
        item.status === "Skipped" ? "was skipped" : "is already completed";
      toast.info(
        `Visit on ${item.dayNumber} ${item.monthYear} ${outcome} and cannot be rescheduled.`,
      );
      return;
    }
    setSelectedVisitForReschedule(item);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async (
    visitId: string,
    newDateIso: string,
  ) => {
    try {
      if (projectId) {
        const formattedDate = newDateIso.includes("T")
          ? newDateIso
          : new Date(`${newDateIso}T09:00:00.000Z`).toISOString();
        await rescheduleVisitApi(projectId, visitId, {
          newScheduledDate: formattedDate,
        });
      }

      const newDate = new Date(newDateIso);
      const dayNumber = String(newDate.getDate()).padStart(2, "0");
      const dayOfWeek = newDate.toLocaleDateString("en-US", { weekday: "short" });
      const monthYear = newDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const targetItem = filteredItems.find((i) => i.id === visitId);
      const oldDay = targetItem ? targetItem.dayNumber : "";
      const oldMonth = targetItem
        ? targetItem.monthYear.split(" ")[0].slice(0, 3)
        : "";
      const noteText =
        oldDay && oldMonth ? `Moved from ${oldDay} ${oldMonth}` : "Rescheduled";

      setRescheduledOverrides((prev) => ({
        ...prev,
        [visitId]: {
          dayNumber,
          dayOfWeek,
          monthYear,
          status: "Rescheduled",
          rescheduledNote: noteText,
          dateIso: newDateIso,
        },
      }));

      toast.success(
        `Visit rescheduled to ${dayOfWeek}, ${dayNumber} ${monthYear}`,
      );

      // Re-fetch scheduled visits from API to ensure sync
      await fetchScheduledVisits();
    } catch (err) {
      toast.error(
        (err instanceof Error && err.message) || "Failed to reschedule visit",
      );
      throw err;
    }
  };

  const getStatusBadge = (status: ScheduleStatus) => {
    switch (status) {
      case "Overdue":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FDE8E8] text-[#C81E1E]">
            Overdue
          </span>
        );
      case "Rescheduled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E1EFFE] text-[#1A56DB]">
            Rescheduled
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-grey-10 text-grey-70">
            Scheduled
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-10 text-green-30">
            Completed
          </span>
        );
      case "Skipped":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-olive-10 text-olive-30">
            Skipped
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Plan Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base sm:text-lg font-semibold text-grey-90 tracking-tight">
            {planTitle}
          </h2>
          <p className="text-xs sm:text-sm text-grey-60">
            {planSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlanModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-grey-20 bg-white px-4 py-2 text-sm font-medium text-grey-80 shadow-xs transition hover:bg-grey-10 hover:border-grey-30 active:bg-grey-20 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-grey-70" />
          <span>Edit plan</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterType("upcoming")}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${filterType === "upcoming"
              ? "bg-[#DCE8FC] text-[#1A56DB] font-semibold"
              : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10"
            }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setFilterType("past")}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${filterType === "past"
              ? "bg-[#DCE8FC] text-[#1A56DB] font-semibold"
              : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10"
            }`}
        >
          Past
        </button>
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${filterType === "all"
              ? "bg-[#DCE8FC] text-[#1A56DB] font-semibold"
              : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10"
            }`}
        >
          All
        </button>
      </div>

      {/* Schedule List Card */}
      <div className="relative rounded-2xl border border-grey-20 bg-white p-5 sm:p-6 shadow-sm">
        {loading && apiVisits.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : Object.keys(groupedItems).length === 0 ? (
          <div className="py-12 text-center text-sm text-grey-60">
            No scheduled visits found for this filter.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(groupedItems).map(([monthYear, items]) => (
              <div key={monthYear} className="flex flex-col">
                {/* Month Group Header */}
                <h3 className="text-sm font-medium text-grey-60 mb-2">
                  {monthYear}
                </h3>

                {/* Items in Month */}
                <div className="divide-y divide-grey-20 border-t border-grey-20">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenReschedule(item)}
                      className="group flex items-center justify-between py-4 transition-colors hover:bg-blue-10/40 px-2 sm:px-3 rounded-xl cursor-pointer"
                      title={
                        item.category === "upcoming"
                          ? "Click to reschedule this visit"
                          : undefined
                      }
                    >
                      {/* Left: Date + Info */}
                      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                        {/* Date block */}
                        <div className="flex flex-col items-center justify-center w-10 sm:w-12 text-center shrink-0">
                          <span className="text-lg sm:text-xl font-bold text-grey-90 leading-tight group-hover:text-primary-500 transition-colors">
                            {item.dayNumber}
                          </span>
                          <span className="text-xs font-normal text-grey-60 mt-0.5">
                            {item.dayOfWeek}
                          </span>
                        </div>

                        {/* Text info */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-sm sm:text-base font-semibold text-grey-90 truncate group-hover:text-primary-500 transition-colors">
                            {item.collectorName || "Unassigned"}
                          </h4>
                          {item.rescheduledNote && (
                            <span className="text-xs font-medium text-[#1A56DB] mt-0.5">
                              {item.rescheduledNote}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Badge + Action Button */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {getStatusBadge(item.status)}

                        {item.category === "upcoming" ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReschedule(item);
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-grey-20 bg-white px-2.5 py-1.5 text-xs font-medium text-grey-70 transition hover:bg-blue-10 hover:text-primary-500 hover:border-blue-20 shadow-2xs active:scale-95"
                            title="Reschedule visit"
                            aria-label="Reschedule visit"
                          >
                            <Calendar className="w-3.5 h-3.5 text-grey-70 group-hover:text-primary-500" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(
                                `Visit on ${item.dayNumber} ${item.monthYear} was ${item.status === "Skipped" ? "skipped" : "completed"}.`,
                              );
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-grey-20 text-grey-70 transition hover:bg-grey-10 hover:text-grey-90 active:scale-95"
                            title="View visit details"
                            aria-label="View visit details"
                          >
                            <Calendar className="w-4 h-4 text-grey-70" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expand / Down arrow button */}
        {!loading && filteredItems.length > 4 && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-grey-20 bg-white shadow-md text-grey-70 transition hover:bg-grey-10 hover:text-grey-90 active:scale-95"
              title={expanded ? "Show less" : "Show more scheduled visits"}
              aria-label={expanded ? "Show less" : "Show more scheduled visits"}
            >
              <ArrowDown
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Visit Modal */}
      <RescheduleVisitModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedVisitForReschedule(null);
        }}
        visit={selectedVisitForReschedule}
        onConfirm={handleConfirmReschedule}
      />

      {/* Edit Collection Plan Modal */}
      <UpdateCollectionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          fetchScheduledVisits();
        }}
        siteId={targetSiteId || siteDetail?.id}
      />
    </div>
  );
}
