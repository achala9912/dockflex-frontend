"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import RoleForm, { RoleFormValues } from "@/sections/AccountSection/RoleForm";
import { createRole } from "@/api/roleApi";

function Page() {
  const router = useRouter();

  const methods = useForm<RoleFormValues>({
    defaultValues: {
      roleName: "",
      permissions: [],
    },
  });

  const { handleSubmit, reset } = methods;

  function capitalize(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  const onSubmit = async (data: RoleFormValues) => {
    try {
      const payload = {
        ...data,
        roleName: capitalize(data.roleName),
      };
      const response = await createRole(payload);
      console.log("Role Created:", response);
      toast.success("Role successfully created!");
      reset();
      router.push("/accounts/roles");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create role";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/accounts/roles")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">New Role</h3>
      </div>

      <div className="p-4 bg-white rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RoleForm />

            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <Button
                variant="outline"
                size="default"
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-semibold text-white transition bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="default"
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
              >
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}

export default Page;
