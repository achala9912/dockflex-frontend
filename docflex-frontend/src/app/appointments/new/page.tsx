"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import AppointmentForm from "@/sections/AppointmentSection/AppointmentForm";
import {
  AppointmentFormData,
  AppointmentSchema,
} from "@/schemas/Appointment/AppointmentSchema";
import { createAppointment } from "@/api/appointmentsApi";

function Page() {
  const router = useRouter();

  const methods = useForm<AppointmentFormData>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {},
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      console.log("Form Submitted:", data);
      await createAppointment(data);
      toast.success("Appointment created successfully!");
      reset();
      router.push("/appointments");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to create Appointment");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/appointments")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          New Appointment
        </h3>
      </div>

      <div className="p-4 bg-white rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AppointmentForm />

            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => router.push("/appointments")}
                className="px-6 py-2 text-sm font-semibold text-white transition bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                size="default"
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
