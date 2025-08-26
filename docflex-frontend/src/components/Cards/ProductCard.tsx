"use client";

import { Pencil, Trash2 } from "lucide-react";
import { GiMedicines } from "react-icons/gi";

interface ProductCardProps {
  productId: string | undefined;
  productName: string;
  genericName: string;
  centerName: string;
  bottomName3?: string;
  handleEdit: () => void;
  handleDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  productName,
  genericName,
  centerName,
  bottomName3,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-72 relative flex flex-col items-center">
      <div className="p-2 w-full">
        <p className="text-gray-600 text-xs mt-2 text-left pl-2 font-semibold">
          {productId}
        </p>
        <div className="mt-3 flex justify-center">
          <GiMedicines strokeWidth={1} size={56} className="text-gray-600" />
        </div>
        <h2 className="text-blue-600 text-md font-semibold mt-2 text-center font-inter">
          {productName && productName.length > 30
            ? productName.slice(0, 30) + "..."
            : productName || ""}
        </h2>

        <p className="text-gray-600 text-sm text-center font-medium">
          @{genericName}
        </p>
        <div className="mt-2 flex flex-col items-center">
          <p className="text-gray-600 text-xs text-center">{centerName}</p>
          <p className="text-gray-600 text-xs text-center">{bottomName3}</p>
        </div>
      </div>
      <div className="bg-gray-600 w-full h-12 mt-2 rounded-b-2xl flex justify-center items-center gap-4 py-2">
        <button
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          onClick={handleEdit}
        >
          <Pencil size={18} className="text-blue-500" />
        </button>
        <button
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          onClick={handleDelete}
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
