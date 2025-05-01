"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
export type Column<T> = {
  header: string;
  headerClassName?: string;
  className?: string;
  accessor: keyof T;
  render?: (
    value: T[keyof T] | undefined,
    row: T,
    handlers?: Record<string, (row: T) => void>
  ) => React.ReactNode;
  Cell?: (props: { value: T[keyof T] }) => React.ReactNode;
};

type Role = {
  roleName: string;
  roleId: string;
};

export interface UserMgmt {
  userId: string;
  title?: string;
  name: string;
  userName: string;
  slmcNo: string;
  specialization: string;
  contactNo: string;
  createdAt: string;
  gender: string;
  role: Role;
  email: string;
}

export const userMgmtColumns: Column<UserMgmt>[] = [
  { header: "User ID", accessor: "userId" },
  { header: "Name", accessor: "name" },
  { header: "User Name", accessor: "userName" },
  { header: "Gender", accessor: "gender" },
  {
    header: "Role",
    accessor: "role",
  },
  {
    header: "SLMC No",
    accessor: "slmcNo",
  },
  {
    header: "Specialization",
    accessor: "specialization",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Contact No",
    accessor: "contactNo",
  },
  {
    header: "Action",
    accessor: "action" as keyof UserMgmt,
    render: (_value, row, handlers) => (
      <div className="flex space-x-4">
        <FaEdit
          className="text-[#23A3DA] hover:text-blue-700 cursor-pointer"
          onClick={() => handlers?.edit(row)}
          aria-label="Edit User"
        />
        <FaTrash
          className="text-[#EB1313]/70 hover:text-red-700 cursor-pointer"
          onClick={() => handlers?.delete(row)}
          aria-label="Delete User"
        />
      </div>
    ),
  },
];
