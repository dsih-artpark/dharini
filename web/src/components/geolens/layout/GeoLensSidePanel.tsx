import { ChevronLeft } from "lucide-react";
import type React from "react";

export function GeoLensSidePanel({
  title,
  subtitle,
  onCollapse,
  footer,
  narrow = false,
  children,
}: {
  title: string;
  subtitle: string;
  onCollapse: () => void;
  footer?: React.ReactNode;
  /** 260px instead of 300px (Compare, whose map needs the room). */
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside
      aria-label={title}
      className={`flex min-h-0 w-full flex-shrink-0 flex-col overflow-hidden rounded-xl border border-grey-20 bg-white shadow-sm ${
        narrow ? "lg:w-[260px]" : "lg:w-[300px]"
      }`}
    >
      <div className="border-b border-grey-20 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-grey-80">{title}</h2>
          <button
            type="button"
            onClick={onCollapse}
            title="Collapse panel"
            aria-label="Collapse panel"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-grey-30 text-grey-70 hover:bg-grey-10"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        <p className="mt-1 text-xs text-grey-60">{subtitle}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {children}
      </div>
      {footer && (
        <div className="border-t border-grey-20 px-4 py-3">{footer}</div>
      )}
    </aside>
  );
}

export function ResetMapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-9 w-full items-center justify-center rounded-lg border border-red-20 bg-white text-[13px] font-semibold text-red-30 hover:bg-red-10"
    >
      Reset map
    </button>
  );
}
