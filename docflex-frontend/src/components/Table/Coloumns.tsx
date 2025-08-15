"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | string; // support nested accessors
  render?: (
    value: any,
    row: T,
    handlers?: Record<string, (row: T) => void>
  ) => React.ReactNode;
  headerClassName?: string;
  className?: string;
};

export interface UserMgmt {
  _id: string;
  userId: string;
  title?: string;
  name: string;
  userName: string;
  slmcNo: string;
  specialization: string;
  contactNo: string;
  createdAt: string;
  gender: string;
  role: {
    _id: string;
    roleName: string;
    roleId: string;
  };
  email: string;
  remark?: string;
  centerId: {
    centerName: string;
  };
}

export const userMgmtColumns: Column<UserMgmt>[] = [
  { header: "User ID", accessor: "userId" },
  { header: "Center Name", accessor: "centerId.centerName" },
  { header: "Name", accessor: "name" },
  { header: "User Name", accessor: "userName" },
  { header: "Gender", accessor: "gender" },
  { header: "Role", accessor: "role.roleName" },
  { header: "SLMC No", accessor: "slmcNo" },
  { header: "Specialization", accessor: "specialization" },
  { header: "Email", accessor: "email" },
  { header: "Contact No", accessor: "contactNo" },
  {
    header: "Action",
    accessor: "action", // placeholder
    render: (_value, row, handlers) => (
      <div className="flex space-x-4">
        <FaEdit
          className="text-[#23A3DA] hover:text-blue-700 cursor-pointer"
          onClick={() => handlers?.edit?.(row)}
          aria-label="Edit User"
        />
        <FaTrash
          className="text-[#EB1313]/70 hover:text-red-700 cursor-pointer"
          onClick={() => handlers?.delete?.(row)}
          aria-label="Delete User"
        />
      </div>
    ),
  },
];