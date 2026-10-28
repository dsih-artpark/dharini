import type React from "react";

/** Small building blocks shared by the GeoLens tab panels. */

export function Step({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-grey-60">
        <span>{title}</span>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
        checked ? "bg-blue-40" : "bg-grey-40"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: React.ReactNode; title?: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-grey-20 bg-grey-10 p-1"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.title}
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`min-h-8 truncate rounded-md px-2 text-[13px] transition-colors ${
              active
                ? "bg-white font-semibold text-blue-40 shadow-sm"
                : "text-grey-60 hover:text-grey-80"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** A row in the Layers tab: icon, name with count, hint, and a control. */
export function LayerRow({
  icon,
  title,
  count,
  hint,
  loading,
  control,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  hint: string;
  loading?: boolean;
  control: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-grey-20 bg-white px-2.5 py-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-grey-10 text-grey-70">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-grey-80">
          {title}
          {count !== undefined && (
            <span className="font-mono text-[11px] font-normal text-grey-60">
              {count.toLocaleString()}
            </span>
          )}
          {loading && (
            <span
              aria-label="Loading"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-grey-30 border-t-blue-40"
            />
          )}
        </span>
        <span className="block text-[11px] text-grey-60">{hint}</span>
      </span>
      {control}
    </div>
  );
}

export function RangeField({
  id,
  label,
  valueLabel,
  min,
  max,
  step = 1,
  value,
  onChange,
  scale,
}: {
  id: string;
  label: React.ReactNode;
  valueLabel: React.ReactNode;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  scale?: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-xs text-grey-60">
        <label htmlFor={id}>{label}</label>
        <strong className="text-base font-semibold tabular-nums text-blue-40">
          {valueLabel}
        </strong>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="geolens-range w-full"
      />
      {scale && (
        <div
          aria-hidden="true"
          className="flex justify-between text-[11px] tabular-nums text-grey-60"
        >
          {scale.map((s, i) => (
            <span key={`${s}-${i}`}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-blue-10 px-2.5 py-2 text-xs text-blue-50">
      {children}
    </div>
  );
}
