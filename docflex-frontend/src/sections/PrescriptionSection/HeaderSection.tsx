
import React from "react";



interface HeaderSectionProps {
  prescriptionNo: string;
  createdAt: string | Date;
  prescriptionType: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
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
    <div className="bg-white rounded-2xl shadow-md ">
      <div className="flex flex-col md:flex-row justify-between items-start">
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
