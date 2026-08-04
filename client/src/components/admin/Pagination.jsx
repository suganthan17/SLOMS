import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  rangeStart,
  rangeEnd,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    0,
    4
  );

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-500">
        Showing {rangeStart} to {rangeEnd} of {totalCount} entries
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition ${
              p === page
                ? "bg-[#007EA7] text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>

        <div className="relative ml-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-1.5 pr-7 text-xs text-gray-600 outline-none"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

export default Pagination;