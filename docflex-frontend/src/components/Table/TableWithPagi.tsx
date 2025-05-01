"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";
import { cn } from "@/lib/utils";
import Pagination from "./Pagination";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (
    value: T[keyof T],
    row: T,
    handlers?: Record<string, (row: T) => void>
  ) => React.ReactNode;
  headerClassName?: string;
  className?: string;
};

interface TableWithPagiProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
  itemsPerPage: number;
  pagination?: boolean;
  handleEdit?: (row: T) => void;
  handleDelete?: (row: T) => void;
  handleInfo?: (row: T) => void;
  handleView?: (row: T) => void;
  handlePrint?: (row: T) => void;
  handleAccept?: (row: T) => void;
  getRowId?: (row: T) => string | number;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  totalItems: number;
  pagiLabel?: string;
}

function TableWithPagi<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
  itemsPerPage,
  pagination = true,
  className,
  handleEdit,
  handleDelete,
  handleInfo,
  handleView,
  handlePrint,
  handleAccept,
  totalPages,
  currentPage,
  setPage,
  totalItems,
  pagiLabel,
  ...props
}: TableWithPagiProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? " 🔼" : " 🔽";
  };

  return (
    <div className="w-full">
      <div className="border border-[#D9E0FF] rounded-lg">
        <Table className={cn("text-sm", className)} {...props}>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader className="bg-[#E9ECFA]">
            <TableRow>
              {columns.map((column, idx) => (
                <TableHead
                  key={idx}
                  onClick={() => requestSort(column.accessor)}
                  className={cn("cursor-pointer select-none", column.headerClassName)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="flex items-center">
                    {column.header}
                    {getSortIndicator(column.accessor)}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {sortedData.length > 0 ? (
              sortedData.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((column, cidx) => (
                    <TableCell key={cidx} className={column.className}>
                      {column.render
                        ? column.render(row[column.accessor], row, {
                            edit: handleEdit ?? (() => {}),
                            delete: handleDelete ?? (() => {}),
                            info: handleInfo ?? (() => {}),
                            view: handleView ?? (() => {}),
                            print: handlePrint ?? (() => {}),
                            accept: handleAccept ?? (() => {}),
                          })
                        : String(row[column.accessor] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          limit={itemsPerPage}
          pagiLabel={pagiLabel}
        />
      )}
    </div>
  );
}

export default TableWithPagi;
