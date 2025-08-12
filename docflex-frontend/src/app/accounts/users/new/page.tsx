"use client";

import { Tooltip } from "@/components/ui/tooltip";
import UserForm from "@/sections/AccountSection/UserForm";
import router from "next/router";
import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";

function page() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/accounts/users")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">New User</h3>
      </div>
      <div>
        <UserForm />
      </div>
    </>
  );
}

export default page;
