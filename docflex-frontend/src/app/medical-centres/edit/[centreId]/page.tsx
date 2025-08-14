"use client";

import { Tooltip } from "@/components/ui/tooltip";
import MedicalCentreForm from "@/sections/MedicalCentreSection/MedicalCentreForm";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CentreFormData,
  CentreSchema,
} from "@/schemas/MedicalCentres/CentreSchema";
import {
  getMedicalCentersById,
  updateMedicalCenters,
} from "@/api/medicalCentersApi";
import { toast } from "react-toastify";

function Page() {
  const router = useRouter();
  const params = useParams();

  // Ensure centreId is a string
  const centreId: string | undefined = Array.isArray(params?.centreId)
    ? params.centreId[0]
    : params?.centreId;

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

  const { handleSubmit} = methods;

  // Fetch centre details and populate form
  useEffect(() => {
    const fetchCentre = async () => {
      if (!centreId) return;
      try {
        const data = await getMedicalCentersById(centreId);
        if (!data) {
          toast.error("Centre data not found");
          return;
        }
        methods.reset({
          centreName: data.centerName ?? "",
          regNo: data.regNo ?? "",
          address: data.address ?? "",
          city: data.town ?? "",
          contactNo: data.contactNo ?? "",
          email: data.email ?? "",
          logo: data.logo ?? "",
        });
      } catch (error) {
        console.error("Failed to fetch centre:", error);
        toast.error("Failed to load centre details.");
      }
    };
    fetchCentre();
  }, [centreId, methods]);

  const onSubmit = async (data: CentreFormData) => {
    if (!centreId) return;
    try {
      await updateMedicalCenters(centreId, {
        centerName: data.centreName,
        regNo: data.regNo,
        address: data.address,
        town: data.city ?? "",
        contactNo: data.contactNo ?? "",
        email: data.email ?? "",
        logo: data.logo ?? "",
      });
      toast.success("Medical Center successfully updated!");
      router.push("/medical-centres");
    } catch (error) {
      console.error("Failed to update centre:", error);
      toast.error("Failed to update centre.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.back()}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          Update Centre Details
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
