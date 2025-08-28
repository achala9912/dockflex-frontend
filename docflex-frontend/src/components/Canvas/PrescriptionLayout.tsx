import React from "react";

// Interface definitions
interface PatientDetails {
  title: string;
  patientName: string;
  age: string;
  contactNo: string;
  email: string;
  [key: string]: any;
}

interface VitalSigns {
  weight: string;
  height: string;
  bmi: string;
  pulseRate: string;
  [key: string]: any;
}

interface Medication {
  productName: string;
  genericName: string;
  dose: string;
  frequency: string;
  duration: string;
  note?: string;
  [key: string]: any;
}

interface PrescriberDetails {
  name: string;
  specialization: string;
  slmcNo: string;
  [key: string]: any;
}

interface MedicalCenter {
  centerName: string; // ✅ renamed for consistency
  address: string;
  town?: string;
  email: string;
  contactNo: string; // ✅ renamed for consistency
  [key: string]: any;
}

interface PrescriptionData {
  prescriptionNo: string;
  createdAt: string | Date;
  patientId: PatientDetails;
  vitalSigns?: VitalSigns; // ✅ single record instead of array
  reasonForVisit: string;
  clinicalDetails: string;
  advice: string;
  medications: Medication[];
  prescriberDetails: PrescriberDetails;
  centerId: MedicalCenter;
  [key: string]: any;
}

interface PrescriptionTemplateProps {
  prescriptionData: PrescriptionData;
  className?: string;
}

const PrescriptionTemplate: React.FC<PrescriptionTemplateProps> = ({
  prescriptionData,
  className = "",
}) => {
  // Format date function
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white p-8 max-w-4xl mx-auto border border-gray-200 prescription-template ${className}`}
    >
      {/* Header - Medical Center Information */}
      <div className="text-center mb-8 border-b-2 border-blue-200 pb-4">
        <h1 className="text-3xl font-bold text-blue-800">
          {prescriptionData.centerId.centerName}
        </h1>
        <p className="text-gray-600">{prescriptionData.centerId.address}</p>
        {prescriptionData.centerId.town && (
          <p className="text-gray-600">{prescriptionData.centerId.town}</p>
        )}
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 mt-2">
          <p className="text-gray-600 flex items-center justify-center">
            📧 {prescriptionData.centerId.email}
          </p>
          <p className="text-gray-600 flex items-center justify-center">
            📞 {prescriptionData.centerId.contactNo}
          </p>
        </div>
      </div>

      {/* Prescription Details */}
      <div className="mb-6 flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-600">
            Prescription #:{" "}
            <span className="font-semibold">
              {prescriptionData.prescriptionNo}
            </span>
          </p>
          <p className="text-gray-600">
            Date:{" "}
            <span className="font-semibold">
              {formatDate(prescriptionData.createdAt)}
            </span>
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-gray-600">
            Dr. {prescriptionData.prescriberDetails.name}
          </p>
          <p className="text-gray-600 text-sm">
            {prescriptionData.prescriberDetails.specialization}
          </p>
          <p className="text-gray-600 text-sm">
            SLMC: {prescriptionData.prescriberDetails.slmcNo}
          </p>
        </div>
      </div>

      {/* Patient Details */}
      <div className="border-t border-b border-gray-300 py-3 my-4">
        <h2 className="text-xl font-semibold text-blue-800">PATIENT DETAILS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">
            Name:{" "}
            <span className="font-semibold">
              {prescriptionData.patientId.title}{" "}
              {prescriptionData.patientId.patientName}
            </span>
          </p>
          <p className="text-gray-600">
            Age:{" "}
            <span className="font-semibold">
              {prescriptionData.patientId.age}
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            Contact No:{" "}
            <span className="font-semibold">
              {prescriptionData.patientId.contactNo}
            </span>
          </p>
          <p className="text-gray-600">
            Email:{" "}
            <span className="font-semibold">
              {prescriptionData.patientId.email}
            </span>
          </p>
        </div>
      </div>

      {/* Reason for Visit */}
      <div className="border-t border-b border-gray-300 py-3 my-4">
        <h2 className="text-xl font-semibold text-blue-800">
          REASON FOR VISIT
        </h2>
      </div>
      <p className="mb-6">{prescriptionData.reasonForVisit}</p>

      {/* Vital Signs */}
      <div className="border-t border-b border-gray-300 py-3 my-4">
        <h2 className="text-xl font-semibold text-blue-800">VITAL SIGNS</h2>
      </div>
      {prescriptionData.vitalSigns ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Weight</p>
            <p className="font-semibold">
              {prescriptionData.vitalSigns.weight}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Height</p>
            <p className="font-semibold">
              {prescriptionData.vitalSigns.height}
            </p>
          </div>
          <div>
            <p className="text-gray-600">BMI</p>
            <p className="font-semibold">{prescriptionData.vitalSigns.bmi}</p>
          </div>
          <div>
            <p className="text-gray-600">Pulse Rate</p>
            <p className="font-semibold">
              {prescriptionData.vitalSigns.pulseRate}
            </p>
          </div>
        </div>
      ) : (
        <p className="mb-6 text-gray-500">No vital signs recorded</p>
      )}

      {/* Clinical Details */}
      <div className="border-t border-b border-gray-300 py-3 my-4">
        <h2 className="text-xl font-semibold text-blue-800">
          CLINICAL DETAILS IN BRIEF
        </h2>
      </div>
      <p className="mb-6">
        {prescriptionData.clinicalDetails || "No clinical details provided"}
      </p>

      {/* Advice */}
      <div className="border-t border-b border-gray-300 py-3 my-4">
        <h2 className="text-xl font-semibold text-blue-800">ADVICE</h2>
      </div>
      <p className="mb-6">
        {prescriptionData.advice || "No specific advice provided"}
      </p>

      {/*{/* Medications */}
      <div className="border-t border-b border-gray-300 py-3 my-4">
        <h2 className="text-xl font-semibold text-blue-800">Rx</h2>
      </div>
      {prescriptionData.medications?.length > 0 ? (
        <div className="mb-6">
          {prescriptionData.medications.map((medication, index) => (
            <div key={index} className="mb-4 pl-4 border-l-4 border-blue-200">
              <p className="font-semibold">
                {medication.productName} ({medication.genericName})
              </p>
              <p className="text-gray-700">
                {medication.dose}, {medication.frequency} for{" "}
                {medication.duration}
              </p>
              {medication.note && (
                <p className="text-sm text-gray-600 mt-1">
                  Note: {medication.note}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-gray-500">No medications prescribed</p>
      )}

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-300">
        <div className="flex flex-col items-end">
          <div className="h-16 w-48 border-b-2 border-gray-400 mb-2"></div>
          <p className="text-gray-600">Signature</p>
          <p className="text-gray-600">
            Dr. {prescriptionData.prescriberDetails.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTemplate;
