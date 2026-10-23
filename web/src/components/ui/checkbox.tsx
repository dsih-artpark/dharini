import React, { InputHTMLAttributes } from "react";

type CheckboxType = {
  id?: string;
  label: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({
  id,
  label,
  className,
  ...props
}: CheckboxType) {
  return (
    <div
      className={`grow shrink basis-0 h-10 px-3 py-2 bg-blue-10 rounded justify-start items-center gap-2 inline-flex ${className}`}
    >
      <input
        type="checkbox"
        id={id ?? label}
        className="relative peer shrink-0 appearance-none bg-white border border-grey-60 rounded accent-blue-40 checked:bg-blue-800 checked:border-0 w-4 h-4 cursor-pointer checked"
        {...props}
      />
      <label
        htmlFor={id ?? label}
        className="min-w-1/5 self-stretch text-grey-80 text-base leading-normal cursor-pointer"
      >
        {label}
      </label>
      <svg
        className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
      >
        <path
          d="M10.1992 3L4.69922 8.5L2.19922 6"
          stroke="white"
          strokeWidth="1.6666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
