"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | string;
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
  { header: "User ID", accessor: "userId", headerClassName: "min-w-[100px]" },
  {
    header: "Center Name",
    accessor: "centerId.centerName",
    headerClassName: "min-w-[200px]",
  },
  {
    header: "Name",
    accessor: "name",
    headerClassName: "min-w-[200px]",
    render: (value: string | null | undefined, row: any) =>
      row.title && value ? `${row.title} ${value}` : value || "-",
  },
  {
    header: "User Name",
    accessor: "userName",
    headerClassName: "min-w-[150px]",
  },
  { header: "Gender", accessor: "gender", headerClassName: "min-w-[100px]" },
  {
    header: "Role",
    accessor: "role.roleName",
    headerClassName: "min-w-[150px]",
  },
  { header: "SLMC No", accessor: "slmcNo", headerClassName: "min-w-[150px]" },
  {
    header: "Specialization",
    accessor: "specialization",
    headerClassName: "min-w-[200px]",
  },
  { header: "Email", accessor: "email", headerClassName: "min-w-[200px]" },
  {
    header: "Contact No",
    accessor: "contactNo",
    headerClassName: "min-w-[150px]",
  },
  {
    header: "Action",
    accessor: "action",
    render: (_value, row, handlers) => (
      <div className="flex space-x-4 justify-center">
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

export interface PatientMgmt {
  _id: string;
  patientId: string;
  dob: string;
  patientName: string;
  gender: string;
  age: number;
  email: string;
  contactNo: string;
  nic: string;
  address: string;
  remark?: string;
  centerId: {
    centerName: string;
  };
}

export const patientMgmtColumns: Column<PatientMgmt>[] = [
  {
    header: "Patient ID",
    accessor: "patientId",
    headerClassName: "min-w-[160px]",
  },
  {
    header: "Center Name",
    accessor: "centerId.centerName",
    headerClassName: "min-w-[200px]",
  },
  {
    header: "Patient Name",
    accessor: "patientName",
    headerClassName: "min-w-[200px]",
    render: (value: string | null | undefined, row: any) =>
      row.title && value ? `${row.title}. ${value}` : value || "-",
  },

  { header: "Gender", accessor: "gender", headerClassName: "min-w-[100px]" },
  {
    header: "DOB",
    accessor: "dob",
    headerClassName: "min-w-[120px]",
    render: (value: string) => new Date(value).toISOString().split("T")[0],
  },
  {
    header: "Age",
    accessor: "age",
    headerClassName: "min-w-[100px] text-center justify-center flex",
    className: "text-center",
  },
  { header: "Email", accessor: "email", headerClassName: "min-w-[200px]" },
  {
    header: "Contact No",
    accessor: "contactNo",
    headerClassName: "min-w-[150px]",
  },
  { header: "NIC", accessor: "nic", headerClassName: "min-w-[150px]" },
  {
    header: "Address",
    accessor: "address",
    headerClassName: "min-w-[190px]",
    render: (value: string | null | undefined) => (value ? value : "-"),
  },
  {
    header: "Remark",
    accessor: "remark",
    headerClassName: "min-w-[150px]",
    render: (value: string | null | undefined) => (value ? value : "-"),
  },

  {
    header: "Action",
    accessor: "action",
    render: (_value, row, handlers) => (
      <div className="flex space-x-4 justify-center">
        <FaEdit
          className="text-[#23A3DA] hover:text-blue-700 cursor-pointer"
          onClick={() => handlers?.edit?.(row)}
          aria-label="Edit Patient"
        />
        <FaTrash
          className="text-[#EB1313]/70 hover:text-red-700 cursor-pointer"
          onClick={() => handlers?.delete?.(row)}
          aria-label="Delete Patient"
        />
      </div>
    ),
  },
];
