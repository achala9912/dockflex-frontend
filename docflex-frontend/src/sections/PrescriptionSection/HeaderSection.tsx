import Image from "next/image";
import React from "react";

interface CenterData {
  logo?: string;
  centerName: string;
  address?: string;
  town?: string;
  contactNo?: string;
}

interface HeaderSectionProps {
  centerData: CenterData;
  prescriptionNo: string;
  createdAt: string | Date;
  prescriptionType: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  centerData,
  prescriptionNo,
  createdAt,
  prescriptionType,
}) => {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Clinic Info */}
        <div className="flex items-center mb-4 md:mb-0">
          {centerData.logo && (
            <div className="mr-4 bg-white p-2 rounded-xl shadow-sm">
              <Image
                src={centerData.logo}
                alt="Clinic Logo"
                width={80}
                height={80}
                className="rounded-md object-contain"
              />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {centerData.centerName}
            </h1>

            {centerData.address && (
              <p className="text-gray-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {centerData.address}
                {centerData.town && `, ${centerData.town}`}
              </p>
            )}

            {centerData.contactNo && (
              <p className="text-gray-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Tel: {centerData.contactNo}
              </p>
            )}
          </div>
        </div>

        {/* Prescription Info */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">
            Prescription #{prescriptionNo}
          </h2>

          <p className="flex items-center mt-2">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {formatDate(createdAt)}
          </p>

          <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-800 text-sm font-medium rounded-full">
            {prescriptionType}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
