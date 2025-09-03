"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GoHome, GoScreenFull } from "react-icons/go";
import ConfirmationPopup from "../Popups/ConfirmationPopup";
import { useAuthStore } from "@/store/authStore";

interface TopNavProps {
  isCollapsed: boolean;
}

const TopNavbar: React.FC<TopNavProps> = ({ isCollapsed }) => {
  const user = useAuthStore((state) => state.user);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setLogoutPopupOpen(true);
  };
  const handleYes = () => {
    const { logout } = useAuthStore.getState();
    logout(); // Clear Zustand + sessionStorage state

    setLogoutPopupOpen(false);

    // Use replace so the back button won't go back to the old page
    setTimeout(() => {
      router.replace("/");
    }, 0);
  };

  const handleNo = () => {
    setLogoutPopupOpen(false);
  };
  // Function to toggle full screen
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className={`rounded-2xl bg-white shadow-sm border border-gary-50 px-6 py-3 flex items-center justify-between m-2 mb-0 ml-0 h-14 ${
        isCollapsed ? "lg:w-[calc(100%-110px)]" : "lg:w-[calc(100%-285px)]"
      } w-[calc(100%-100px)] sm:w-[calc(100%-110px)]`}
    >
      {/* Left Side - Home & Fullscreen Buttons */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900 transition">
          <GoHome size={22} />
        </button>
        <button
          className="text-gray-600 hover:text-gray-900 transition"
          onClick={handleFullScreen}
        >
          <GoScreenFull size={22} />
        </button>
      </div>

      {/* Right Side - User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt={user?.name} />
            <AvatarFallback>
              {" "}
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 text-left">{user?.userName}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="text-red-500 hover:text-red-700 transition"
          onClick={handleLogoutClick}
        >
          <IoMdLogOut size={22} />
        </button>
        <ConfirmationPopup
          isOpen={logoutPopupOpen}
          element="Logout"
          handleYes={handleYes}
          handleNo={handleNo}
        />
      </div>
    </div>
  );
};

export default TopNavbar;
