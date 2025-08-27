import React from "react";
import Image from "next/image";
import InfoItem from "./InfoItem";

interface PrescriberData {
  digitalSignature?: string;
  slmcNo: string;
  title: string;
  name: string;
  specialization?: string;
  remarks?: string;
}

interface PrescriberInfoProps {
  prescriberData: PrescriberData;
}

const PrescriberInfo: React.FC<PrescriberInfoProps> = ({ prescriberData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
        </svg>
        Prescriber Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          }
          label="Doctor"
          value={`${prescriberData.title} ${prescriberData.name}`}
        />

        <InfoItem
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
          }
          label="Specialization"
          value={prescriberData.specialization || "Not provided"}
        />

        <InfoItem
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z"
                clipRule="evenodd"
              />
            </svg>
          }
          label="SLMC Registration"
          value={prescriberData.slmcNo}
        />

        <InfoItem
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          }
          label="Remarks"
          value={prescriberData.remarks || "—"}
        />
      </div>

      {prescriberData.digitalSignature && (
        <div className="mt-6 pt-4 border-t border-blue-200">
          <p className="text-sm text-gray-500 mb-2">Digital Signature</p>
          <div className="bg-gray-50 p-3 rounded-lg inline-block shadow-sm">
            <Image
              src={prescriberData.digitalSignature}
              alt="Doctor Signature"
              width={150}
              height={60}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriberInfo;
