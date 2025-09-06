"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBackOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import PatientForm from "@/sections/PatientSection/PatientForm";
import {
  PatientFormData,
  PatientSchema,
} from "@/schemas/Patient/PatientSchema";
import { getPatientById, updatePatient } from "@/api/patientsApi";

function Page() {
  const router = useRouter();
  const params = useParams();

  const patientId: string | undefined = Array.isArray(params?.patientId)
    ? params.patientId[0]
    : params?.patientId;

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

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        const data = await getPatientById(patientId);
        if (!data) {
          toast.error("Patient data not found");
          return;
        }

        const mappedData: PatientFormData = {
          ...data,
          centerId: data.centerId?._id || "",
        };

        console.log("Patient get by id (mapped):", mappedData);
        reset(mappedData);
      } catch (error) {
        console.error("Failed to fetch patient:", error);
        toast.error("Failed to load patient details.");
      }
    };
    fetchPatient();
  }, [patientId, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      console.log("Form Submitted:", data);
      if (!patientId) throw new Error("Invalid patient ID");
      await updatePatient(patientId, data);
      toast.success("Patient updated successfully!");
      router.push("/patients");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update patient");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/patients")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          Update Patient
        </h3>
      </div>

      <div className="p-4 bg-white rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PatientForm />

            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <Button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-semibold text-white transition bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
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
