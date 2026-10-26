import { useState, useEffect } from "react";
import Spinner from "./spinner";

interface HorizontalBarGraphProps {
  height: number;
  labels: string[];
  colors: string[];
  data: number[];
  isLoading?: boolean;
}

export default function HorizontalBarGraph({
  height,
  labels,
  colors,
  data,
  isLoading,
}: HorizontalBarGraphProps) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(data.reduce((a, b) => a + b, 0));
  }, [data]);

  return (
    <div className="self-stretch flex-col justify-start items-start gap-6 flex">
      <div
        className={`h-[${height}px] self-stretch rounded justify-start items-center inline-flex bg-grey-40 ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        {isLoading ? (
          <div className="w-full justify-center items-center inline-flex">
            <Spinner />
          </div>
        ) : (
          data.map((d, i) => (
            <div
              key={i}
              className={`${
                total > 0 ? "min-w-1" : ""
              } flex items-center justify-center h-[${height}px] ${colors[i]}`}
              style={{
                width: `${(d / total) * 100}%`,
              }}
            >
              {d > 0 && (
                <p className="text-white text-sm leading-normal text-center">
                  {Number((d / total) * 100).toFixed(0)}%
                </p>
              )}
            </div>
          ))
        )}
      </div>
      <div className="self-stretch justify-start items-start inline-flex">
        {labels.map((label, i) => (
          <div
            key={i}
            className="w-1/4 h-full flex-col justify-between items-start gap-2 inline-flex relative"
          >
            <div className="flex flex-col gap-2">
              <div
                className={`w-5 h-5 ${colors[i]} rounded-full border border-grey-20`}
              />
              <p className="self-stretch text-grey-70 text-base leading-normal">
                {label}
              </p>
            </div>
            <p className="self-stretch text-grey-80 text-[32px] leading-[48px] font-semibold">
              {data[i]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
