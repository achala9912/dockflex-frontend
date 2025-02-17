"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillCaretDown } from "react-icons/ai";
import { MdMenuOpen } from "react-icons/md";
import { sidebarItems } from "./SidebarData";

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const lastScrollY = useRef(0);

  const controlSidebarVisibility = () => {
    const currentScrollY = window.scrollY;
    setIsSidebarVisible(currentScrollY <= lastScrollY.current);
    lastScrollY.current = currentScrollY;
  };

  const toggleDropdown = (itemTitle: string) => {
    setOpenDropdown(openDropdown === itemTitle ? null : itemTitle);
  };

  const handleTabClick = (itemTitle: string) => {
    setActiveTab(itemTitle);
    toggleDropdown(itemTitle);
  };

  const handleSubItemClick = (parentTitle: string, subItemTitle: string) => {
    setActiveTab(subItemTitle);
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  };

  const toggleSidebarCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (window.innerWidth > 1024) {
      onCollapseChange(newCollapsedState);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlSidebarVisibility);
    return () => {
      window.removeEventListener("scroll", controlSidebarVisibility);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sidebarContainerClasses = `fixed h-screen z-10 text-white bg-gradient-to-b from-[#0D4C73] to-[#000000] transition-all duration-500 ease-in-out ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"
    } ${isCollapsed ? "w-0 sm:w-20" : "w-[256px]"}`;

  const renderSidebarItem = (item: SidebarItem) => (
    <li key={item.title} onMouseEnter={() => isCollapsed && item.dropdown && setHoveredItem(item.title)}
      onMouseLeave={() => isCollapsed && setHoveredItem(null)}>
      {item.dropdown ? (
        <div>
          <button
            className={`flex items-center w-full py-3 px-4 text-center transition-colors duration-300 ease-in-out ${activeTab === item.title ? "bg-blue-600" : "hover:bg-blue-700"
              } focus:outline-none ${isCollapsed ? "justify-center" : "justify-start"}`}
            onClick={() => toggleDropdown(item.title)}
          >
            {item.icon && <item.icon className="text-lg" />}
            {!isCollapsed && <span className="ml-4">{item.title}</span>}
            {!isCollapsed && <AiFillCaretDown className={`ml-auto transition-transform ${openDropdown === item.title ? "rotate-180" : ""}`} />}
          </button>

          {hoveredItem === item.title && isCollapsed && renderHoverMenu(item)}
          {openDropdown === item.title && !isCollapsed && renderSubMenu(item)}
        </div>
      ) : (
        item.path && (
          <Link href={item.path} className={`flex items-center w-full py-3 px-4 transition-colors duration-300 ${activeTab === item.title ? "bg-blue-600" : "hover:bg-blue-700"
            } focus:outline-none ${isCollapsed ? "justify-center" : "justify-start"}`}
            onClick={() => handleTabClick(item.title)}
          >
            {item.icon && <item.icon className="text-lg" />}
            {!isCollapsed && <span className="ml-4">{item.title}</span>}
          </Link>
        )
      )}
    </li>
  );

  const renderSubMenu = (item: SidebarItem) => (
    <ul className="overflow-hidden transition-all duration-500">
      {item.subItems?.map((subItem) => subItem.path && (
        <li key={subItem.title}>
          <Link href={subItem.path} className={`block pl-10 p-3 transition-colors ${activeTab === subItem.title ? "bg-blue-600" : "hover:bg-blue-700"
            }`} onClick={() => handleSubItemClick(item.title, subItem.title)}>
            {subItem.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderHoverMenu = (item: SidebarItem) => (
    <div className="fixed left-[80px] z-50 w-48 p-1">
      <div className="relative bottom-12 w-48 p-1 bg-blue-800 rounded-md shadow-lg">
        <ul>
          {item.subItems?.map((subItem) => subItem.path && (
            <li key={subItem.title}>
              <Link href={subItem.path} className="block p-2 hover:bg-blue-700"
                onClick={() => { setHoveredItem(null); handleSubItemClick(item.title, subItem.title); }}>
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="z-50">
      {isCollapsed ? (
        <div className="absolute z-50 flex items-center justify-center w-16 h-16 p-2 ml-2 cursor-pointer bg-[#0d4c73] sm:bg-transparent rounded-full sm:rounded-none mt-2"
          onClick={toggleSidebarCollapse}>
          <Image src="/docflex-col.png" alt="Logo" width={100} height={20} priority className="" />
        </div>
      ) : (
        <button onClick={toggleSidebarCollapse} className="absolute z-50 p-2 text-white bg-transparent rounded-md top-4 left-4 hover:text-blue-300">
          <MdMenuOpen size="1.625rem" />
        </button>
      )}

      <div className={sidebarContainerClasses}>
        <div className="flex items-center justify-center p-4 h-20 border-blue-600">
          {!isCollapsed && <Image src="/docflexLogo.png" alt="Expanded Logo" width={100} height={20} priority />}
        </div>

        <div className="flex flex-col h-[calc(100vh-80px)] overflow-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
          <ul className="space-y-1">{sidebarItems.map(renderSidebarItem)}</ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
