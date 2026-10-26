type Variant = "primary" | "ghost";
type Size = "md" | "lg" | "xl";

const BASE =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold leading-none transition duration-150 [&:not(:disabled)]:hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-landing-purple disabled:cursor-default disabled:opacity-70";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-landing-purple text-white shadow-[0_10px_24px_-8px_#6c47ff8c] hover:bg-landing-purple-600",
  ghost:
    "border border-landing-border bg-white font-medium text-landing-ink hover:border-[#c9c3e6]",
};

const SIZES: Record<Size, string> = {
  md: "h-[42px] px-[22px] text-[14.5px]",
  lg: "h-11 px-6 text-[15px]",
  xl: "h-[46px] px-6 text-[15px]",
};

// Shared by <button>, <a> and <Link> so every call-to-action looks the same.
export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full justify-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
