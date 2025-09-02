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
import DeleteConfirm from "@/components/Popups/DeleteConfirm";
import { toast } from "react-toastify";
import { patientMgmtColumns, PatientMgmt } from "@/components/Table/Coloumns";
import { getAllPatients, deletePatient } from "@/api/patientsApi";
import { useDebounce } from "@/hooks/useDebounce";

export default function Page() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patients, setPatients] = useState<PatientMgmt[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [centerId, setCenterId] = useState<string | undefined>();
  const [patientToDelete, setPatientToDelete] = useState<PatientMgmt | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getAllPatients(
          currentPage,
          itemsPerPage,
          debouncedSearchTerm,
          centerId
        );
        console.log("Fetched patients response:", res);
        setPatients(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.total || 0); 
      } catch {
        toast.error("Failed to fetch patients");
      }
    };

    fetchPatients();
  }, [debouncedSearchTerm, centerId, currentPage]);

  const addNewPatient = () => {
    router.push(`/patients/new`);
  };

  // Navigate to edit patient page
  const handleEdit = (patient: PatientMgmt) => {
    router.push(`/patients/edit/${patient.patientId}`);
  };

  const handleDeleteConfirm = (patient: PatientMgmt) => {
    const originalPatient = patients.find((p) => p._id === patient._id);
    if (originalPatient) {
      setPatientToDelete(originalPatient);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient(patientToDelete.patientId);
      setPatients((prev) => prev.filter((p) => p._id !== patientToDelete._id));
      setIsDeleteModalOpen(false);
      toast.success("Patient deleted successfully");
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Registered Patients
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

            <InputField
              id="patientSearch"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchValue}
              placeholder="Search Patient Name / Contact No / NIC/ Email"
              onChange={(e) => setSearchValue(e.target.value)}
              label={true}
              labelName="Patient Name / Contact No / NIC/ Email"
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
          columns={patientMgmtColumns}
          data={patients || []}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
          totalItems={totalItems}
          handleEdit={handleEdit}
          handleDelete={handleDeleteConfirm}
        />
      </div>

      <DeleteConfirm
        element={patientToDelete?.patientName || ""}
        onDelete={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
    </>
  );
}
