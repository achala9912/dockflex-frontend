"use client";
import React, { useState } from "react";
import RoundButton from "@/components/Buttons/RoundButton";
import jsonData from "@/data/data.json";
import { Tooltip } from "@/components/ui/tooltip";
import { IoMdAdd } from "react-icons/io";
import RoleCard from "@/components/Cards/RoleCard";
import InputField from "@/components/InputField/InputField";
import { FiSearch } from "react-icons/fi";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";

function Page() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = jsonData.roleData.filter((role) =>
    `${role.id} ${role.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <InputField
              id="role-search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchTerm}
              placeholder="Search Role ID / Name"
              onChange={(e) => setSearchTerm(e.target.value)}
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

        <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <RoleCard
                key={role.id}
                topName={role.id}
                middleName={role.name}
                handleEdit={() => console.log(`Editing role: ${role.name}`)}
                handleDelete={() => handleDeleteConfirm(role)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No User Roles found.</p>
          )}
        </div>

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
