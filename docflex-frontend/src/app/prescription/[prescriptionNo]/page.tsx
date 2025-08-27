"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getPrescriptionDataById } from "@/api/prescriptionsApi";

const Page = () => {

  const params = useParams();

  const [prescriptionData, setPrescriptionData] = useState<any>(null);

  // Ensure prescriptionNo is a string
  const prescriptionNo: string | undefined = Array.isArray(
    params?.prescriptionNo
  )
    ? params.prescriptionNo[0]
    : params?.prescriptionNo;

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!prescriptionNo) return;

      try {
        const data = await getPrescriptionDataById(prescriptionNo);
        if (!data) {
          toast.error("Prescription data not found");
          return;
        }

        setPrescriptionData(data);
      } catch (error) {
        console.error("Failed to fetch prescription:", error);
        toast.error("Failed to load prescription details.");
      }
    };

    fetchPrescriptionData();
  }, [prescriptionNo]);

  if (!prescriptionData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Prescription Details</h1>
      <pre>{JSON.stringify(prescriptionData, null, 2)}</pre>
    </div>
  );
};

export default Page;
