"use client";

import React from "react";
import Image from "next/image";
import { LiaMedrt } from "react-icons/lia";
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake } from "react-icons/fa";

interface PrescriptionTemplateProps {
  patientDetails: {
    name: string;
    age: string;
    contact: string;
    email: string;
  };
  reasonForVisit: string;
  symptoms: string[];
  vitalSigns: {
    weight: string;
    height: string;
    bmi: string;
    temp: string;
    pulseRate: string;
  };
  clinicalDetails: string;
  advice: string;
  remarks?: string;
  medications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  doctor: {
    name: string;
    specialization: string;
    slmcNo: string;
    signatureUrl?: string;
  };
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

const PrescriptionTemplate: React.FC<PrescriptionTemplateProps> = ({
  patientDetails,
  reasonForVisit,
  symptoms,
  vitalSigns,
  clinicalDetails,
  advice,
  remarks,
  medications,
  doctor,
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white  p-10 border border-gray-200 space-y-8">
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-blue-700">MediCare Pvt Ltd</h1>
        <p className="text-sm text-gray-600">
          No 171C, 20th Lane, Arunodaya, Borelasgamuwa
        </p>
        <p className="text-sm text-gray-600">info@medicare.com | +9412509243</p>
      </div>

      {/* Patient + Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient details */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm">
          <SectionTitle>Patient Details</SectionTitle>
          <div className="space-y-2">
            <InfoRow icon={<FaUser />} label="Name" value={patientDetails.name} />
            <InfoRow
              icon={<FaBirthdayCake />}
              label="Age"
              value={patientDetails.age}
            />
            <InfoRow
              icon={<FaPhone />}
              label="Contact"
              value={patientDetails.contact}
            />
            <InfoRow
              icon={<FaEnvelope />}
              label="Email"
              value={patientDetails.email}
            />
          </div>
        </div>

        {/* Vital signs */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm">
          <SectionTitle>Vital Signs</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="font-semibold text-gray-800 text-sm">{vitalSigns.weight}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Height</p>
              <p className="font-semibold text-gray-800 text-sm">{vitalSigns.height}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">BMI</p>
              <p className="font-semibold text-gray-800 text-sm">{vitalSigns.bmi}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Temp</p>
              <p className="font-semibold text-gray-800 text-sm">{vitalSigns.temp}</p>
            </div>
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Pulse Rate</p>
              <p className="font-semibold text-gray-800 text-sm">{vitalSigns.pulseRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
        <SectionTitle>Reason for Visit</SectionTitle>
        <p className="text-sm">{reasonForVisit}</p>
      </div>

      {/* Symptoms inline */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
        <SectionTitle>Symptoms</SectionTitle>
        <p className="text-gray-700 text-sm">
          {symptoms && symptoms.length > 0 ? symptoms.join(", ") : "None"}
        </p>
      </div>

      {/* Clinical details */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
        <SectionTitle>Clinical Details</SectionTitle>
        <p className="text-sm">{clinicalDetails}</p>
      </div>

      {/* Advice */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
        <SectionTitle>Advice</SectionTitle>
        <p className="text-sm">{advice}</p>
      </div>

      {/* Remarks */}
      {remarks && (
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <SectionTitle>Remarks</SectionTitle>
          <p className="text-sm">{remarks}</p>
        </div>
      )}

      {/* Prescription Section */}
      <div>
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-blue-700 mr-3">℞</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {medications.map((med, index) => (
            <div
              key={index}
              className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <LiaMedrt className="w-6 h-6 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-800 uppercase">{med.name}</h3>
              </div>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-medium">Dosage:</span> {med.dosage}
              </p>
              {med.instructions && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Instructions:</span> {med.instructions}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Signature */}
      <div className="border-t pt-6 mt-8 flex flex-col items-center text-center">
        {doctor.signatureUrl && (
          <Image
            src={doctor.signatureUrl}
            alt="Doctor Signature"
            width={120}
            height={50}
            className="object-contain mb-2"
          />
        )}
        <p className="font-semibold text-gray-800">{doctor.name}</p>
        <p className="text-gray-600 text-sm">{doctor.specialization}</p>
        <p className="text-gray-500 text-xs">SLMC No: {doctor.slmcNo}</p>
      </div>

      {/* Footer */}
      <div className="text-center border-t pt-6 text-sm text-gray-500">
        Powered by <span className="font-semibold text-blue-600">Docflex Pro</span>
      </div>
    </div>
  );
};

export default PrescriptionTemplate;
