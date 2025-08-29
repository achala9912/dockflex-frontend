"use client";

import React from "react";
import { LiaMedrt } from "react-icons/lia";
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";
interface LivePrescriptionProps {
  patientId: {
    patientName: string;
    age: string;
    contactNo: string;
    email: string;
    gender: string;
    dob: string;
    title: string;
  };
  reasonForVisit: string;
  symptoms: string[];
  vitalSigns: Array<{
    name: string;
    value: string;
    unit: string;
  }>;
  clinicalDetails: string;
  advice: string;
  remark?: string;
  medications: {
    productName: string;
    dose: string;
    frequency: string;
    duration: string;
    note?: string;
    route: string;
    genericName: string;
  }[];
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">
    {children}
  </h2>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-2">
    <span className="text-blue-600">{icon}</span>
    <p className="text-sm text-gray-700">
      <span className="font-medium">{label}:</span> {value}
    </p>
  </div>
);

const LivePrescription: React.FC<LivePrescriptionProps> = ({
  patientId,
  reasonForVisit,
  symptoms,
  vitalSigns,
  clinicalDetails,
  advice,
  remark,
  medications,
}) => {
  // Extract vital signs values
  const getVitalValue = (name: string) => {
    const vital = vitalSigns.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    return vital ? `${vital.value} ${vital.unit}` : "N/A";
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 border border-gray-200 space-y-6">
      <div className="text-center flex gap-2 items-center justify-center text-lg text-red-400 font-semibold">
        Live Preview <HiOutlineStatusOnline size={24} />
      </div>
      <hr />

      {/* Patient + Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient details */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm">
          <SectionTitle>Patient Details</SectionTitle>
          <div className="space-y-2">
            <InfoRow
              icon={<FaUser />}
              label="Name"
              value={`${patientId.title || ""} ${patientId.patientName}`.trim()}
            />
            <InfoRow
              icon={<FaBirthdayCake />}
              label="Age"
              value={patientId.age || "N/A"}
            />
            <InfoRow
              icon={<FaPhone />}
              label="Contact"
              value={patientId.contactNo || "N/A"}
            />
            <InfoRow
              icon={<FaEnvelope />}
              label="Email"
              value={patientId.email || "N/A"}
            />
          </div>
        </div>

        {/* Vital signs */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm">
          <SectionTitle>Vital Signs</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="font-semibold text-gray-800 text-sm">
                {getVitalValue("weight")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Height</p>
              <p className="font-semibold text-gray-800 text-sm">
                {getVitalValue("height")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">BMI</p>
              <p className="font-semibold text-gray-800 text-sm">
                {getVitalValue("bmi")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Temperature</p>
              <p className="font-semibold text-gray-800 text-sm">
                {getVitalValue("temperature")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center col-span-2">
              <p className="text-xs text-gray-500">Pulse Rate</p>
              <p className="font-semibold text-gray-800 text-sm">
                {getVitalValue("pulse")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reason */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <SectionTitle>Reason for Visit</SectionTitle>
          <p className="text-sm">{reasonForVisit || "Not specified"}</p>
        </div>

        {/* Symptoms inline */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <SectionTitle>Symptoms</SectionTitle>
          <p className="text-gray-700 text-sm">
            {symptoms && symptoms.length > 0
              ? symptoms.join(", ")
              : "None reported"}
          </p>
        </div>

        {/* Clinical details */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <SectionTitle>Clinical Details</SectionTitle>
          <p className="text-sm">{clinicalDetails || "Not specified"}</p>
        </div>

        {/* Advice */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <SectionTitle>Advice</SectionTitle>
          <p className="text-sm">{advice || "Not specified"}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm md:col-span-2">
          <SectionTitle>Remarks</SectionTitle>
          <p className="text-sm">{remark}</p>
        </div>
      </div>

      {/* Prescription Section */}
      <div>
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-blue-700 mr-3">℞</span>
        </div>

        {medications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {medications.map((med, index) => (
              <div
                key={index}
                className="border border-blue-200 bg-blue-50 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <LiaMedrt className="w-6 h-6 text-blue-600" />
                  <h3 className="text-base font-semibold text-gray-800 uppercase">
                    {med.productName
                      ? `${med.productName}${
                          med.genericName ? ` (${med.genericName})` : ""
                        }`
                      : "Drug Name"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Route: </span>
                    {med.route || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Dose: </span>
                    {med.dose || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Frequency: </span>
                    {med.frequency || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Duration: </span>
                    {med.duration ? `For ${med.duration}` : "N/A"}
                  </p>
                </div>

                {med.note && (
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Note: </span>
                    {med.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No medications prescribed
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center border-t pt-6 text-sm text-gray-500">
        Powered by{" "}
        <span className="font-semibold text-blue-600">Docflex Pro</span>
      </div>
    </div>
  );
};

export default LivePrescription;
