"use client";

import React, { useState, useEffect } from "react";
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
import { getAllAppointments } from "@/api/appointmentsApi";
import { DatePicker } from "@/components/DatePicker/DatePicker";

export default function Page() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appointment, setAppointment] = useState<AppointmentMgmt[]>([]); // Fixed naming
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [centerId, setCenterId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>(""); // Added state for date
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAllAppointments(
          selectedDate, 
          currentPage, 
          itemsPerPage, 
          debouncedSearchTerm, 
          centerId 
        );

        console.log("Fetched appointments response:", res);
        setAppointment(res.data || []); 
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, [debouncedSearchTerm, centerId, currentPage, selectedDate]);

  const addNewPatient = () => {
    router.push(`/appointments/new`);
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
            <DatePicker
              id="date"
              value={selectedDate}
              onDateChange={(date) => setSelectedDate(date)} // Fixed missing handler
            />

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
        <TableWithPagi
          columns={appointmentMgmtColumns}
          data={appointment || []}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
          totalItems={totalItems}
        />
      </div>
    </>
  );
}
