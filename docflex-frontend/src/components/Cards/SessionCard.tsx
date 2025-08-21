"use client";

import {
  Pencil,
  Trash2,
  CheckCircle,
  CircleOff,
  Activity,
} from "lucide-react";
import React from "react";
import { Tooltip } from "../ui/tooltip";

interface SessionCardProps {
  sessionId: string;
  sessionName: string;
  centerName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  handleActive: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  sessionId,
  sessionName,
  centerName,
  startTime,
  endTime,
  isActive,
  handleEdit,
  handleDelete,
  handleActive,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-72 relative flex flex-col items-center">
      <div className="p-2 w-full">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-xs mt-2 text-left pl-2 font-semibold">
            {sessionId}
          </p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold min-w-[60px] text-center ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mt-2 flex justify-center">
          <Activity  strokeWidth={1} size={56} className="text-gray-600" />
        </div>
        <h2 className="text-blue-600 text-md font-semibold mt-2 text-center font-inter">
          {sessionName}
        </h2>
        <p className="text-gray-600 text-sm text-center font-medium">
          {centerName}
        </p>
        <div className="mt-2 flex flex-col items-center">
          <p className="text-gray-600 text-xs text-center">
            {new Date(startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="bg-gray-600 w-full h-12 mt-2 rounded-b-2xl flex justify-center items-center gap-4 py-2">
        <Tooltip
          content={isActive ? "Deactivate Session" : "Activate Session"}
          side="bottom"
        >
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
            onClick={handleActive}
          >
            {isActive ? (
              <CircleOff size={18} className="text-orange-600" />
            ) : (
              <CheckCircle size={18} className="text-green-500" />
            )}
          </button>
        </Tooltip>

        <Tooltip content="Edit Session" side="bottom">
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
            onClick={handleEdit}
          >
            <Pencil size={18} className="text-blue-500" />
          </button>
        </Tooltip>

        <Tooltip content="Delete Session" side="bottom">
          <button
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
            onClick={handleDelete}
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SessionCard;
