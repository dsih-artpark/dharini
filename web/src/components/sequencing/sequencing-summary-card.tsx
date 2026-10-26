import type { ReactNode } from "react";

type SequencingSummaryCardProps = {
  label: string;
  value: string;
  iconBg: string;
  icon: ReactNode;
};

export default function SequencingSummaryCard({
  label,
  value,
  iconBg,
  icon,
}: SequencingSummaryCardProps) {
  return (
    <div className="h-[114px] px-7 py-6 bg-white rounded-xl border border-grey-20 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex items-center gap-5">
      <div
        className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-grey-70 text-base font-normal leading-normal">
          {label}
        </p>
        <p className="text-grey-90 text-[28px] font-semibold leading-8">
          {value}
        </p>
      </div>
    </div>
  );
}
