"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { SessionFormData } from "@/schemas/Sessions/SessionSchema";
import FormField from "@/components/Fields/FormField";
import Dropdown from "@/components/Dropdown/Dropdown";
import InputField from "@/components/InputField/InputField";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import { TimeOptions } from "@/constants/session.constants";

function SessionForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SessionFormData>();

  return (
    <div className="space-y-6">
      {/* Medical Center & Session Name */}
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

        <FormField label="Session Name" error={errors.sessionName?.message}>
          <Controller
            name="sessionName"
            control={control}
            render={({ field }) => (
              <InputField
                id="sessionName"
                type="text"
                {...field}
                placeholder="Session Name"
              />
            )}
          />
        </FormField>
      </div>

      {/* Start & End Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Start Time" error={errors.startTime?.message}>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="startTime"
                value={field.value}
                onChange={field.onChange}
                options={TimeOptions}
                placeholder="Select Start Time"
              />
            )}
          />
        </FormField>

        <FormField label="End Time" error={errors.endTime?.message}>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="endTime"
                value={field.value}
                onChange={field.onChange}
                options={TimeOptions}
                placeholder="Select End Time"
              />
            )}
          />
        </FormField>
      </div>
    </div>
  );
}

export default SessionForm;
