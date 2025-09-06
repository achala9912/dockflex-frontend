"use client";

import React, { useState, useEffect, useCallback } from "react";
import { IoMdAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import RoundButton from "@/components/Buttons/RoundButton";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import TableWithPagi from "@/components/Table/TableWithPagi";
import { toast } from "react-toastify";
import {
  AppointmentMgmt,
  appointmentMgmtColumns,
} from "@/components/Table/Coloumns";
import { useDebounce } from "@/hooks/useDebounce";
import {
  cancelAppointment,
  getAllAppointments,
  accpetPatientVisiting,
} from "@/api/appointmentsApi";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import ConfirmationPopup from "@/components/Popups/ConfirmationPopup";

export default function Page() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appointment, setAppointment] = useState<AppointmentMgmt[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [centerId, setCenterId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState<boolean>(false);
  const [isVisitPopupOpen, setIsVisitPopupOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const itemsPerPage = 10;

  const fetchAppointments = useCallback(async () => {
    if (!centerId) return;
    try {
      const res = await getAllAppointments(
        selectedDate,
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        centerId
      );
      setAppointment(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch appointments");
    }
  }, [selectedDate, currentPage, itemsPerPage, debouncedSearchTerm, centerId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addNewPatient = () => {
    router.push(`/appointments/new`);
  };

  // Open cancellation confirmation popup
  const confirmCancel = (row: AppointmentMgmt) => {
    setSelectedAppointmentId(row.appointmentId);
    setIsCancelPopupOpen(true);
  };


  const confirmPatientVisited = (row: AppointmentMgmt) => {
    setSelectedAppointmentId(row.appointmentId);
    setIsVisitPopupOpen(true);
  };


  const handleCancelYes = async () => {
    if (!selectedAppointmentId) return;
    try {
      await cancelAppointment(selectedAppointmentId);
      toast.success("Appointment canceled successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsCancelPopupOpen(false);
      setSelectedAppointmentId(null);
      fetchAppointments();
    }
  };

  const handleVisitYes = async () => {
    if (!selectedAppointmentId) return;
    try {
      await accpetPatientVisiting(selectedAppointmentId);
      toast.success("Patient visit recorded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to record patient visit");
    } finally {
      setIsVisitPopupOpen(false);
      setSelectedAppointmentId(null);
      fetchAppointments();
    }
  };


  const handleCancelNo = () => {
    setIsCancelPopupOpen(false);
    setSelectedAppointmentId(null);
  };


  const handleVisitNo = () => {
    setIsVisitPopupOpen(false);
    setSelectedAppointmentId(null);
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Appointments
        </h3>
      </div>

      <div className="flex flex-col ">
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 items-start">
            <CenterDropdown
              id="centerId"
              value={centerId || ""}
              onChange={(val) => setCenterId(val)}
              placeholder="Select Medical Center"
              width="md:w-[300px] w-full"
              label
              labelName="Center Name"
            />
            <DatePicker
              id="date"
              value={selectedDate}
              onDateChange={(date) => setSelectedDate(date)}
              label
              labelName="Appointment Date"
            />

            <InputField
              id="search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchValue}
              placeholder="Search Patient Name / Appointment ID"
              onChange={(e) => setSearchValue(e.target.value)}
              label={true}
              labelName="Patient Name / Appointment ID"
            />
          </div>
          <Tooltip content="Add New Patient" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={addNewPatient}
            />
          </Tooltip>
        </div>
      </div>

      <div>
        {!centerId ? (
          <p className="text-gray-500 text-sm mt-2">
            Please select a center to view appointments.
          </p>
        ) : (
          <TableWithPagi
            columns={appointmentMgmtColumns}
            data={appointment || []}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            currentPage={currentPage}
            setPage={setCurrentPage}
            totalItems={totalItems}
            handleDelete={confirmCancel}
            handleEdit={confirmPatientVisited}
          />
        )}
      </div>

      {/* Cancellation Popup */}
      <ConfirmationPopup
        isOpen={isCancelPopupOpen}
        handleYes={handleCancelYes}
        handleNo={handleCancelNo}
        element="cancel this appointment"
      />

      {/* Visit Confirmation Popup */}
      <ConfirmationPopup
        isOpen={isVisitPopupOpen}
        handleYes={handleVisitYes}
        handleNo={handleVisitNo}
        element="confirm the patient visited?"
        yesButtonColor="green"
      />
    </>
  );
}
