"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import RoundButton from "@/components/Buttons/RoundButton";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import Dropdown from "@/components/Dropdown/Dropdown";
import TableWithPagi from "@/components/Table/TableWithPagi";
import { DatePicker } from "@/components/DatePicker/DatePicker";

import { getAllPrescriptions } from "@/api/prescriptionsApi";
import {
  PrescriptionMgmt,
  prescriptionsMgmtColumns,
} from "@/components/Table/Coloumns";
import { useDebounce } from "@/hooks/useDebounce";
import { StatusOptions } from "@/constants/session.constants";

export default function Page() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [prescriptions, setPrescriptions] = useState<PrescriptionMgmt[]>([]);
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
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const itemsPerPage = 10;

  const fetchPrescriptions = useCallback(async () => {
    try {
      // Only send centerId if it exists
      const res = await getAllPrescriptions(
        selectedDate,
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        centerId || undefined, // avoid empty string
        selectedStatus || undefined
      );

      setPrescriptions(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Prescriptions");
    }
  }, [
    selectedDate,
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    centerId,
    selectedStatus,
  ]);

  useEffect(() => {
    if (!centerId) return;
    fetchPrescriptions();
  }, [fetchPrescriptions, centerId]);

  const handleView = (row: PrescriptionMgmt) => {
    router.push(`/prescription/${row.prescriptionNo}`);
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Work List
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4 bg-white p-5 rounded-lg shadow-sm">
          <div className="flex gap-4 items-start">
            <CenterDropdown
              id="centerId"
              value={centerId || ""}
              onChange={setCenterId}
              placeholder="Select Medical Center"
              width="md:w-[250px] w-full"
              label
              labelName="Center Name"
            />

            <DatePicker
              id="date"
              value={selectedDate}
              onDateChange={setSelectedDate}
              label
              labelName="Appointment Date"
              className="md:w-[200px] w-full"
            />

            <InputField
              id="search"
              width="w-full md:w-[320px]"
              icon={<FiSearch />}
              type="text"
              value={searchValue}
              placeholder="Search Patient Name / Prescription No"
              onChange={(e) => setSearchValue(e.target.value)}
              label
              labelName="Patient Name / Prescription No"
            />

            <Dropdown
              id="status"
              value={selectedStatus}
              options={StatusOptions}
              onChange={(value) => setSelectedStatus(value as string)}
              width="md:w-[200px] w-full"
              label
              labelName="Status"
              placeholder="Select Status"
            />
          </div>

          <Tooltip content="Refresh" side="bottom">
            <RoundButton
              icon={LuRefreshCw}
              className="hover:bg-gray-300 bg-gray-800 text-white hover:text-blue-800"
              onClick={fetchPrescriptions}
            />
          </Tooltip>
        </div>
      </div>

      <div>
        <TableWithPagi
          columns={prescriptionsMgmtColumns}
          data={prescriptions}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
          totalItems={totalItems}
          handleEdit={handleView}
        />
      </div>
    </>
  );
}
