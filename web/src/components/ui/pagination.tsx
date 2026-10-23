import { ArrowLeft, ArrowRight } from "lucide-react";

interface Pagination {
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
  loading?: boolean;
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current <= 4) {
    pages.push(2, 3, 4, 5, "ellipsis", total);
  } else if (current >= total - 3) {
    pages.push("ellipsis", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(
      "ellipsis",
      current - 1,
      current,
      current + 1,
      "ellipsis",
      total,
    );
  }

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  goToPage,
  loading,
}: Pagination) {
  if (totalPages === undefined || totalPages <= 1) {
    return;
  }

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="self-stretch p-4 bg-grey-10 justify-center items-center flex">
      <div className="h-[29px] justify-start items-center gap-2 flex">
        <button
          disabled={page === 1 || loading}
          className="p-1.5 rounded-lg justify-center items-center inline-flex text-blue-40 disabled:text-grey-50"
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-grey-50 text-sm leading-[21px]"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              disabled={loading}
              aria-current={p === page ? "page" : undefined}
              className={`rounded-lg text-sm leading-[21px] transition-colors disabled:cursor-not-allowed ${
                p === page
                  ? "px-3 py-1 bg-blue-40 text-white font-medium"
                  : "py-1 px-2 text-grey-80 hover:bg-grey-20"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          className="p-1.5 rounded-lg justify-center items-center inline-flex text-blue-40 disabled:text-grey-50"
          disabled={page === totalPages || loading}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
