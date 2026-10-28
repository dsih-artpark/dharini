import { ChevronRight, X } from "lucide-react";
import type { FilterChip } from "../filters/useSurveillanceFilters";

/** Top-left of the map: the "open panel" button (when collapsed) and filter chips. */
export function MapFilterBar({
  showOpenPanel,
  onOpenPanel,
  chips,
  onRemoveChip,
}: {
  showOpenPanel: boolean;
  onOpenPanel: () => void;
  chips: FilterChip[];
  onRemoveChip: (key: FilterChip["key"]) => void;
}) {
  if (!showOpenPanel && chips.length === 0) return null;

  return (
    <div className="pointer-events-none absolute left-3 right-16 top-3 z-[1000] flex flex-wrap items-center gap-1.5">
      {showOpenPanel && (
        <button
          type="button"
          onClick={onOpenPanel}
          title="Open panel"
          aria-label="Open panel"
          className="pointer-events-auto flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-grey-20 bg-white text-grey-80 shadow-md hover:bg-grey-10"
        >
          <ChevronRight size={16} />
        </button>
      )}
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="pointer-events-auto flex min-h-[30px] max-w-[260px] items-center gap-1 rounded-full border border-grey-20 bg-white pl-2.5 pr-1 text-xs text-grey-80 shadow-md"
        >
          <span className="truncate">
            {chip.name}: <b className="font-semibold">{chip.value}</b>
          </span>
          <button
            type="button"
            onClick={() => onRemoveChip(chip.key)}
            aria-label={`Remove ${chip.name} filter`}
            className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-grey-60 hover:bg-grey-10 hover:text-grey-80"
          >
            <X size={12} />
          </button>
        </span>
      ))}
    </div>
  );
}
