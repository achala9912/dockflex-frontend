import React from "react";

interface AdviceRemarksProps {
  advice?: string;
  remark?: string;
}

const AdviceRemarks: React.FC<AdviceRemarksProps> = ({ advice, remark }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        Advice &amp; Remarks
      </h2>

      <div className="space-y-4">
        {advice && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <p className="text-sm text-gray-500">Medical Advice</p>
            <p className="font-medium text-green-700">{advice}</p>
          </div>
        )}

        {remark && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-sm text-gray-500">Additional Remarks</p>
            <p className="font-medium text-purple-700">{remark}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdviceRemarks;
