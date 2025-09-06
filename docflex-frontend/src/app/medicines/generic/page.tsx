"use client";

import RoundButton from "@/components/Buttons/RoundButton";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import Pagination from "@/components/Table/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";
import GenericCard from "@/components/Cards/GenericCard";
import { getAllGenericNames, deleteGenericName } from "@/api/genericNameApi";
import AddNewGenericPopup from "@/sections/GenericSection/AddNewGenericPopup";
import EditGenericPopup from "@/sections/GenericSection/EditGenericPopup";

interface IGenericName {
  genericId: string;
  genericName: string;
  centerName: string;
  centerId: {
    centerId: string;
    centerName: string;
  };
}

function Page() {
  const [genericNames, setGenericNames] = useState<IGenericName[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [centerId, setCenterId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(8);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewPopupOpen, setIsNewPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedGenericId, setSelectedGenericId] = useState<string | null>(
    null
  );
  const [genericNameToDelete, setGenericNameToDelete] =
    useState<IGenericName | null>(null);


  const fetchGenericNames = useCallback(async () => {
    if (!centerId) return;

    try {
      setError(null);
      const res = await getAllGenericNames({
        centerId,
        page,
        limit,
        search: debouncedSearchTerm.trim() || undefined,
      });
      setGenericNames(res.data || []);
      setTotalItems(res.total || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch generic names");
      setGenericNames([]);
    }
  }, [centerId, page, limit, debouncedSearchTerm]);


  useEffect(() => {
    fetchGenericNames();
  }, [fetchGenericNames]);

  const handleEdit = (generic: { genericId: string }) => {
    setSelectedGenericId(generic.genericId);
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (generic: IGenericName) => {
    setGenericNameToDelete(generic);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!genericNameToDelete) return;

    try {
      await deleteGenericName(genericNameToDelete.genericId);
      toast.success(
        `Generic "${genericNameToDelete.genericName}" from "${genericNameToDelete.centerName}" deleted successfully`
      );

      if (genericNames.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchGenericNames();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete generic");
    } finally {
      setIsDeleteModalOpen(false);
      setGenericNameToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Generic Names
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <CenterDropdown
              id="centerId"
              value={centerId || ""}
              onChange={(val) => {
                setCenterId(val);
                setPage(1);
              }}
              placeholder="Select Medical Center"
              width="md:w-[300px] w-full"
              label
              labelName="Center Name"
            />
            <InputField
              id="generic-search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchTerm}
              placeholder="Search Generic ID / Name"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              label
              labelName="Generic ID / Name"
            />
          </div>

          <Tooltip content="Add New Generic Name" side="top">
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
          {genericNames.length > 0 ? (
            genericNames.map((generic) => (
              <GenericCard
                key={generic.genericId}
                genericId={generic.genericId}
                genericName={generic.genericName}
                centerName={generic.centerId.centerName}
                handleEdit={() => handleEdit(generic)}
                handleDelete={() => handleDeleteClick(generic)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No matching generic found.</p>
          )}
        </div>
      )}

      {genericNames.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        </div>
      )}

      {isNewPopupOpen && (
        <AddNewGenericPopup
          isOpen={isNewPopupOpen}
          onClose={() => {
            setIsNewPopupOpen(false);
            fetchGenericNames(); 
          }}
        />
      )}
      {isEditPopupOpen && selectedGenericId && (
        <EditGenericPopup
          isOpen={isEditPopupOpen}
          onClose={() => {
            setIsEditPopupOpen(false);
            setSelectedGenericId(null);
            fetchGenericNames();
          }}
          genericId={selectedGenericId}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirm
          element={
            genericNameToDelete ? `"${genericNameToDelete.genericName}"` : ""
          }
          onDelete={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
        />
      )}
    </>
  );
}

export default Page;
