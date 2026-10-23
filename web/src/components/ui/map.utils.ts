export const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

export const isValidCoordinate = (
  loc?: [number, number]
): loc is [number, number] => {
  return (
    Array.isArray(loc) &&
    loc.length === 2 &&
    typeof loc[0] === "number" &&
    typeof loc[1] === "number" &&
    !isNaN(loc[0]) &&
    !isNaN(loc[1]) &&
    isFinite(loc[0]) &&
    isFinite(loc[1]) &&
    loc[0] >= -90 &&
    loc[0] <= 90 &&
    loc[1] >= -180 &&
    loc[1] <= 180
  );
};
