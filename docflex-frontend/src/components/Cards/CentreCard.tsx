"use client";

import { Eye, Pencil, Stethoscope, Trash2 } from "lucide-react";

interface CentreCardProps {
    topName: string;
    middleName: string;
    bottomName: string;
    handleView: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
}

const CentreCard: React.FC<CentreCardProps> = ({ topName, middleName, bottomName, handleEdit, handleDelete,handleView }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg w-72 relative flex flex-col items-center">
            <div className="p-2 w-full">
                <p className="text-gray-600 text-xs mt-2 text-left pl-2 font-semibold">{topName}</p>
                <div className="mt-2 flex justify-center">
                    <Stethoscope strokeWidth={1} size={56} className="text-gray-600" />
                </div>
                <h2 className="text-blue-600 text-md font-semibold mt-2 text-center font-inter">{middleName}</h2>
                <p className="text-gray-600 text-sm text-center">{bottomName}</p>
            </div>
            <div className="bg-gray-600 w-full h-12 mt-2 rounded-b-2xl flex justify-center items-center gap-4 py-2">
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200" onClick={handleView}>
                    <Eye size={18} className="text-gray-500" />
                </button>
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200" onClick={handleEdit}>
                    <Pencil size={18} className="text-blue-500" />
                </button>
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200" onClick={handleDelete}>
                    <Trash2 size={18} className="text-red-500" />
                </button>
            </div>
        </div>
    );
};

export default CentreCard;
