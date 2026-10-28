import { Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import Select from "@/src/components/ui/select";
import type { Site } from "@/src/app/(dashboard)/geolens/types";
import type { PickableSite } from "../filters/useSurveillanceFilters";
import { PlaceSearch, type PlaceSuggestion } from "./PlaceSearch";

type Slot = "A" | "B";

export const SITE_COLORS = {
  A: "#3498db",
  B: "#27ae60",
} as const;

export interface PickedLocation {
  name: string;
  region?: string;
  lat: number;
  lng: number;
}

export interface CompareSitesProps {
  activeSlot: Slot;
  setActiveSlot: (slot: Slot) => void;
  siteA: Site | null;
  siteB: Site | null;
  locationA: PickedLocation | null;
  locationB: PickedLocation | null;
  pickableSites: PickableSite[];
  onPickSite: (slot: Slot, siteId: string) => void;
  onClearSite: (slot: Slot) => void;
  onPickPlace: (slot: Slot, place: PlaceSuggestion) => void;
}

const ICON_BUTTON =
  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-grey-60 hover:bg-black/5 hover:text-grey-80";

/**
 * Site A and Site B, one under the other, for the Compare side panel. The
 * site touched last is the one a map click or the top-bar search sets.
 */
export function CompareSites(props: CompareSitesProps) {
  const {
    activeSlot,
    setActiveSlot,
    siteA,
    siteB,
    locationA,
    locationB,
    pickableSites,
    onPickSite,
    onClearSite,
    onPickPlace,
  } = props;

  return (
    <div className="flex flex-col gap-2">
      {(
        [
          ["A", siteA, locationA],
          ["B", siteB, locationB],
        ] as const
      ).map(([slot, site, location]) => (
        <SiteField
          key={slot}
          slot={slot}
          site={site}
          location={location}
          active={activeSlot === slot}
          onActivate={() => setActiveSlot(slot)}
          sites={pickableSites}
          onPick={(id) => onPickSite(slot, id)}
          onClear={() => onClearSite(slot)}
          onPickPlace={(place) => onPickPlace(slot, place)}
        />
      ))}
    </div>
  );
}

/**
 * One site: its badge, then the picked site (name over its state) or the
 * site dropdown, a place-search button and a clear button. The search
 * button turns the row into the place search until a place is picked or
 * it's closed.
 */
function SiteField({
  slot,
  site,
  location,
  active,
  onActivate,
  sites,
  onPick,
  onClear,
  onPickPlace,
}: {
  slot: Slot;
  site: Site | null;
  location: PickedLocation | null;
  active: boolean;
  onActivate: () => void;
  sites: PickableSite[];
  onPick: (siteId: string) => void;
  onClear: () => void;
  onPickPlace: (place: PlaceSuggestion) => void;
}) {
  const [searching, setSearching] = useState(false);
  const stopSearching = useCallback(() => setSearching(false), []);
  const options = useMemo(
    () => sites.map((s) => ({ label: s.name, value: s.id })),
    [sites],
  );
  const where = location
    ? `${location.name}${location.region ? ` · ${location.region}` : ""} · ${location.lat.toFixed(2)}° N, ${location.lng.toFixed(2)}° E`
    : undefined;

  return (
    // Touching any part of the row makes it the site the map sets
    <div
      role="group"
      aria-label={`Site ${slot}`}
      data-active={active}
      onMouseDownCapture={onActivate}
      onFocusCapture={onActivate}
      className={`relative flex min-h-10 min-w-0 items-center gap-2 rounded-lg border py-1 pl-1.5 pr-1 transition-colors ${
        active
          ? "border-blue-40 bg-blue-10"
          : "border-grey-30 bg-white hover:border-grey-40"
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
        style={{ background: SITE_COLORS[slot] }}
      >
        {slot}
      </span>

      {searching ? (
        <PlaceSearch
          label={`Search a place for Site ${slot}`}
          onPick={(place) => {
            onPickPlace(place);
            setSearching(false);
          }}
          onCancel={stopSearching}
        />
      ) : (
        <>
          <span className="min-w-0 flex-1">
            {site ? (
              <button
                type="button"
                aria-pressed={active}
                onClick={onActivate}
                title={where}
                className="block w-full min-w-0 text-left"
              >
                <span className="sr-only">Site {slot}: </span>
                <span className="block truncate text-[13px] font-semibold leading-tight text-grey-80">
                  {location?.name ?? site.name}
                </span>
                {location?.region && (
                  <span className="block truncate text-[11px] leading-tight text-grey-60">
                    {location.region}
                  </span>
                )}
              </button>
            ) : sites.length > 0 ? (
              <Select
                name={`Site ${slot}`}
                options={options}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) onPick(String(e.target.value));
                }}
                placeholder={`Select Site ${slot}`}
                isClearable={false}
                noResultsText="No matching sites"
                className="!h-7 w-full !min-w-0 !border-0 !bg-transparent !px-0 !py-0"
              />
            ) : (
              <span className="block min-w-0">
                <span className="block truncate text-[13px] font-semibold leading-tight text-grey-80">
                  Site {slot}
                </span>
                <span className="block truncate text-[11px] leading-tight text-grey-60">
                  Click the map or search
                </span>
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setSearching(true)}
            aria-label={`Search a place for Site ${slot}`}
            title="Search a place"
            className={ICON_BUTTON}
          >
            <Search size={15} />
          </button>
          {site && (
            <button
              type="button"
              onClick={onClear}
              aria-label={`Clear Site ${slot}`}
              title={`Clear Site ${slot}`}
              className={ICON_BUTTON}
            >
              <X size={15} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
