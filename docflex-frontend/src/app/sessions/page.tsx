"use client";

import RoundButton from "@/components/Buttons/RoundButton";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import {
  deleteSession,
  doActiveSession,
  getAllSessions,
} from "@/api/sessionsApi";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import Dropdown from "@/components/Dropdown/Dropdown";
import SessionCard from "@/components/Cards/SessionCard";
import Pagination from "@/components/Table/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import AddNewSessionPopup from "@/sections/SessionSection/AddNewSessionPopup";
import EditSessionPopup from "@/sections/SessionSection/EditSessionPopup";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";
import ConfirmationPopup from "@/components/Popups/ConfirmationPopup";

interface Session {
  id: string;
  sessionId: string;
  name: string;
  centerName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [centerId, setCenterId] = useState<string | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
  const [sessionToToggle, setSessionToToggle] = useState<Session | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setError(null);
      const res = await getAllSessions(
        page,
        limit,
        debouncedSearchTerm,
        centerId,
        isActive
      );

      const transformedSessions =
        res.map((session: any) => ({
          id: session._id,
          sessionId: session.sessionId,
          name: session.sessionName,
          centerName: session.centerId?.centerName || "Unknown Center",
          startTime: session.startTime,
          endTime: session.endTime,
          isActive: session.isSessionActive,
        })) || [];

      setSessions(transformedSessions || []);
      setTotalItems(transformedSessions.length);
      setTotalPages(Math.ceil(transformedSessions.length / limit));
    } catch (err: any) {
      setError(err.message || "Failed to fetch sessions.");
    }
  }, [page, limit, debouncedSearchTerm, centerId, isActive]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleEdit = (session: { sessionId: string }) => {
    setSelectedSessionId(session.sessionId);
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (session: Session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteSession(sessionToDelete.sessionId);
      toast.success(
        `Session "${sessionToDelete.name}" from "${sessionToDelete.centerName}" deleted successfully`
      );
      fetchSessions();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete session");
    } finally {
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleToggleActive = (session: Session) => {
    setSessionToToggle(session);
    setIsToggleConfirmOpen(true);
  };

  const confirmToggleActive = async () => {
    if (!sessionToToggle) return;

    try {
      await doActiveSession(
        sessionToToggle.sessionId,
        !sessionToToggle.isActive
      );
      toast.success(
        `Session "${sessionToToggle.name}" is now ${
          !sessionToToggle.isActive ? "Active" : "Deactivated"
        }`
      );
      fetchSessions();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsToggleConfirmOpen(false);
      setSessionToToggle(null);
    }
  };

  useEffect(() => {
    if (centerId !== undefined) {
      fetchSessions();
    }
  }, [fetchSessions, centerId]);

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Sessions
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <CenterDropdown
              id="centerId"
              value={centerId || ""}
              onChange={(val) => setCenterId(val)}
              placeholder="Select Medical Center"
              width="md:w-[300px] w-full"
              label
              labelName="Center Name"
            />
            <InputField
              id="session-search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchTerm}
              placeholder="Search Session Name"
              onChange={(e) => setSearchTerm(e.target.value)}
              label={true}
              labelName="Session ID / Name"
            />

            <Dropdown
              id="isActive"
              value={isActive?.toString() ?? ""}
              onChange={(val) => {
                if (val === "true") setIsActive(true);
                else if (val === "false") setIsActive(false);
                else setIsActive(undefined);
              }}
              options={[
                { label: "Active", value: "true" },
                { label: "Deactivate", value: "false" },
              ]}
              placeholder="Select Status"
              width="md:w-[250px] w-full"
              label
              labelName="Status"
            />
          </div>

          <Tooltip content="Add New Session" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={() => setIsNewPopupOpen(true)}
            />
          </Tooltip>
        </div>
      </div>

      {error ? (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                sessionId={session.sessionId}
                sessionName={session.name}
                centerName={session.centerName}
                startTime={session.startTime}
                endTime={session.endTime}
                isActive={session.isActive}
                handleEdit={() => handleEdit(session)}
                handleDelete={() => handleDeleteClick(session)}
                handleActive={() => handleToggleActive(session)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No matching sessions found.</p>
          )}
        </div>
      )}

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      </div>

      {isNewPopupOpen && (
        <AddNewSessionPopup
          isOpen={isNewPopupOpen}
          onClose={() => {
            setIsNewPopupOpen(false);
            fetchSessions();
          }}
        />
      )}

      {isEditPopupOpen && selectedSessionId && (
        <EditSessionPopup
          isOpen={isEditPopupOpen}
          onClose={() => {
            setIsEditPopupOpen(false);
            setSelectedSessionId(null);
            fetchSessions();
          }}
          sessionId={selectedSessionId}
        />
      )}

      <DeleteConfirm
        element={
          sessionToDelete
            ? `session "${sessionToDelete.name}" from "${sessionToDelete.centerName}"`
            : ""
        }
        onDelete={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />

      <ConfirmationPopup
        element={
          sessionToToggle
            ? `session "${sessionToToggle.name}" from "${
                sessionToToggle.centerName
              }" to ${sessionToToggle.isActive ? "Deactivate" : "Activate"}`
            : ""
        }
        handleYes={confirmToggleActive}
        handleNo={() => setIsToggleConfirmOpen(false)}
        isOpen={isToggleConfirmOpen}
      />
    </>
  );
}

export default Page;
