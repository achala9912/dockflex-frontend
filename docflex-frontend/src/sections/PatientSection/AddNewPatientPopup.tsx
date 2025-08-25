"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React from "react";
import PatientForm from "@/sections/PatientSection/PatientForm";
import {
  PatientFormData,
  PatientSchema,
} from "@/schemas/Patient/PatientSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { createPatient } from "@/api/patientsApi";

interface AddNewPatientPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddNewPatientPopup({ isOpen, onClose }: AddNewPatientPopupProps) {
  const methods = useForm<PatientFormData>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      centerId: "",
      title: "",
      patientName: "",
      gender: "",
      dob: "",
      email: "",
      contactNo: "",
      nic: "",
      address: "",
      remark: "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      console.log("Form Submitted:", data);
      await createPatient(data);
      toast.success("Patient created successfully!");
      onClose();
      methods.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to create patient");
    }
  };

  return (
    <Popup
      title="Add New Patient"
      isOpen={isOpen}
      onClose={onClose}
      headerClassName="bg-blue-600"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PatientForm />
          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onClose}
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
    </Popup>
  );
}

export default AddNewPatientPopup;
