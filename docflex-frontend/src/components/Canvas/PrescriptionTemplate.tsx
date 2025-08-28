"use client";

import React from "react";
import Image from "next/image";
import { LiaMedrt } from "react-icons/lia";
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake } from "react-icons/fa";

interface PrescriptionTemplateProps {
  centerId: {
    centerName: string;
    contactNo: string;
    address: string;
    town: string;
    logo?: string;
    email?: string;
  };
  prescriptionNo: string;
  createdAt: string;
  prescriptionType: string;
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
  vitalSigns: {
    weight: string;
    height: string;
    bmi: string;
    pulseRate: string;
    temp?: string;
  }[];
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
  prescriberDetails: {
    name: string;
    specialization: string;
    slmcNo: string;
    digitalSignature?: string;
    title: string;
    remarks?: string;
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
  centerId,
  prescriptionNo,
  createdAt,
  patientId,
  reasonForVisit,
  symptoms,
  vitalSigns,
  clinicalDetails,
  advice,
  remark,
  medications,
  prescriberDetails,
}) => {
  const vital = vitalSigns[0]; // API gives array, we show first set

  return (
    <div className="max-w-4xl mx-auto bg-white  p-10 border border-gray-200 space-y-8">
      <div className="flex items-center justify-center border-b pb-6 gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          {centerId.logo && (
            <Image
              src={centerId.logo}
              alt="Center Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          )}
        </div>

        {/* Center Details */}
        <div className="text-left">
          <h1 className="text-2xl font-bold text-blue-700">
            {centerId.centerName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {centerId.address}, {centerId.town}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {centerId.email} | {centerId.contactNo}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center border-b pb-4">
        <div className="text-base text-gray-700">
          <span className="font-semibold text-blue-700">Prescription No:</span>{" "}
          {prescriptionNo}
        </div>
        <div className="text-base text-gray-700">
          <span className="font-semibold text-blue-700">Prescribed At:</span>{" "}
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Patient + Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient details */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm">
          <SectionTitle>Patient Details</SectionTitle>
          <div className="space-y-2">
            <InfoRow
              icon={<FaUser />}
              label="Name"
              value={`${patientId.title} ${patientId.patientName}`}
            />
            <InfoRow
              icon={<FaBirthdayCake />}
              label="Age"
              value={patientId.age}
            />
            <InfoRow
              icon={<FaPhone />}
              label="Contact"
              value={patientId.contactNo}
            />
            <InfoRow
              icon={<FaEnvelope />}
              label="Email"
              value={patientId.email}
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
                {vital?.weight}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Height</p>
              <p className="font-semibold text-gray-800 text-sm">
                {vital?.height}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">BMI</p>
              <p className="font-semibold text-gray-800 text-sm">
                {vital?.bmi}
              </p>
            </div>
            {vital?.temp && (
              <div className="bg-white rounded-lg shadow-sm p-3 text-center">
                <p className="text-xs text-gray-500">Temp</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {vital?.temp}
                </p>
              </div>
            )}
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">Pulse Rate</p>
              <p className="font-semibold text-gray-800 text-sm">
                {vital?.pulseRate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        {remark && (
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <SectionTitle>Remarks</SectionTitle>
            <p className="text-sm">{remark}</p>
          </div>
        )}
      </div>

      {/* Prescription Section */}
      <div>
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-blue-700 mr-3">℞</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {medications.map((med, index) => (
            <div
              key={index}
              className="border border-blue-200 bg-blue-50 rounded-lg p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <LiaMedrt className="w-6 h-6 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-800 uppercase">
                  {med.productName} ( {med.genericName} )
                </h3>
              </div>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Route: </span>
                {med.route}
              </p>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Dose: </span>
                {med.dose}
              </p>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Frequency: </span>
                {med.frequency}
              </p>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-semibold">Duration: </span>
                For {med.duration}
              </p>

              {med.note && (
                <p className="text-base text-gray-700 mb-1">
                  <span className="font-semibold">Note: </span>
                  {med.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Signature */}
      <div className="border-t pt-6 mt-8 flex flex-col items-center text-center">
        {prescriberDetails.digitalSignature && (
          <Image
            src={prescriberDetails.digitalSignature}
            alt="Doctor Signature"
            width={120}
            height={50}
            className="object-contain mb-2"
          />
        )}
        <p className="font-semibold text-gray-800">
          {prescriberDetails.title} {prescriberDetails.name}
        </p>
        <p className="text-gray-600 text-sm">
          {prescriberDetails.specialization}
        </p>
        <p className="text-gray-500 text-xs">
          SLMC No: {prescriberDetails.slmcNo}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center border-t pt-6 text-sm text-gray-500">
        Powered by{" "}
        <span className="font-semibold text-blue-600">Docflex Pro</span>
      </div>
    </div>
  );
};

export default PrescriptionTemplate;
