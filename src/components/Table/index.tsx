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
  onRowClick?: (element: T) => void;
};

export const Table = <T,>({
  data,
  columns,
  isLoading,
  onRowClick,
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
    <>
      <table className="w-full outline-1 outline-gray-300 rounded-lg table-fixed">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={`table-headerGroup-${headerGroup.id}`}>
              {headerGroup.headers.map((header) => (
                <th
                  className="bg-gray-100 text-gray-500 p-3 pl-6 pr-2 text-left"
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

        <tbody>
          {/* Skeleton Loader */}
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <tr
                className="hover:bg-neutral-100 cursor-pointer"
                key={`table-row-skeleton-${index}`}
              >
                {Array.from({ length: columns.length }).map((_, index) => (
                  <td
                    className="p-3 pl-6 pr-2 text-left"
                    key={`table-cell-skeleton-${index}`}
                  >
                    <div className="h-6 w-full bg-gray-200 rounded-sm animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}

          {/* No data */}
          {!isLoading && !data.length && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-gray-500 text-lg py-8"
              >
                No data yet
              </td>
            </tr>
          )}

          {/* Data */}
          {!!data.length &&
            table.getRowModel().rows.map((row) => (
              <tr
                onClick={() => onRowClick?.(row.original)}
                className="hover:bg-neutral-100 cursor-pointer"
                key={`table-row-${row.id}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="p-3 pl-6 pr-2 text-left"
                    key={`table-cell-${cell.id}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

          {/* Empty rows */}
          {!!data.length &&
            Array.from({ length: 10 - table.getRowModel().rows.length }).map(
              (_, index) => (
                <tr key={`table-row-empty-${index}`}>
                  {Array.from({ length: columns.length }).map((_, index) => (
                    <td
                      className="p-3 pl-6 pr-2 text-left"
                      key={`table-cell-empty-${index}`}
                    >
                      <div className="h-6 w-full rounded-sm" />
                    </td>
                  ))}
                </tr>
              )
            )}
        </tbody>
      </table>

      <div className="flex justify-end items-center gap-2 mt-4">
        <p className="text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </p>
        <button
          onClick={() => {
            if (!table.getCanPreviousPage()) return;

            table.previousPage();
          }}
          className={`${
            table.getCanPreviousPage()
              ? "bg-violet-500 hover:bg-violet-600 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          } text-white px-4 py-2 rounded-md transition-all duration-300 `}
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
          } text-white px-4 py-2 rounded-md transition-all duration-300 `}
        >
          Next
        </button>
      </div>
    </>
  );
};
