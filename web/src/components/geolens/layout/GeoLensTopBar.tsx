import { Filter, RefreshCw, Search } from "lucide-react";
import type React from "react";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  GEOLENS_HEADER_SLOT_ID,
  GEOLENS_TABS,
  type GeoLensTab,
} from "@/src/app/(dashboard)/geolens/types";

interface GeoLensTopBarProps {
  activeTab: GeoLensTab | null;
  onTabClick: (tab: GeoLensTab) => void;
  headerSearch: string;
  setHeaderSearch: (value: string) => void;
  isSearching: boolean;
  handleHeaderSearch: (e: React.KeyboardEvent | React.MouseEvent) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilterCount: number;
  filtersButtonRef?: React.RefObject<HTMLButtonElement>;
}

export function GeoLensTopBar(props: GeoLensTopBarProps) {
  const {
    activeTab,
    onTabClick,
    headerSearch,
    setHeaderSearch,
    isSearching,
    handleHeaderSearch,
    showFilters,
    setShowFilters,
    activeFilterCount,
    filtersButtonRef,
  } = props;

  const filtersOn = showFilters || activeFilterCount > 0;

  // Layout effect, so the bar moves into the header before the first paint.
  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setHeaderSlot(document.getElementById(GEOLENS_HEADER_SLOT_ID));
  }, []);

  const content = (
    <>
      <h1 className="flex-shrink-0 text-lg font-bold tracking-tight text-grey-80">
        GeoLens
      </h1>

      <div className="flex min-w-0 flex-initial items-center rounded-[10px] border border-grey-20 bg-grey-10 p-[3px]">
        <nav
          aria-label="GeoLens tools"
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]"
        >
          {GEOLENS_TABS.map((t) => {
            const active = t.value === activeTab;
            return (
              <button
                key={t.value}
                type="button"
                aria-pressed={active}
                onClick={() => onTabClick(t.value)}
                className={`min-h-[34px] flex-shrink-0 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-white text-blue-40 shadow-sm"
                    : "text-grey-60 hover:text-grey-80"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        <div className="group hidden h-9 w-[260px] items-center gap-2 rounded-lg border border-grey-30 bg-grey-10 px-3 focus-within:border-blue-40 focus-within:bg-white md:flex">
          <Search size={15} className="shrink-0 text-grey-60" />
          <input
            type="text"
            aria-label="Search location"
            placeholder="Search location..."
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-grey-80 outline-none placeholder:text-grey-50"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            onKeyDown={handleHeaderSearch}
          />
          {isSearching && (
            <RefreshCw
              size={14}
              className="shrink-0 animate-spin text-blue-40"
            />
          )}
        </div>

        <button
          ref={filtersButtonRef}
          type="button"
          title="Filters"
          aria-label="Filters"
          aria-expanded={showFilters}
          aria-controls="geolens-filters"
          onClick={() => setShowFilters(!showFilters)}
          className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
            filtersOn
              ? "border-blue-40 bg-blue-10 text-blue-40"
              : "border-grey-30 bg-white text-grey-70 hover:bg-grey-10"
          }`}
        >
          <Filter size={16} />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-40 px-1 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </>
  );

  // Normally the bar lives in the app header's slot so the page has one header
  // row; if the slot isn't there, show it as a bar at the top of the page.
  if (headerSlot) {
    return createPortal(
      <div className="flex min-w-0 flex-1 items-center gap-4">{content}</div>,
      headerSlot,
    );
  }

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-grey-20 bg-white py-2 pl-4 pr-2.5 shadow-sm">
      {content}
    </header>
  );
}
