"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { GenericFormData } from "@/schemas/Generic/GenericSchema";
import FormField from "@/components/Fields/FormField";
import InputField from "@/components/InputField/InputField";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";

function GenericForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<GenericFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Medical Center" error={errors.centerId?.message}>
          <Controller
            name="centerId"
            control={control}
            render={({ field }) => (
              <CenterDropdown
                id="centerId"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Select Medical Center"
              />
            )}
          />
        </FormField>

        <FormField label="Generic Name" error={errors.genericName?.message}>
          <Controller
            name="genericName"
            control={control}
            render={({ field }) => (
              <InputField
                id="genericName"
                uppercase
                type="text"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                placeholder="Generic Name"
              />
            )}
          />
        </FormField>
      </div>
    </div>
  );
}

export default GenericForm;
