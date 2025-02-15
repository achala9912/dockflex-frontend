// app/ClientLayout.tsx (client component)
"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import TopNavbar from "@/components/Navbar/Navbar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludedPaths = ["/", "/forgotPassword", "/resetPassword"];
  const showLayout = !excludedPaths.includes(pathname);

  return (
    <div className="flex">
      {showLayout && <Sidebar onCollapseChange={() => {}} />}
      <div className="flex flex-col w-full">
        {showLayout && <TopNavbar />}
        <main>{children}</main>
      </div>
    </div>
  );
}
