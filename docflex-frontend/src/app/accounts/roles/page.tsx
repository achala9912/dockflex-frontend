"use client";

import React, { useState, useEffect } from "react";
import RoundButton from "@/components/Buttons/RoundButton";
import { Tooltip } from "@/components/ui/tooltip";
import { IoMdAdd } from "react-icons/io";
import RoleCard from "@/components/Cards/RoleCard";
import InputField from "@/components/InputField/InputField";
import { FiSearch } from "react-icons/fi";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";
import { getAllRoles } from "@/api/roleApi";
import Pagination from "@/components/Table/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

interface Role {
  _id: string;
  roleId?: string;
  roleName: string;
  permissions?: string[];
  isDeleted?: boolean;
  createdAt?: string;
  modificationHistory?: any[];
}

function Page() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await getAllRoles(page, limit, debouncedSearchTerm);

        if (Array.isArray(response)) {
          setRolesData(response);
          setTotalPages(1);
          setTotalItems(response.length);
        } else {
          setRolesData(response.data || []);
          setTotalPages(response.totalPages || 1);
          setTotalItems(response.total || response.data?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setRolesData([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [page, limit, debouncedSearchTerm]);

  const handleDeleteConfirm = (role: { id: string; name: string }) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    console.log(`Deleting role: ${selectedRole?.name}`);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          User Roles
        </h3>
      </div>

      <div className="flex flex-col">
        {/* Search + Add */}
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <InputField
              id="role-search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchTerm}
              placeholder="Search Role ID / Name"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              label={true}
              labelName="Role ID / Name"
            />
          </div>
          <Tooltip content="Add New Role" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={() => console.log("Add New Role clicked")}
            />
          </Tooltip>
        </div>

        {/* Roles list */}
        <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading roles...</p>
          ) : rolesData && rolesData.length > 0 ? (
            rolesData.map((role) => (
              <RoleCard
                key={role._id}
                topName={role.roleId || ""} 
                middleName={role.roleName}
                handleEdit={() => console.log(`Editing role: ${role._id}`)}
                handleDelete={() =>
                  handleDeleteConfirm({ id: role._id, name: role.roleName })
                }
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No User Roles found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        </div>

        {/* Delete Confirm */}
        <DeleteConfirm
          element={selectedRole?.name || ""}
          onDelete={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
        />
      </div>
    </>
  );
}

export default Page;
