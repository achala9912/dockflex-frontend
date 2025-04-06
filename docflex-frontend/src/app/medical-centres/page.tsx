"use client";

import RoundButton from "@/components/Buttons/RoundButton";
import CentreCard from "@/components/Cards/CentreCard";
import InputField from "@/components/InputField/InputField";
import { Tooltip } from "@/components/ui/tooltip";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import jsonData from "@/data/data.json";
import { useRouter } from "next/navigation";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";

function Page() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState<{ id: string; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const addNewCentre = () => {
    router.push(`/medical-centres/new`);
  };

  const handleEdit = (centre: { id: string }) => {
    router.push(`/medical-centres/edit/${centre.id}`);
  };

  const handleDeleteConfirm = (centre: { id: string; name: string }) => {
    setSelectedCentre(centre);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedCentre) {
      console.log("Deleted Centre:", selectedCentre.id);
      // API call to delete the centre goes here
    }
    setIsDeleteModalOpen(false);
    setSelectedCentre(null);
  };

  const filteredCentres = jsonData.centreData.filter((centre) =>
    `${centre.id} ${centre.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between mb-3">
        <h3 className="flex items-center font-semibold font-inter text-md">
          Registered Medical Centres
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <InputField
              id="centre-search"
              width="w-full sm:w-[400px]"
              icon={<FiSearch />}
              type="text"
              value={searchTerm}
              placeholder="Search Centre ID / Name"
              onChange={(e) => setSearchTerm(e.target.value)}
              label={true}
              labelName="Centre ID / Name"
            />
          </div>
          <Tooltip content="Add New Centre" side="top">
            <RoundButton
              icon={IoMdAdd}
              className="hover:bg-gray-300 bg-blue-800 text-white hover:text-blue-800"
              onClick={addNewCentre}
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
        {filteredCentres.length > 0 ? (
          filteredCentres.map((centre) => (
            <CentreCard
              key={centre.id}
              topName={centre.id}
              middleName={centre.name}
              bottomName1={centre.town}
              bottomName2={centre.phone}
              bottomName3={centre.email}
              handleEdit={() => handleEdit(centre)}
              handleDelete={() => handleDeleteConfirm(centre)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No matching centres found.</p>
        )}
      </div>

      <DeleteConfirm
        element={selectedCentre?.name || ""}
        onDelete={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
    </>
  );
}

export default Page;
