"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  CentreFormData,
  CentreSchema,
} from "@/schemas/MedicalCentres/CentreSchema";
import MedicalCentreForm from "@/sections/MedicalCentreSection/MedicalCentreForm";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoChevronBackOutline } from "react-icons/io5";
import { createMedicalCenter } from "@/api/medicalCentersApi";
import { toast } from "react-toastify";

function Page() {
  const router = useRouter();

  const methods = useForm<CentreFormData>({
    resolver: zodResolver(CentreSchema),
    defaultValues: {
      centreName: "",
      regNo: "",
      address: "",
      city: "",
      contactNo: "",
      email: "",
      logo: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: CentreFormData) => {
    try {
      console.log("Form Data Submitted:", data);

      // ✅ API call
      const response = await createMedicalCenter({
        centerName: data.centreName,
        regNo: data.regNo,
        address: data.address,
        town: data.city,
        contactNo: data.contactNo,
        email: data.email,
        logo: data.logo,
      });
      console.log("Medical Center Created:", response);
      toast.success("Medical Center successfully created!");

      reset();
      router.push("/medical-centres");
    } catch (error: unknown) {
      console.error("Failed to create medical center:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create medical center";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/medical-centres")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          New Medical Centre
        </h3>
      </div>

      <div className="p-4 bg-white rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <MedicalCentreForm />

            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <Button
                variant="outline"
                size="default"
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
