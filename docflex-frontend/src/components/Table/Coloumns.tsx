"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import React from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoMdCloseCircleOutline } from "react-icons/io";

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

export interface AppointmentMgmt {
  _id: string;
  date: string;
  appointmentId: string;
  tokenNo: number;
  status: string;
  sessionId: {
    sessionId: string;
    sessionName: string;
  };
  centerId: {
    centerId: string;
    centerName: string;
  };
  patientId: {
    patientId: string;
    patientName: string;
    age: number;
    contactNo: string;
    address: string;
    nic?: string;
    email: string;
    gender: string;
    remark?: string;
  };
  isPatientvisited: boolean;
}

export const appointmentMgmtColumns: Column<AppointmentMgmt>[] = [
  {
    header: "Date",
    accessor: "date",
    headerClassName: "min-w-[160px]",
    render: (value: string) => new Date(value).toISOString().split("T")[0],
  },
  {
    header: "Center Name",
    accessor: "centerId.centerName",
    headerClassName: "min-w-[200px]",
  },
  {
    header: "Session Name",
    accessor: "sessionId.sessionName",
    headerClassName: "min-w-[160px]",
  },
  {
    header: "Appointment ID",
    accessor: "appointmentId",
    headerClassName: "min-w-[200px]",
  },
  {
    header: "Token No",
    accessor: "tokenNo",
    headerClassName: "min-w-[100px]",
    className: "text-center flex justify-center",
    render: (value: number | undefined) => {
      if (value === undefined || value === null) return "-";

      return (
        <div className="w-8 h-8 bg-blue-400 text-white font-semibold rounded-full flex items-center justify-center mx-auto">
          {value}
        </div>
      );
    },
  },

  {
    header: "Patient Name",
    accessor: "patientId.patientName",
    headerClassName: "min-w-[200px]",
  },
  {
    header: "Gender",
    accessor: "patientId.gender",
    headerClassName: "min-w-[100px]",
  },
  {
    header: "Age",
    accessor: "patientId.age",
    headerClassName: "min-w-[100px] text-center justify-center flex",
    className: "text-center",
  },
  {
    header: "Email",
    accessor: "patientId.email",
    headerClassName: "min-w-[200px]",
  },
  {
    header: "Contact No",
    accessor: "patientId.contactNo",
    headerClassName: "min-w-[150px]",
  },
  {
    header: "NIC",
    accessor: "patientId.nic",
    headerClassName: "min-w-[150px]",
    render: (value: string | undefined) => value || "-",
  },
  {
    header: "Address",
    accessor: "patientId.address",
    headerClassName: "min-w-[190px]",
    render: (value: string | undefined) => value || "-",
  },
  {
    header: "Status",
    accessor: "status",
    headerClassName: "min-w-[150px] text-center flex justify-center",
    className: "text-center",
    render: (value: string | undefined) => {
      if (!value) return "-";

      let bgClass = "";
      let textClass = "";

      switch (value.toLowerCase()) {
        case "scheduled":
          bgClass = "bg-orange-100";
          textClass = "text-orange-700";
          break;
        case "cancelled":
          bgClass = "bg-red-100";
          textClass = "text-red-500";
          break;
        default:
          bgClass = "bg-green-100";
          textClass = "text-green-700";
      }

      return (
        <span
          className={`px-3 py-1 capitalize text-sm font-medium rounded-full min-w-[100px] inline-block text-center ${bgClass} ${textClass}`}
        >
          {value}
        </span>
      );
    },
  },

  {
    header: "Is Patient Visited?",
    accessor: "isPatientvisited",
    headerClassName: "min-w-[150px]",
    className: "text-center",
    render: (value: boolean | undefined) => {
      if (value === undefined || value === null) return "-";

      const text = value ? "Yes" : "No";

      const bgClass = value ? "bg-green-100" : "bg-red-100";
      const textClass = value ? "text-green-700" : "text-red-500";

      return (
        <span
          className={`px-3 py-1 capitalize text-sm font-medium rounded-full min-w-[80px] inline-block text-center ${bgClass} ${textClass}`}
        >
          {text}
        </span>
      );
    },
  },

  {
    header: "Action",
    accessor: "action",
    headerClassName: "text-center",
    render: (_value, row, handlers) => {

      const showAcceptButton = !row.isPatientvisited;

      const showCancelButton = row.status?.toLowerCase() !== "cancelled";

 
      if (!showAcceptButton && !showCancelButton) {
        return <div className="h-6"></div>;
      }

      return (
        <div className="flex space-x-3 justify-center">
          {showAcceptButton && (
            <GiConfirmed
              className="text-[#40e10f] hover:text-green-700 cursor-pointer"
              onClick={() => handlers?.edit?.(row)}
              aria-label="Accept Appointment"
              size={20}
            />
          )}
          {showCancelButton && (
            <IoMdCloseCircleOutline
              className="text-[#EB1313]/70 hover:text-red-700 cursor-pointer"
              onClick={() => handlers?.delete?.(row)}
              aria-label="Cancel Appointment"
              size={22}
            />
          )}
        </div>
      );
    },
  },
];
