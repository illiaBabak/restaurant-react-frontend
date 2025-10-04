import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { JSX } from "react";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export const Table = <T,>({ data, columns }: Props<T>): JSX.Element => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full outline-1 outline-gray-300 rounded-lg">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={`table-headerGroup-${headerGroup.id}`}>
            {headerGroup.headers.map((header) => (
              <th
                className="bg-gray-100 text-gray-500 p-4 pl-6 pr-2 text-left"
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
        {table.getRowModel().rows.map((row) => (
          <tr className="hover:bg-neutral-100" key={`table-row-${row.id}`}>
            {row.getVisibleCells().map((cell) => (
              <td
                className="p-4 pl-6 pr-2 text-left"
                key={`table-cell-${cell.id}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
