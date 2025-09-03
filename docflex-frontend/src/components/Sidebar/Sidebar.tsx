"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AiFillCaretDown } from "react-icons/ai";
import { MdMenuOpen } from "react-icons/md";
import { sidebarItems } from "./SidebarData";
import { useAuthStore } from "@/store/authStore";

interface SubItem {
  title: string;
  path?: string;
  permission?: string;
}

interface SidebarItem {
  title: string;
  icon?: React.ElementType;
  path?: string;
  dropdown?: boolean;
  subItems?: SubItem[];
  permission?: string;
}

interface SidebarProps {
  onCollapseChange: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  const userRole = useAuthStore((state) => state.user?.role);
  const userPermissions = useMemo(
    () => userRole?.permissions ?? [],
    [userRole]
  );

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;

    for (const item of sidebarItems) {
      const activeSub = item.subItems?.find((sub) => sub.path === pathname);
      if (activeSub) {
        setActiveTab(activeSub.title);
        return;
      }
    }

    const activeMainItem = sidebarItems.find((item) => item.path === pathname);
    if (activeMainItem) setActiveTab(activeMainItem.title);
  }, [pathname, hydrated]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsSidebarVisible(currentScrollY <= lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (title: string) =>
    setOpenDropdown(openDropdown === title ? null : title);
  const handleSubItemClick = (title: string) => {
    setActiveTab(title);
    if (window.innerWidth < 1024) setIsCollapsed(true);
  };
  const toggleSidebarCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (window.innerWidth > 1024) onCollapseChange(newCollapsed);
  };
  const isItemActive = (item: SidebarItem | SubItem) =>
    activeTab === item.title;
  const hasVisibleSubItems = (item: SidebarItem) =>
    !item.subItems ||
    item.subItems.some(
      (sub) => !sub.permission || userPermissions.includes(sub.permission)
    );

  //  Conditional render after hydration
  if (!hydrated) return null;

  const renderSubMenu = (item: SidebarItem) => (
    <ul className="overflow-hidden transition-all duration-500 text-md">
      {item.subItems?.map(
        (sub) =>
          sub.path &&
          (!sub.permission || userPermissions.includes(sub.permission)) && (
            <li key={sub.title}>
              <Link
                href={sub.path}
                className={`block pl-20 mb-1 p-3 transition-colors ${
                  isItemActive(sub)
                    ? "bg-gradient-to-r from-blue_dark to-blue_dark_2"
                    : "hover:bg-gradient-to-r hover:from-blue_dark_hover_1 hover:to-blue_dark_hover_2"
                }`}
                onClick={() => handleSubItemClick(sub.title)}
              >
                {sub.title}
              </Link>
            </li>
          )
      )}
    </ul>
  );

  const renderSidebarItem = (item: SidebarItem) => {
    if (
      (item.permission && !userPermissions.includes(item.permission)) ||
      !hasVisibleSubItems(item)
    )
      return null;

    return (
      <li key={item.title}>
        {item.dropdown ? (
          <div>
            <button
              className={`flex items-center w-full py-3 px-4 text-center transition-colors duration-300 ease-in-out ${
                isItemActive(item)
                  ? "bg-gradient-to-r from-blue_dark to-blue_dark_2"
                  : "hover:bg-gradient-to-r hover:from-blue_dark_hover_1 hover:to-blue_dark_hover_2"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}
              onClick={() => toggleDropdown(item.title)}
            >
              {item.icon && <item.icon className="text-lg" />}
              {!isCollapsed && (
                <span className="ml-4 text-md">{item.title}</span>
              )}
              {!isCollapsed && (
                <AiFillCaretDown
                  className={`ml-auto transition-transform ${
                    openDropdown === item.title ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openDropdown === item.title && !isCollapsed && renderSubMenu(item)}
          </div>
        ) : (
          item.path && (
            <Link
              href={item.path}
              className={`flex items-center w-full py-3 px-4 transition-colors duration-300 ${
                isItemActive(item)
                  ? "bg-gradient-to-r from-blue_dark to-blue_dark_2"
                  : "hover:bg-gradient-to-r hover:from-blue_dark_hover_1 hover:to-blue_dark_hover_2"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}
              onClick={() => setActiveTab(item.title)}
            >
              {item.icon && <item.icon className="text-lg" />}
              {!isCollapsed && (
                <span className="ml-4 text-md">{item.title}</span>
              )}
            </Link>
          )
        )}
      </li>
    );
  };

  const sidebarContainerClasses = `m-2 rounded-2xl fixed h-screen z-10 text-white bg-gradient-to-b from-[#0D4C73] to-[#000000] transition-all duration-500 ease-in-out ${
    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
  } ${isCollapsed ? "w-0 sm:w-20" : "w-[256px]"}`;

  return (
    <div className="z-50">
      {isCollapsed ? (
        <div
          className="absolute z-50 flex items-center justify-center w-16 h-16 p-3 ml-3 shadow-lg cursor-pointer bg-[#0d4c73] rounded-full mt-2"
          onClick={toggleSidebarCollapse}
        >
          <Image
            src="/docflex-col.png"
            alt="Logo"
            width={100}
            height={20}
            priority
          />
        </div>
      ) : (
        <button
          onClick={toggleSidebarCollapse}
          className="absolute z-50 p-2 text-white bg-transparent rounded-md top-4 left-4 hover:text-blue-300"
        >
          <MdMenuOpen size="1.625rem" />
        </button>
      )}

      <div className={sidebarContainerClasses}>
        <div className="flex items-center justify-center p-4 h-20 border-blue-600">
          {!isCollapsed && (
            <Image
              src="/docflexLogo.png"
              alt="Expanded Logo"
              width={100}
              height={20}
              priority
            />
          )}
        </div>
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-auto scrollbar-thin scrollbar-thumb-scroll_blue scrollbar-track-transparent">
          <ul className="space-y-1">{sidebarItems.map(renderSidebarItem)}</ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
