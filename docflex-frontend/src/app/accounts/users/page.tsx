"use client";

import RoundButton from "@/components/Buttons/RoundButton";
import Dropdown from "@/components/Dropdown/Dropdown";
import SearchBar from "@/components/Searchbar/Searchbar";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

export default function Page() {
  const [selectedMedicalCentre, setSelectedMedicalCentre] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Registered Users
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <Dropdown
              id="medical-centre"
              value={selectedMedicalCentre}
              options={[]}
              onChange={(value) => setSelectedMedicalCentre(value as string)}
              width="md:w-56 w-full"
            />
            <Dropdown
              id="select-role"
              value={selectedRole}
              options={[]}
              onChange={(value) => setSelectedRole(value as string)}
              label
              labelName="Role ID / Name"
              width="md:w-56 w-full"
            />
            <SearchBar
              id="userId"
              value={searchValue}
              placeholder="Search User ID / Name"
              onChange={(e) => setSearchValue(e.target.value)}
              onSuggestionSelect={(suggestion) => setSearchValue(suggestion)}
              suggestions={[]}
              label
              labelName="User ID / Name"
              width="md:W-72 w-full"
            />
          </div>
          <Tooltip content="Add New User" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={() => console.log("Add New User clicked")}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
}
