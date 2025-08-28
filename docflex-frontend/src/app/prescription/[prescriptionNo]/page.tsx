"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  getPrescriptionDataById,
  sendPrescriptionsByEmail,
} from "@/api/prescriptionsApi";
import AdviceRemarks from "@/sections/PrescriptionSection/AdviceRemarks";
import ClinicalDetails from "@/sections/PrescriptionSection/ClinicalDetails";
import VitalSigns from "@/sections/PrescriptionSection/VitalSigns";
import VisitInfo from "@/sections/PrescriptionSection/VisitInfo";
import PrescriberInfo from "@/sections/PrescriptionSection/PrescriberInfo";
import PatientInfo from "@/sections/PrescriptionSection/PatientInfo";
import HeaderSection from "@/sections/PrescriptionSection/HeaderSection";
import { Tooltip } from "@/components/ui/tooltip";
import { IoChevronBackOutline } from "react-icons/io5";
import PrescriptionPopup from "@/sections/PrescriptionSection/PrescriptionPopup";
import Medications from "@/sections/PrescriptionSection/Medications ";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const prescriptionNo: string | undefined = Array.isArray(params?.prescriptionNo)
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

  const handleSendMail = async () => {
    if (!prescriptionData?.prescriptionNo) return;

    try {
      await sendPrescriptionsByEmail(prescriptionData.prescriptionNo);
      toast.success("Prescription sent via email successfully!");
    } catch (error) {
      console.error("Failed to send prescription email:", error);
      toast.error("Failed to send prescription email.");
    }
  };

  // ✅ Open popup for print
  const handlePrint = () => {
    setIsPopupOpen(true);
  };

  if (!prescriptionData) {
    return <p className="mt-4 text-lg text-gray-600">Loading prescription...</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/prescription/worklist")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          Prescription Info
        </h3>
      </div>

      <div className="max-w-6xl mx-auto">
        <HeaderSection
          prescriptionNo={prescriptionData.prescriptionNo}
          createdAt={prescriptionData.createdAt}
          prescriptionType={prescriptionData.prescriptionType}
          onSendMail={handleSendMail}
          onPrint={handlePrint}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <PatientInfo patientData={prescriptionData.patientId} />
            <PrescriberInfo prescriberData={prescriptionData.prescriberDetails} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <VisitInfo
              reasonForVisit={prescriptionData.reasonForVisit}
              appointmentId={prescriptionData.appointmentId.appointmentId}
              symptoms={prescriptionData.symptoms}
            />

            {prescriptionData.vitalSigns?.length > 0 && (
              <VitalSigns vitalSigns={prescriptionData.vitalSigns[0]} />
            )}

            <ClinicalDetails clinicalDetails={prescriptionData.clinicalDetails} />
            <Medications medications={prescriptionData.medications} />
            <AdviceRemarks advice={prescriptionData.advice} remark={prescriptionData.remark} />
          </div>
        </div>
      </div>

      {/* ✅ Print Popup */}
      {isPopupOpen && (
        <PrescriptionPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          prescriptionData={prescriptionData}
        />
      )}
    </div>
  );
};

export default Page;
