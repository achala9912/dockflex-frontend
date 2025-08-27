"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import RoundButton from "@/components/Buttons/RoundButton";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { getActiveSessionPatientVisitedAppointment } from "@/api/appointmentsApi";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import Pagination from "@/components/Table/Pagination";
import PresCard from "@/components/Cards/PresCard";

export default function Page() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [centerId, setCenterId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const itemsPerPage = 10;
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await getActiveSessionPatientVisitedAppointment(
        selectedDate,
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        centerId
      );
      setAppointments(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch appointments");
    }
  }, [selectedDate, currentPage, itemsPerPage, debouncedSearchTerm, centerId]);

  useEffect(() => {
    if (!centerId) return;
    fetchAppointments();
  }, [fetchAppointments, centerId]);

  return (
    <>
      {/* Filters */}
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Generate Prescription
        </h3>
      </div>

      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 items-start">
            <CenterDropdown
              id="centerId"
              value={centerId || ""}
              onChange={setCenterId}
              placeholder="Select Medical Center"
              width="md:w-[300px] w-full"
              label
              labelName="Center Name"
            />
            <DatePicker
              id="date"
              value={selectedDate}
              onDateChange={setSelectedDate}
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
              label
              labelName="Patient Name / Appointment ID"
            />
          </div>

          <Tooltip content="Refresh" side="bottom">
            <RoundButton
              icon={LuRefreshCw}
              className="hover:bg-gray-300 bg-gray-800 text-white hover:text-blue-800"
              onClick={fetchAppointments}
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
        {appointments.map((app) => (
          <PresCard
            key={app.appointmentId}
            appointmentId={app.appointmentId}
            patientName={app.patientId.patientName}
            title={app.patientId.title}
            tokenNo={app.tokenNo}
            age={app.patientId.age}
            gender={app.patientId.gender}
            handleGenerate={() =>
              console.log("Generate prescription for", app.appointmentId)
            }
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={itemsPerPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </>
  );
}
