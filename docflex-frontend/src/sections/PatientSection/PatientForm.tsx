"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { differenceInYears, parseISO } from "date-fns";
import { PatientFormData } from "@/schemas/Patient/PatientSchema";
import FormField from "@/components/Fields/FormField";
import Dropdown from "@/components/Dropdown/Dropdown";
import InputField from "@/components/InputField/InputField";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import { DatePicker } from "@/components/DatePicker/DatePicker";

const titleOptions = [
  "Dr.",
  "Mr.",
  "Ms.",
  "Mast",
  "Mrs",
  "Baby",
  "Miss",
  "Rev",
  "Prof",
].map((val) => ({
  label: val,
  value: val,
}));

const genderOptions = ["Male", "Female", "Other"].map((val) => ({
  label: val,
  value: val,
}));

function PatientForm() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  const dob = watch("dob");
  let age = 0;
  if (dob) {
    try {
      age = differenceInYears(new Date(), parseISO(dob));
    } catch {
      age = 0;
    }
  }

  const showNIC = age >= 18;

  return (
    <div className="space-y-6">
      {/* Medical Center & Name */}
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

        <FormField
          label="Name"
          error={errors.patientName?.message || errors.title?.message}
        >
          <div className="flex gap-2 w-full">
            <div className="min-w-32">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="title"
                    value={field.value}
                    onChange={field.onChange}
                    options={titleOptions}
                    placeholder="Title"
                  />
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Controller
                name="patientName"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="patientName"
                    type="text"
                    {...field}
                    placeholder="Full name"
                    capitalize
                    onChange={(e) => {
                      const value = e.target.value;
                      const capitalized = value
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      field.onChange(capitalized);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </FormField>
      </div>

      {/* DOB & Gender */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Date of Birth" error={errors.dob?.message}>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="dob"
                value={field.value || ""}
                dateFormat="yyyy-MM-dd"
                onDateChange={(date) => field.onChange(date)}
                className="w-full"
                placeholder="Select Date of Birth"
              />
            )}
          />
        </FormField>

        <FormField label="Gender" error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="gender"
                value={field.value}
                onChange={field.onChange}
                options={genderOptions}
                placeholder="Select gender..."
              />
            )}
          />
        </FormField>
      </div>

      {/* Contact No & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Contact No" error={errors.contactNo?.message}>
          <Controller
            name="contactNo"
            control={control}
            render={({ field }) => (
              <InputField
                id="contactNo"
                type="text"
                {...field}
                placeholder="Phone number"
              />
            )}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputField
                id="email"
                type="email"
                {...field}
                placeholder="Email address"
                onChange={(e) => field.onChange(e.target.value.toLowerCase())}
              />
            )}
          />
        </FormField>
      </div>

      {/* Address & NIC (conditionally) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Address"
          error={errors.address?.message}
          className={showNIC ? "" : "sm:col-span-2"}
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <InputField
                id="address"
                type="text"
                {...field}
                placeholder="Enter address"
                onChange={(e) => {
                  const value = e.target.value;
                  const capitalized = value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  field.onChange(capitalized);
                }}
              />
            )}
          />
        </FormField>

        {showNIC && (
          <FormField label="NIC" error={errors.nic?.message}>
            <Controller
              name="nic"
              control={control}
              render={({ field }) => (
                <InputField
                  id="nic"
                  type="text"
                  {...field}
                  placeholder="Enter NIC number"
                />
              )}
            />
          </FormField>
        )}
      </div>

      {/* Remarks */}
      <FormField label="Remarks (Optional)" error={errors.remark?.message}>
        <Controller
          name="remark"
          control={control}
          render={({ field }) => (
            <InputField
              id="remarks"
              type="text"
              {...field}
              placeholder="Enter remarks"
            />
          )}
        />
      </FormField>
    </div>
  );
}

export default PatientForm;
