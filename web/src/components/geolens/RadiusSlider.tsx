import { useEffect, useState } from "react";
import { RangeField } from "./tabs/controls";

interface RadiusSliderProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (val: number) => void;
}

/**
 * Buffer radius slider (5–50 km). The value is applied after the slider has
 * been still for 400 ms, so dragging doesn't refetch on every step.
 */
export function RadiusSlider({
  id = "geolens-radius",
  label = "Radius",
  value,
  onChange,
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

  return (
    <RangeField
      id={id}
      label={label}
      valueLabel={`${val} km`}
      min={5}
      max={50}
      value={val}
      onChange={setVal}
      scale={["5 km", "50 km"]}
    />
  );
}
