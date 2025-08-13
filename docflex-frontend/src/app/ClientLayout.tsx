"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import { usePathname } from "next/navigation";
import ConnectionWarning from "@/components/Alerts/ConnectionWarnning";
import Loader from "@/components/Loader/Loader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const excludedPaths = ["/", "/forgotPassword", "/verifyPassword"];
  const showLayout = !excludedPaths.includes(pathname);

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full justify-center bg-blue-50">
      <div className="flex h-screen max-w-[2000px] w-full">
        {showLayout && <Sidebar onCollapseChange={setIsCollapsed} />}
        <div className="flex flex-col items-end flex-1 w-full min-w-0">
          {showLayout && <TopNavbar isCollapsed={isCollapsed} />}
          {/* <div
            className={`${
              showLayout
                ? isCollapsed
                  ? "lg:w-[calc(100%-90px)] sm:w-[calc(100%-90px)] w-full p-4"
                  : "w-[calc(100%-265px)] p-4"
                : "w-full"
            } flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200`}
          > */}
          <div
            className={`w-full flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200
    ${
      showLayout
        ? isCollapsed
          ? "lg:w-[calc(100%-90px)] p-4 "
          : "lg:w-[calc(100%-265px)] sm:w-[calc(100%-90px)] p-4"
        : "w-full"
    }
  `}
          >
            <ConnectionWarning />
               <Loader />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
