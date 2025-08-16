"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "@/components/Fields/FormField";
import InputField from "@/components/InputField/InputField";
import { getPermissionConstants, PermissionConstants } from "@/api/roleApi";
import { FiCheck } from "react-icons/fi";

interface RoleFormValues {
  roleName: string;
  permissions: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  user: "User Permissions",
  role: "Role Permissions",
  center: "Center Permissions",
  patient: "Patient Permissions",
  session: "Session Permissions",
  genericname: "Genericname Permissions",
  appointment: "Appointment Permissions",
};

function prettifyCategory(category: string): string {
  return (
    CATEGORY_LABELS[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

function RoleForm() {
  const { control, handleSubmit, setValue, watch } = useForm<RoleFormValues>({
    defaultValues: {
      roleName: "",
      permissions: [],
    },
  });

  const [permissionConstants, setPermissionConstants] =
    useState<PermissionConstants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedPermissions = watch("permissions");

  useEffect(() => {
    async function fetchPermissions() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPermissionConstants();
        console.log("Permissions fetched:", data); 
        setPermissionConstants(data);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load permissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  const handlePermissionChange = (value: string) => {
    const current = selectedPermissions || [];
    setValue(
      "permissions",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const onSubmit = (data: RoleFormValues) => {
    console.log("Form Data:", data);
    // Add your form submission logic here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <div className="col-span-2">
        <FormField label="Role Name">
          <Controller
            name="roleName"
            control={control}
            rules={{ required: "Role name is required" }}
            render={({ field }) => (
              <InputField
                id="roleName"
                type="text"
                {...field}
                placeholder="Enter role name"
              />
            )}
          />
        </FormField>
      </div>

      <div className="col-span-2">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading permissions...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
        ) : permissionConstants ? (
          <div className="space-y-6">
            {Object.entries(permissionConstants).map(([category, perms]) => (
              <div key={category} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">
                  {prettifyCategory(category)}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {perms.map((perm) => (
                    <div
                      key={perm.value}
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                        selectedPermissions?.includes(perm.value)
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handlePermissionChange(perm.value)}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded border mr-3 ${
                          selectedPermissions?.includes(perm.value)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPermissions?.includes(perm.value) && (
                          <FiCheck size={14} />
                        )}
                      </div>
                      <span className="text-sm">{perm.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="col-span-2 flex justify-end mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Role
        </button>
      </div>
    </form>
  );
}

export default RoleForm;
