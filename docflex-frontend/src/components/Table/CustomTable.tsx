"use client";

import React from "react";

export type Column<T> = {
  header: string;
  accessor: string; // allow dot-paths like "patientId.email"
  render?: (
    value: any,
    row: T,
    handlers?: Record<string, (row: T) => void>
  ) => React.ReactNode;
  headerClassName?: string;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  handlers?: Record<string, (row: T) => void>;
  className?: string;
};

// helper to resolve nested values like "patientId.email"
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function CustomTable<T>({
  columns,
  data,
  handlers,
  className,
}: TableProps<T>) {
  return (
    <div
      className={`overflow-x-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-200 ${className}`}
    >
      <table className="min-w-full">
        <thead>
          <tr className="text-sm leading-normal text-gray-600 bg-gray-200">
            {columns.map((column) => (
              <th
                key={column.header}
                className={`px-2 py-2 text-left ${column.headerClassName ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => {
                const value = getNestedValue(row, column.accessor);
                return (
                  <td
                    key={`${rowIndex}-${column.accessor}`}
                    className={`px-1 pt-2 text-left whitespace-nowrap ${column.className ?? ""}`}
                  >
                    {column.render
                      ? column.render(value, row, handlers)
                      : value ?? "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
