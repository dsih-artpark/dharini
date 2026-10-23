import { useState } from "react";
import { motion } from "framer-motion";

type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

export default function Carousel<T>({ items, renderItem }: CarouselProps<T>) {
  const [activeItem, setActiveItem] = useState<number>(1);

  const handlePrev = () => {
    setActiveItem((prev) => (prev === 1 ? items.length : prev - 1));
  };

  const handleNext = () => {
    setActiveItem((prev) => (prev === items.length ? 1 : prev + 1));
  };

  return (
    <div className="self-stretch overflow-hidden">
      {!!items?.length && (
        <motion.div
          className="self-stretch justify-start items-start inline-flex"
          style={{ width: `${items.length * 100}%` }}
          animate={{
            x: `-${(activeItem - 1) * (100 / items.length)}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => (
            <motion.div key={index}>{renderItem(item, index)}</motion.div>
          ))}
        </motion.div>
      )}
      {items?.length > 1 && (
        <div className="self-stretch justify-center items-center gap-10 flex mt-4">
          <button
            className="border border-blue-40 rounded-[999px] justify-center items-center gap-2 flex disabled:opacity-30"
            onClick={handlePrev}
            disabled={activeItem === 1}
          >
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.21932 8.00048L10.5193 11.3005L9.57665 12.2431L5.33398 8.00048L9.57665 3.75781L10.5193 4.70048L7.21932 8.00048Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </button>
          <div className="justify-center items-center gap-1 flex">
            {Array(items.length)
              .fill("")
              .map((_, index) => (
                <button
                  key={index}
                  className={`h-1 rounded-[99px] transition-all ${
                    activeItem === index + 1
                      ? "w-6 bg-blue-40"
                      : "w-1 bg-grey-40"
                  }`}
                  onClick={() => setActiveItem(index + 1)}
                />
              ))}
          </div>
          <button
            className="border border-blue-40 rounded-[999px] justify-center items-center gap-2 flex disabled:opacity-30"
            onClick={handleNext}
            disabled={activeItem === items.length}
          >
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8.78047 8.00048L5.48047 4.70048L6.42314 3.75781L10.6658 8.00048L6.42314 12.2431L5.48047 11.3005L8.78047 8.00048Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
