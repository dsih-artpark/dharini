import { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: ElementType;
  color: string;
}

const colorMap: Record<
  string,
  {
    iconBg: string;
    iconText: string;
  }
> = {
  "bg-blue-400": {
    iconBg: "bg-blue-10 border border-blue-20/50",
    iconText: "text-blue-40",
  },
  "bg-green-400": {
    iconBg: "bg-green-10 border border-green-20/50",
    iconText: "text-green-30",
  },
  "bg-orange-400": {
    iconBg: "bg-orange-10 border border-orange-20/50",
    iconText: "text-orange-30",
  },
  "bg-purple-400": {
    iconBg: "bg-purple-10 border border-purple-20/50",
    iconText: "text-purple-30",
  },
  "bg-sky-400": {
    iconBg: "bg-teal-10 border border-teal-20/50",
    iconText: "text-teal-30",
  },
  "bg-red-400": {
    iconBg: "bg-red-10 border border-red-20/50",
    iconText: "text-red-30",
  },
};

const defaultColor = {
  iconBg: "bg-grey-10 border border-grey-20/50",
  iconText: "text-grey-70",
};

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
}: StatCardProps) {
  const styles = colorMap[color] || defaultColor;

  return (
    <div className="relative p-5 bg-white rounded-xl border border-grey-20 shadow-sm flex justify-between items-center gap-3">
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-grey-60 text-xs font-semibold uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex items-baseline mt-2">
            <span className="text-grey-90 text-3xl font-extrabold tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-grey-50 ml-1">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center shrink-0">
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon className={`w-6 h-6 ${styles.iconText}`} />
        </div>
      </div>
    </div>
  );
}
