"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getPrescriptionDataById } from "@/api/prescriptionsApi";
import AdviceRemarks from "@/sections/PrescriptionSection/AdviceRemarks";
import Medications from "@/sections/PrescriptionSection/Medications ";
import ClinicalDetails from "@/sections/PrescriptionSection/ClinicalDetails";
import VitalSigns from "@/sections/PrescriptionSection/VitalSigns";
import VisitInfo from "@/sections/PrescriptionSection/VisitInfo";
import PrescriberInfo from "@/sections/PrescriptionSection/PrescriberInfo";
import PatientInfo from "@/sections/PrescriptionSection/PatientInfo";
import HeaderSection from "@/sections/PrescriptionSection/HeaderSection";

const Page = () => {
  const params = useParams();
  const [prescriptionData, setPrescriptionData] = useState<any>(null);

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
    return (
      <p className="mt-4 text-lg text-gray-600">
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <HeaderSection
          centerData={prescriptionData.centerId}
          prescriptionNo={prescriptionData.prescriptionNo}
          createdAt={prescriptionData.createdAt}
          prescriptionType={prescriptionData.prescriptionType}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Patient & Prescriber Info */}
          <div className="lg:col-span-1 space-y-6">
            <PatientInfo patientData={prescriptionData.patientId} />
            <PrescriberInfo
              prescriberData={prescriptionData.prescriberDetails}
            />
          </div>

          {/* Right Column - Medical Information */}
          <div className="lg:col-span-2 space-y-6">
            <VisitInfo
              reasonForVisit={prescriptionData.reasonForVisit}
              appointmentId={prescriptionData.appointmentId.appointmentId}
              symptoms={prescriptionData.symptoms}
            />

            {prescriptionData.vitalSigns &&
              prescriptionData.vitalSigns.length > 0 && (
                <VitalSigns vitalSigns={prescriptionData.vitalSigns[0]} />
              )}

            <ClinicalDetails
              clinicalDetails={prescriptionData.clinicalDetails}
            />
            <Medications medications={prescriptionData.medications} />
            <AdviceRemarks
              advice={prescriptionData.advice}
              remark={prescriptionData.remark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
