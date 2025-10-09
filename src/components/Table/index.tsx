import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { JSX } from "react";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  getClickedRow?: (element: T) => void;
};

export const Table = <T,>({
  data,
  columns,
  isLoading,
  getClickedRow,
}: Props<T>): JSX.Element => {
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border outline-1 outline-gray-300 border-gray-200 sm:border-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full sm:w-full rounded-lg table-fixed">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="h-[40px] sm:h-[48px]"
                  key={`table-headerGroup-${headerGroup.id}`}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      className="bg-gray-100 text-gray-500 p-2 sm:p-3 pl-3 sm:pl-6 pr-2 text-left text-xs sm:text-sm whitespace-nowrap"
                      key={`table-header-${header.id}`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="min-h-[440px] sm:min-h-[520px]">
              {/* Skeleton Loader */}
              {isLoading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    className="hover:bg-neutral-100 cursor-pointer h-[44px] sm:h-[52px]"
                    key={`table-row-skeleton-${index}`}
                  >
                    {Array.from({ length: columns.length }).map(
                      (_, cellIndex) => (
                        <td
                          className="p-2 sm:p-3 pl-3 sm:pl-6 pr-2 text-left text-xs sm:text-sm"
                          key={`table-cell-skeleton-${cellIndex}`}
                        >
                          <div className="h-4 sm:h-5 w-full bg-gray-200 rounded-sm animate-pulse" />
                        </td>
                      )
                    )}
                  </tr>
                ))}

              {/* No data */}
              {!isLoading && !data.length && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center text-gray-500 text-sm sm:text-lg py-6 sm:py-8"
                  >
                    No data yet
                  </td>
                </tr>
              )}

              {/* Data */}
              {!isLoading &&
                !!data.length &&
                table.getRowModel().rows.map((row) => (
                  <tr
                    onClick={() => getClickedRow?.(row.original)}
                    className="hover:bg-neutral-100 cursor-pointer h-[44px] sm:h-[52px]"
                    key={`table-row-${row.id}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="p-2 sm:p-3 pl-3 sm:pl-6 pr-2 text-left text-xs sm:text-sm truncate"
                        key={`table-cell-${cell.id}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Empty rows */}
              {!isLoading &&
                Array.from({
                  length:
                    (!data.length ? 8 : 10) - table.getRowModel().rows.length,
                }).map((_, index) => (
                  <tr
                    className="h-[44px] sm:h-[52px]"
                    key={`table-row-empty-${index}`}
                  >
                    {Array.from({ length: columns.length }).map(
                      (_, cellIndex) => (
                        <td
                          className="p-2 sm:p-3 pl-3 sm:pl-6 pr-2 text-left text-xs sm:text-sm"
                          key={`table-cell-empty-${cellIndex}`}
                        >
                          <div className="h-4 sm:h-5 w-full rounded-sm" />
                        </td>
                      )
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3 sm:gap-2 mt-4 px-4 sm:px-0">
        <p className="text-gray-500 text-sm sm:text-base order-1 sm:order-1">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </p>
        <div className="flex gap-2 w-full sm:w-auto order-2 sm:order-2">
          <button
            onClick={() => {
              if (!table.getCanPreviousPage()) return;

              table.previousPage();
            }}
            className={`${
              table.getCanPreviousPage()
                ? "bg-violet-500 hover:bg-violet-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } text-white px-3 sm:px-4 py-2 rounded-md transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none`}
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (!table.getCanNextPage()) return;

              table.nextPage();
            }}
            className={`${
              table.getCanNextPage()
                ? "bg-violet-500 hover:bg-violet-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } text-white px-3 sm:px-4 py-2 rounded-md transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
