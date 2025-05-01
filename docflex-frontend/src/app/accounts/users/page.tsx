"use client";

import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import RoundButton from "@/components/Buttons/RoundButton";
import Dropdown from "@/components/Dropdown/Dropdown";
import SearchBar from "@/components/Searchbar/Searchbar";
import { userMgmtColumns } from "@/components/Table/Coloumns";
import TableWithPagi from "@/components/Table/TableWithPagi";
import { Tooltip } from "@/components/ui/tooltip";
import jsonData from "@/data/data.json";

export default function Page() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;
  const dummyData = jsonData.userData;

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Registered Users
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 items-start">
            <Dropdown
              id="select-role"
              value={selectedRole}
              options={[
                { label: "Admin", value: "admin" },
                { label: "Doctor", value: "doctor" },
              ]}
              onChange={(value) => setSelectedRole(value as string)}
              label
              labelName="Role ID / Name"
              width="md:w-[300px] w-full"
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
              width="md:w-72 w-full"
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

      <div>
        <TableWithPagi
          columns={userMgmtColumns}
          data={dummyData}
          itemsPerPage={itemsPerPage}
          totalPages={1}
          currentPage={currentPage}
          setPage={setCurrentPage}
          totalItems={dummyData.length}
        />
      </div>
    </>
  );
}
