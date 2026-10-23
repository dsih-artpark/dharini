import { RefreshCw, Search, SlidersHorizontal, Target } from "lucide-react";
import type React from "react";

interface DashboardHeaderProps {
  headerSearch: string;
  setHeaderSearch: (value: string) => void;
  isSearching: boolean;
  handleHeaderSearch: (e: React.KeyboardEvent | React.MouseEvent) => void;
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilterCount: number;
  filtersButtonRef?: React.RefObject<HTMLButtonElement>;
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const {
    headerSearch,
    setHeaderSearch,
    isSearching,
    handleHeaderSearch,
    showComparison,
    setShowComparison,
    showFilters,
    setShowFilters,
    activeFilterCount,
    filtersButtonRef,
  } = props;

  return (
    <header className="dashboard-header">
      <div className="header-controls w-full justify-between">
        <div className="flex w-full items-center gap-2">
          <div className="group flex h-10 w-[250px] flex-shrink-0 items-center gap-2 rounded-lg border border-grey-40 bg-white px-3 transition-all hover:border-blue-40 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-40/10">
            <Search
              size={16}
              strokeWidth={2.3}
              className="shrink-0 text-grey-45 transition-colors group-focus-within:text-blue-600"
            />
            <input
              type="text"
              placeholder="Search location..."
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-medium text-grey-80 outline-none placeholder:text-grey-45"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={handleHeaderSearch}
            />
            {isSearching && (
              <RefreshCw
                size={14}
                className="shrink-0 animate-spin text-blue-600"
              />
            )}
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-2">
            <button
              ref={filtersButtonRef}
              type="button"
              className={`relative flex h-10 flex-shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? "border-blue-30 bg-blue-10 text-blue-50"
                  : "border-grey-40 bg-white text-grey-80 hover:border-blue-40"
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={14} /> Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-40 px-1 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              className="compare-btn flex-shrink-0"
              onClick={() => setShowComparison(!showComparison)}
            >
              <Target size={14} /> Compare Sites
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
