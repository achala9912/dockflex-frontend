"use client";

import React from "react";
import MyProfileSection from "./MyProfileSection";
import { IoMdClose } from "react-icons/io";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 border-b py-4">
          <h2 className="text-lg font-bold text-gray-800">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
           <IoMdClose size={22}/>
          </button>
        </div>
        <div className="p-6">
          <MyProfileSection />
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
