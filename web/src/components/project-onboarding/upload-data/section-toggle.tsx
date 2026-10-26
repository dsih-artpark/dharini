type SectionOption = {
  id: string;
  label: string;
};

type SectionToggleProps = {
  options: SectionOption[];
  selected: string;
  onSelect: (id: string) => void;
  ariaLabel: string;
};

// Segmented control, same look as the playground "Response Type" toggle.
// Kept local to the upload flow: components/ui/tabs is shared by other
// screens and keeps its underline style.
export default function SectionToggle({
  options,
  selected,
  onSelect,
  ariaLabel,
}: SectionToggleProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-fit rounded-lg border border-grey-20 bg-grey-10 p-1"
    >
      {options.map((option) => {
        const isActive = option.id === selected;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(option.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40 ${
              isActive
                ? "bg-blue-40 text-white shadow-sm"
                : "text-grey-70 hover:text-grey-80"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
