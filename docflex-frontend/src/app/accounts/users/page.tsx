"use client";

import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import RoundButton from "@/components/Buttons/RoundButton";
import Dropdown from "@/components/Dropdown/Dropdown";
import { UserMgmt, userMgmtColumns } from "@/components/Table/Coloumns";
import TableWithPagi from "@/components/Table/TableWithPagi";
import { Tooltip } from "@/components/ui/tooltip";
import { getAllUsers, User } from "@/api/usersApi";
import InputField from "@/components/InputField/InputField";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getRoleSuggestions, Role } from "@/api/roleApi";

export default function Page() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userData, setUserData] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const itemsPerPage = 10;

  const router = useRouter();
  // Fetch role suggestions
  useEffect(() => {
    const fetchRoleSuggestions = async () => {
      try {
        const roles = await getRoleSuggestions();
        console.log("role sugge", roles);
        const options = roles.map((role: Role) => ({
          label: role.roleName,
          value: role.roleId,
        }));
        setRoleOptions(options);
      } catch (error) {
        console.error("Failed to fetch role suggestions:", error);
        setRoleOptions([]);
      }
    };

    fetchRoleSuggestions();
  }, []);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const params: Record<string, any> = {
          page: currentPage,
          limit: itemsPerPage,
        };
        if (selectedRole) params.roleId = selectedRole;
        if (searchValue) params.name = searchValue;

        const response: any = await getAllUsers(params);
        setUserData(Array.isArray(response) ? response : []);
        setTotalPages(1);
        setTotalItems(Array.isArray(response) ? response.length : 0);
      } catch (err: unknown) {
        console.error(err);
        setUserData([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    }
    fetchUsers();
  }, [selectedRole, searchValue, currentPage]);

  const userMgmtData: UserMgmt[] = userData.map((u) => ({
    _id: u._id,
    userId: u.userId ?? "",
    title: u.title ?? "",
    name: u.name ?? "",
    userName: u.userName ?? "",
    slmcNo: u.slmcNo ?? "",
    specialization: u.specialization ?? "",
    contactNo: u.contactNo ?? "",
    createdAt: u.createdAt ?? "",
    gender: u.gender ?? "",
    role: {
      _id: u.role?._id ?? "",
      roleName: u.role?.roleName ?? "",
      roleId: u.role?.roleId ?? "",
    },
    email: u.email ?? "",
    remark: u.remarks ?? "",
    centerId: {
      centerName: u.centerId?.centerName ?? "",
    },
  }));
  const addNewUser = () => {
    router.push(`/accounts/users/new`);
  };

  const handleEdit = (user: { userId: string }) => {
    router.push(`/accounts/users/edit/${user.userId}`);
  };
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
              options={roleOptions}
              onChange={(value) => setSelectedRole(value as string)}
              label
              labelName="Role ID / Name"
              width="md:w-[300px] w-full"
            />

            <InputField
              id="userId"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchValue}
              placeholder="Search User ID / Name"
              onChange={(e) => setSearchValue(e.target.value)}
              label={true}
              labelName="User Name"
            />
          </div>
          <Tooltip content="Add New User" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={addNewUser}
            />
          </Tooltip>
        </div>
      </div>

      <div>
        <TableWithPagi
          columns={userMgmtColumns}
          data={userMgmtData}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
          totalItems={totalItems}
          handleEdit={handleEdit}
        />
      </div>
    </>
  );
}
