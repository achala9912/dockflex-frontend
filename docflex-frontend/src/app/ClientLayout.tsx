"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import { usePathname } from "next/navigation";
import ConnectionWarning from "@/components/Alerts/ConnectionWarnning";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludedPaths = ["/", "/forgotPassword", "/resetPassword"];
  const showLayout = !excludedPaths.includes(pathname);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="flex h-screen max-w-[2000px] w-full">
        {showLayout && <Sidebar onCollapseChange={handleSidebarCollapseChange} />}
        <div className="flex flex-col items-end flex-1 min-w-0 mr-2">
          {showLayout && <TopNavbar />}
          <div
            className={`${
              showLayout
                ? isCollapsed
                  ? "lg:w-[calc(100%-80px)] sm:w-[calc(100%-80px)] w-full"
                  : "w-[calc(100%-256px)]"
                : "w-full"
            } flex-1 bg-blue-50 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200 ${
              showLayout ? "p-4" : ""
            }`}
          >
            <ConnectionWarning />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
