import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { ChevronDown, X, Search } from "lucide-react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  children?: React.ReactNode;
  name: string;
  options: Option[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  isClearable?: boolean;
  isMulti?: boolean;
  noResultsText?: string;
  variant?: "light" | "dark";
  disabled?: boolean;
}

export default function Select(props: SelectProps) {
  const {
    name,
    options,
    defaultValue,
    placeholder = "Select an option",
    onChange,
    children,
    className,
    isClearable = true,
    isMulti = false,
    noResultsText = "No results",
    variant = "light",
    disabled = false,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Helper to normalize selected value to array of Options
  const getSelectedOptions = (
    val: string | number | (string | number)[] | undefined,
  ): Option[] => {
    if (val === undefined || val === null || val === "") return [];
    const values = Array.isArray(val) ? val : [val];
    return options?.filter((opt) => values.includes(opt.value)) || [];
  };

  const [selected, setSelected] = useState<Option[]>(
    getSelectedOptions(defaultValue),
  );

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setSelected(getSelectedOptions(defaultValue));
    }
  }, [defaultValue, options]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  // Filter options based on search input (by label)
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = options?.filter((option) => {
    const label = String(option.label).toLowerCase();
    const value = String(option.value).toLowerCase();
    return label.includes(normalizedSearch) || value.includes(normalizedSearch);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection and trigger onChange event
  const handleSelection = (option: Option | null) => {
    let newSelected: Option[] = [];

    if (isMulti) {
      if (option === null) {
        newSelected = [];
      } else {
        const isSelected = selected.some((s) => s.value === option.value);
        if (isSelected) {
          newSelected = selected.filter((s) => s.value !== option.value);
        } else {
          newSelected = [...selected, option];
        }
      }
    } else {
      newSelected = option ? [option] : [];
      setIsOpen(false);
    }

    setSelected(newSelected);
    if (!isMulti) {
      setSearch(""); // Reset search on selection for single select
    }

    if (onChange) {
      const value = isMulti
        ? newSelected.map((s) => s.value)
        : (newSelected[0]?.value ?? "");

      const fakeEvent = {
        target: {
          name,
          value: value,
          label: isMulti ? "" : (newSelected[0]?.label ?? ""),
          // Adding custom property for multi-select awareness if needed,
          // but standard value implies strict typing in parent
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;

      onChange(fakeEvent);
    }
  };

  const clearSelection = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    handleSelection(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && filteredOptions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prevIndex) => {
          if (prevIndex === null || prevIndex >= filteredOptions.length - 1) {
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prevIndex) => {
          if (prevIndex === null || prevIndex <= 0) {
            return filteredOptions.length - 1;
          } else {
            return prevIndex - 1;
          }
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (highlightedIndex !== null) {
          handleSelection(filteredOptions[highlightedIndex]);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
    setHighlightedIndex(null);
  }, [isOpen]);

  const scrollToHighlighted = useCallback(() => {
    if (
      highlightedIndex !== null &&
      optionsListRef.current &&
      filteredOptions.length > 0
    ) {
      const highlightedElement =
        optionsListRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex, filteredOptions.length]);

  useEffect(scrollToHighlighted, [scrollToHighlighted]);

  const renderTriggerLabel = () => {
    if (selected.length === 0) {
      return (
        <p
          className={`${variant === "dark" ? "text-white/60" : "text-grey-70"} text-sm leading-[21px] whitespace-nowrap truncate`}
        >
          {placeholder}
        </p>
      );
    }

    if (isMulti) {
      return (
        <p className="text-grey-80 text-sm leading-[21px] whitespace-nowrap truncate">
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
        </p>
      );
    }

    return (
      <p
        className={`${variant === "dark" ? "text-white" : "text-grey-80"} text-sm leading-[21px] whitespace-nowrap truncate`}
      >
        {selected[0].label}
      </p>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className={
        `relative min-w-40 h-10 px-3 py-2 rounded-lg border justify-start items-center gap-1 inline-flex transition-all 
        ${
          disabled
            ? "bg-grey-10 border-grey-20 text-grey-45 cursor-not-allowed pointer-events-none opacity-80"
            : variant === "dark"
              ? "bg-[#34495e] border-white/10 text-white hover:border-white/20 focus-within:ring-white/10"
              : "bg-white border-grey-40 text-grey-80 hover:border-blue-40 focus-within:ring-blue-40/10"
        } ` + className
      }
    >
      {children}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full self-stretch cursor-pointer flex justify-between items-center gap-4 outline-none"
      >
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          {renderTriggerLabel()}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isClearable && selected.length > 0 && (
            <button
              type="button"
              className="group/clear p-0.5 rounded-md hover:bg-red-50 transition-colors"
              onClick={clearSelection}
            >
              <X
                size={14}
                className="text-grey-40 group-hover/clear:text-red-500 transition-colors"
              />
            </button>
          )}
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            className={`${variant === "dark" ? "text-white/70" : "text-blue-40"} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute left-0 top-full min-w-full mt-1 border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${variant === "dark" ? "bg-[#2c3e50] border-white/10" : "bg-white border-grey-40"}`}
        >
          {options?.length > 5 && (
            <div
              className={`relative ${variant === "dark" ? "border-b border-white/10" : "border-b border-grey-20"}`}
            >
              <Search
                size={14}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${variant === "dark" ? "text-white/40" : "text-grey-40"}`}
              />
              <input
                type="text"
                placeholder="Search..."
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className={`w-full pl-9 pr-3 py-2.5 text-sm focus:outline-none placeholder:text-grey-40 ${variant === "dark" ? "bg-[#1a252f] text-white" : "bg-slate-50/50 text-grey-80"}`}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[180px] overflow-y-auto" ref={optionsListRef}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = selected.some(
                  (s) => s.value === option.value,
                );
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelection(option)}
                    className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 
                      ${
                        variant === "dark"
                          ? `text-white/80 hover:bg-white/10 ${isSelected && !isMulti ? "bg-white/20 font-semibold" : ""} ${index === highlightedIndex ? "bg-white/10" : ""}`
                          : `text-grey-80 hover:bg-blue-10 ${isSelected && !isMulti ? "bg-blue-20 font-semibold" : ""} ${index === highlightedIndex ? "bg-blue-10" : ""}`
                      } capitalize`}
                  >
                    {isMulti && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="pointer-events-none"
                      />
                    )}
                    {option.label}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-grey-80 text-sm">
                {noResultsText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
