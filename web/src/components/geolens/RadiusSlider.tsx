import React, { useState, useEffect } from "react";

interface RadiusSliderProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  width?: string;
  style?: React.CSSProperties;
  dark?: boolean;
}

export function RadiusSlider({
  label,
  value,
  onChange,
  width = "100px",
  style,
  dark = false,
}: RadiusSliderProps) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (val !== value) onChange(val);
    }, 400);
    return () => clearTimeout(handler);
  }, [val, value, onChange]);

  const trackBg = dark
    ? `linear-gradient(90deg, #3498db ${((val - 5) / 45) * 100}%, rgba(255,255,255,0.2) ${((val - 5) / 45) * 100}%)`
    : `linear-gradient(90deg, #3498db ${((val - 5) / 45) * 100}%, #dfe6e9 ${((val - 5) / 45) * 100}%)`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(52,152,219,0.08)",
        borderRadius: "8px",
        padding: "5px 10px",
        border: dark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(52,152,219,0.2)",
        ...style,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: dark ? "rgba(255,255,255,0.85)" : "#2c3e50",
          }}
        >
          {label}
        </label>
      )}
      <input
        type="range"
        min={5}
        max={50}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{
          width,
          height: "6px",
          appearance: "none",
          WebkitAppearance: "none",
          background: trackBg,
          borderRadius: "3px",
          outline: "none",
          cursor: "pointer",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: dark ? "#5dade2" : "#2980b9",
          minWidth: "38px",
          textAlign: "right",
          background: dark ? "rgba(52,152,219,0.2)" : "rgba(52,152,219,0.1)",
          borderRadius: "4px",
          padding: "2px 6px",
        }}
      >
        {val}km
      </span>
    </div>
  );
}
