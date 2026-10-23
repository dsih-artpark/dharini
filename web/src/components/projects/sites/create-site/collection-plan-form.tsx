import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { updateSiteApi } from "@/src/app/(dashboard)/projects/[id]/create-site/actions";
import { getProjectCollectorsApi } from "@/src/app/(dashboard)/projects/[id]/create-site/loader";
import { getSiteDetailApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import Select from "@/src/components/ui/select";
import { siteAtom } from "@/src/store/siteAtom";
import { User } from "@/src/types/global";

// Semantic frequency type — no magic numbers in UI logic
type FrequencyType =
  "once" | "daily" | "weekly" | "fortnightly" | "monthly" | "quarterly";

/** Maps a semantic frequency type to the numeric interval the API expects. */
const FREQUENCY_TO_INTERVAL: Record<FrequencyType, number> = {
  once: 0,
  daily: 1,
  weekly: 7,
  fortnightly: 14,
  monthly: 30,
  quarterly: 90,
};

/** Reverse-maps an API interval number back to a semantic frequency type. */
const INTERVAL_TO_FREQUENCY: Record<number, FrequencyType> = {
  0: "once",
  1: "daily",
  7: "weekly",
  14: "fortnightly",
  30: "monthly",
  90: "quarterly",
};

const FREQUENCY_OPTIONS: Array<{ label: string; value: FrequencyType }> = [
  { label: "Once", value: "once" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Fortnightly", value: "fortnightly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface CollectionPlan {
  frequencyType: FrequencyType; // semantic; converted to number only on submit
  collectionFrequency: number;
  collectionTime: string;
  collectionDuration: string;
  collectionCollector: string;
  collectionStartDate: string;
}

export default function CollectionPlanForm({
  className,
  onClose,
  siteId: propSiteId,
}: {
  className?: string;
  onClose?: () => void;
  siteId?: string;
}) {
  const { id, siteId: paramSiteId } = useParams<{
    id: string;
    siteId: string;
  }>();
  const siteId = propSiteId ?? paramSiteId;
  const router = useRouter();
  const [site, setSite] = useAtom(siteAtom);

  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState<(typeof WEEK_DAYS)[number][]>([]);
  const currentUTCTime = () => {
    const iso = new Date().toISOString();
    return iso.slice(11, 16); // "HH:mm"
  };
  // YYYY-MM-DD in the browser's local time. Not toISOString(), which is UTC
  // and gives yesterday's date between 00:00 and 05:30 IST.
  const toLocalDateString = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${mm}-${dd}`;
  };
  // Get today's date in YYYY-MM-DD format for default value
  const getTodayDate = () => toLocalDateString(new Date());
  // Earliest selectable start date (YYYY-MM-DD, local time): same day one
  // month ago, clamped to that month's last day (e.g. 31 Mar → 28/29 Feb).
  const getMinStartDate = () => {
    const today = new Date();
    const lastDayOfPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();
    const minDate = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      Math.min(today.getDate(), lastDayOfPrevMonth),
    );
    return toLocalDateString(minDate);
  };
  const minStartDate = getMinStartDate();
  // The site's saved start date, so an older existing plan can still be
  // edited without being forced to change its start date.
  const savedStartDate = site?.collectionStartDate
    ? new Date(site.collectionStartDate).toISOString().split("T")[0]
    : "";

  const [collectionPlanData, setCollectionPlanData] = useState<CollectionPlan>({
    frequencyType: "once",
    collectionFrequency: 1,
    collectionTime: currentUTCTime(),
    collectionDuration: "0",
    collectionCollector: "",
    collectionStartDate: getTodayDate(),
  });
  const [errors, setErrors] = useState({
    collectionCollector: "",
    collectionFrequency: "",
    collectionFrequencyInterval: "",
    dayOfWeek: "",
    collectionTime: "",
    collectionDuration: "",
    collectionStartDate: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjectMembers = async () => {
    try {
      const { data } = await getProjectCollectorsApi(id);
      setProjectMembers(data);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  useEffect(() => {
    if (site?.id) {
      const collectionCollector = site.collectionCollector as User;
      const interval = site.collectionFrequencyInterval ?? 7;
      setCollectionPlanData({
        frequencyType: INTERVAL_TO_FREQUENCY[interval] ?? "weekly",
        collectionFrequency: site.collectionFrequency ?? 1,
        collectionTime: site.collectionTime ?? currentUTCTime(),
        collectionDuration: ((site.collectionDuration ?? 0) / 30)?.toString(),
        collectionCollector: collectionCollector?.id ?? "",
        collectionStartDate: site.collectionStartDate
          ? new Date(site.collectionStartDate).toISOString().split("T")[0]
          : getTodayDate(),
      });
      setDayOfWeek(site.collectionDayOfWeek ?? []);
      fetchProjectMembers();
    }
  }, [site?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const update: Partial<CollectionPlan> = { [name]: value };

    if (name === "frequencyType") {
      const freq = value as FrequencyType;
      const isOnce = freq === "once";
      const isDaily = freq === "daily";

      if (isDaily) {
        setDayOfWeek(WEEK_DAYS);
      } else if (isOnce) {
        // Auto-select the day of the chosen start date
        if (collectionPlanData.collectionStartDate) {
          const date = new Date(collectionPlanData.collectionStartDate);
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          setDayOfWeek([days[date.getDay()]]);
        } else {
          setDayOfWeek([]);
        }
        update.collectionDuration = "0";
      } else {
        setDayOfWeek([]);
      }
    }

    if (
      name === "collectionStartDate" &&
      collectionPlanData.frequencyType === "once"
    ) {
      const date = new Date(value);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      setDayOfWeek([days[date.getDay()]]);
    }

    setCollectionPlanData((prev) => ({ ...prev, ...update }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const collectionDayClick = (day: (typeof WEEK_DAYS)[number]) => {
    const isOnce = collectionPlanData.frequencyType === "once";
    const isDaily = collectionPlanData.frequencyType === "daily";
    // Days are locked for Once and Daily
    if (isOnce || isDaily) return;
    setDayOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
    setErrors((prev) => ({ ...prev, dayOfWeek: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      collectionCollector: "",
      collectionFrequency: "",
      collectionFrequencyInterval: "",
      dayOfWeek: "",
      collectionTime: "",
      collectionDuration: "",
      collectionStartDate: "",
    };

    if (!collectionPlanData.collectionCollector) {
      newErrors.collectionCollector = "Need to assign any 1 collector";
    }
    if (!collectionPlanData.collectionFrequency) {
      newErrors.collectionFrequency = "Frequency is required.";
    }
    if (!collectionPlanData.frequencyType) {
      newErrors.collectionFrequencyInterval = "Frequency is required.";
    }
    if (!dayOfWeek.length) {
      newErrors.dayOfWeek = "Day of the week is required.";
    }
    if (!collectionPlanData.collectionTime) {
      newErrors.collectionTime = "Time is required.";
    }
    // Duration is not required for one-time visits
    if (collectionPlanData.frequencyType !== "once") {
      if (!collectionPlanData.collectionDuration) {
        newErrors.collectionDuration = "Duration is required.";
      } else if (Number(collectionPlanData.collectionDuration) <= 0) {
        newErrors.collectionDuration = "Duration must be greater than 0.";
      }
    }
    if (!collectionPlanData.collectionStartDate) {
      newErrors.collectionStartDate = "Collection start date is required.";
    } else if (
      collectionPlanData.collectionStartDate < minStartDate &&
      collectionPlanData.collectionStartDate !== savedStartDate
    ) {
      // `min` only greys out the picker; a typed date can still go below it.
      newErrors.collectionStartDate =
        "Collection start date cannot be more than 1 month in the past.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (id && siteId) {
          setLoading(true);
          // Build the payload explicitly — `frequencyType` is UI-only and
          // must not be sent to the API (Site has no such column).
          const { success, message, data } = await updateSiteApi(id, siteId, {
            collectionCollector: collectionPlanData.collectionCollector,
            collectionFrequency: Number(collectionPlanData.collectionFrequency),
            // Convert semantic type to API number only at submission boundary
            collectionFrequencyInterval:
              FREQUENCY_TO_INTERVAL[collectionPlanData.frequencyType],
            collectionDuration:
              Number(collectionPlanData.collectionDuration) * 30,
            collectionDayOfWeek: dayOfWeek,
            collectionTime: collectionPlanData.collectionTime,
            collectionStartDate: collectionPlanData.collectionStartDate,
          });
          if (success) {
            toast.success(message);
            setSite({ ...site, ...data });
            // The update's response has no visits, so the site is read back
            // for the schedule count and visit stats to show the new plan.
            getSiteDetailApi(id, siteId)
              .then(({ data: updated }) => setSite(updated))
              .catch((e) =>
                console.error("Failed to reload site after plan update:", e),
              );
            if (onClose) {
              onClose();
            } else {
              router.replace(`/projects/${id}/sites/${siteId}`);
            }
          }
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message ||
            "Error updating collection-plan. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className={
          "self-stretch flex-col justify-start items-center gap-8 flex " +
          className
        }
      >
        <div className="self-stretch flex-col justify-start items-start gap-4 flex">
          <h3 className="text-grey-80 text-lg font-semibold font-noto-serif leading-[23.4px]">
            Assigning Collectors
          </h3>
          <div className="self-stretch justify-start items-start gap-6 inline-flex flex-col sm:flex-row">
            {/* Collector Name */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 flex w-full">
              <label className="text-grey-80 text-base leading-normal">
                Collector Name <span className="text-red-500">*</span>
              </label>
              <Select
                name="collectionCollector"
                className="w-full self-stretch"
                options={projectMembers?.map((member) => ({
                  value: member.id,
                  label:
                    member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member.email,
                }))}
                onChange={handleChange}
                defaultValue={collectionPlanData.collectionCollector}
                placeholder=""
              />
              {errors.collectionCollector && (
                <p className="text-red-500 text-sm">
                  {errors.collectionCollector}
                </p>
              )}
            </div>

            {/* Collection Start Date */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 flex w-full">
              <label className="text-grey-80 text-base leading-normal">
                Collection Start Date <span className="text-red-500">*</span>
              </label>
              <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                <input
                  name="collectionStartDate"
                  type="date"
                  className="grow shrink basis-0 text-grey-80 text-sm leading-[21px] outline-none"
                  onChange={handleChange}
                  value={collectionPlanData.collectionStartDate}
                  min={minStartDate}
                />
              </div>
              {errors.collectionStartDate && (
                <p className="text-red-500 text-sm">
                  {errors.collectionStartDate}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-4 flex">
          <h3 className="text-grey-80 text-lg font-semibold font-noto-serif leading-[23.4px]">
            Collection Plan
          </h3>
          <div className="self-stretch justify-start items-start gap-6 inline-flex flex-col sm:flex-row">
            {/* Frequency */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 flex w-full">
              <label className="text-grey-80 text-base leading-normal">
                Frequency <span className="text-red-500">*</span>
              </label>
              <div className="self-stretch justify-start items-center inline-flex">
                <Select
                  className="w-full outline-none"
                  name="frequencyType"
                  onChange={handleChange}
                  defaultValue={collectionPlanData.frequencyType}
                  options={FREQUENCY_OPTIONS}
                  placeholder=""
                />
              </div>
              {errors.collectionFrequencyInterval && (
                <p className="text-red-500 text-sm">
                  {errors.collectionFrequencyInterval}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 flex w-full">
              <label className="self-stretch text-grey-80 text-base leading-normal">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="justify-start items-center gap-2 inline-flex w-full">
                <button
                  className="p-1 rounded-[999px] border border-blue-40 justify-center items-center gap-2 flex disabled:opacity-30"
                  onClick={() =>
                    setCollectionPlanData((prev) => ({
                      ...prev,
                      collectionDuration: `${Number(prev.collectionDuration) - 1}`,
                    }))
                  }
                  disabled={
                    !collectionPlanData.collectionDuration ||
                    collectionPlanData.collectionDuration === "0" ||
                    collectionPlanData.frequencyType === "once"
                  }
                  type="button"
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
                        d="M4.16797 9.16602H15.8346V10.8327H4.16797V9.16602Z"
                        fill="#284DB6"
                      />
                    </svg>
                  </div>
                </button>
                <div className="grow shrink basis-0 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input
                    name="collectionDuration"
                    type="number"
                    className="w-10 text-center text-grey-80 text-sm leading-[21px] outline-none disabled:opacity-50"
                    onChange={handleChange}
                    value={collectionPlanData.collectionDuration}
                    disabled={collectionPlanData.frequencyType === "once"}
                  />
                  <span className="text-sm">Months</span>
                </div>
                <button
                  className="p-1 rounded-[999px] border border-blue-40 justify-center items-center gap-2 flex disabled:opacity-30"
                  onClick={() =>
                    setCollectionPlanData((prev) => ({
                      ...prev,
                      collectionDuration: `${Number(prev.collectionDuration) + 1}`,
                    }))
                  }
                  disabled={collectionPlanData.frequencyType === "once"}
                  type="button"
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
                        d="M9.16797 9.16602V4.16602H10.8346V9.16602H15.8346V10.8327H10.8346V15.8327H9.16797V10.8327H4.16797V9.16602H9.16797Z"
                        fill="#284DB6"
                      />
                    </svg>
                  </div>
                </button>
              </div>
              {errors.collectionDuration && (
                <p className="text-red-500 text-sm">
                  {errors.collectionDuration}
                </p>
              )}
            </div>
          </div>

          {/* Preferred Collection Days */}
          <div className="self-stretch flex-col justify-start items-start gap-2 flex mt-2 w-full">
            <label className="text-grey-80 text-base leading-normal">
              Preferred collection days <span className="text-red-500">*</span>
            </label>
            <div className="self-stretch justify-start items-center gap-2 inline-flex flex-wrap">
              {WEEK_DAYS.map((day) => {
                const selected = dayOfWeek.includes(day);
                const isOnce = collectionPlanData.frequencyType === "once";
                const isDaily = collectionPlanData.frequencyType === "daily";
                const isDayLocked = isOnce || isDaily;
                return (
                  <div
                    key={day}
                    className={`min-w-[74px] h-8 px-2 py-1 ${
                      selected ? "bg-blue-10 border-blue-30" : "border-grey-20"
                    } rounded-[999px] border justify-center items-center gap-0.5 flex  ${
                      isDayLocked ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() => collectionDayClick(day)}
                  >
                    <p className="text-grey-80 text-xs leading-[18px]">{day}</p>
                    {selected && (
                      <div className="p-1 rounded-[999px] justify-center items-center gap-2 flex">
                        <div className="w-4 h-4 relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8.00048 7.05781L11.3005 3.75781L12.2431 4.70048L8.94315 8.00048L12.2431 11.3005L11.3005 12.2431L8.00048 8.94315L4.70048 12.2431L3.75781 11.3005L7.05781 8.00048L3.75781 4.70048L4.70048 3.75781L8.00048 7.05781Z"
                              fill="#284DB6"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.dayOfWeek && (
              <p className="text-red-500 text-sm">{errors.dayOfWeek}</p>
            )}
          </div>
        </div>
      </div>
      {!onClose ? (
        <div className="self-stretch pt-3 justify-end items-center gap-6 inline-flex">
          <button
            className="p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex text-blue-40 text-base leading-normal"
            onClick={() => router.replace(`/projects/${id}/sites/${siteId}`)}
          >
            Cancel
          </button>
          <button
            className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex text-white text-base leading-normal"
            onClick={handleSubmit}
            disabled={loading}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="self-stretch px-7 pt-5 pb-6 bg-white rounded-bl-lg rounded-br-lg border-t border-grey-20 justify-end items-center inline-flex">
          <div className="grow shrink basis-0 self-stretch justify-end items-center flex">
            <div className="justify-start items-center gap-5 flex">
              <button
                className="p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex text-blue-40 text-base leading-normal"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex text-white text-base leading-normal disabled:bg-grey-20"
                onClick={handleSubmit}
                disabled={loading}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
