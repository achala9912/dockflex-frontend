"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import RoleForm, { RoleFormValues } from "@/sections/AccountSection/RoleForm";
import { getRoleDataById, updateRole } from "@/api/roleApi";

function Page() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState<string | null>(null);


  const roleId: string = Array.isArray(params?.roleId)
    ? params.roleId[0]
    : params?.roleId || "";

  const methods = useForm<RoleFormValues>({
    defaultValues: {
      roleName: "",
      permissions: [],
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    console.log("RoleId used in fetch:", roleId);
    if (!roleId) {
      setError("Invalid role ID");
      return;
    }

    const fetchRoleData = async () => {
      try {
        const roleData = await getRoleDataById(roleId);

        reset({
          roleName: roleData.roleName,
          permissions: roleData.permissions,
        });
      } catch (err) {
        console.error("Error fetching role:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load role data"
        );
        toast.error("Role not found or failed to load");
      }
    };

    fetchRoleData();
  }, [roleId, reset]);

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

      await updateRole(roleId, payload);
      toast.success("Role successfully updated!");
      router.push("/accounts/roles");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-lg text-red-500">{error}</div>
        <Button
          onClick={() => router.push("/accounts/roles")}
          className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            onClick={() => router.push("/accounts/roles")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          Update Role
        </h3>
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
                className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="default"
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500"
              >
                Update
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}

export default Page;
