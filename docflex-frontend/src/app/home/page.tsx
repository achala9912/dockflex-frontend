"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Clock, FileText, Users } from "lucide-react";
import systhesisLottie from "@/Lottie/prescriptionLottie.json";
import OverviewCard from "@/components/Cards/OverviewCard";
import { useAuthStore } from "@/store/authStore";
import { getDashboardData } from "@/api/dashboardApi";

function Home() {
  const [greeting, setGreeting] = useState("");
  const [isSpecialDay, setIsSpecialDay] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    currentDateTotalAppointments: 0,
    currentDateTotalPrescriptions: 0,
  });

  const user = useAuthStore((state) => state.user);
  const userName = user?.name;
  const centerId = user?.centerId;

  const isSingleCenter = typeof centerId === "string"; 
  const hasValidCenter = isSingleCenter && centerId !== null; 

  useEffect(() => {
    if (hasValidCenter) {
      getDashboardData({ centerId })
        .then((res) => {
          if (res.success) {
            setDashboardData(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch dashboard data", err);
        });
    }
  }, [centerId, hasValidCenter]);

  // Greeting Logic
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const getSpecialDayGreeting = (date: Date) => {
      const month = date.getMonth();
      const day = date.getDate();

      if (month === 0 && day === 1) return "Happy New Year! 🎉";
      if (month === 3 && (day === 13 || day === 14))
        return "Happy Sinhala & Tamil New Year! 🌺";
      if (month === 1 && day === 4) return "Happy Independence Day! 🎉";
      if (month === 8 && day === 25) return "Happy Pharmacist Day! 💊";
      if (month === 9 && day === 1) return "Happy Children's Day! 🧒";
      if (month === 11 && day === 25) return "Merry Christmas! 🎄";

      return null;
    };

    const specialDayGreeting = getSpecialDayGreeting(now);

    if (specialDayGreeting) {
      setGreeting(specialDayGreeting);
      setIsSpecialDay(true);
    } else {
      setIsSpecialDay(false);
      if (currentHour >= 3 && currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting("Good Afternoon");
      } else if (currentHour >= 0 && currentHour < 3) {
        setGreeting("Good Night");
      } else {
        setGreeting("Good Evening");
      }
    }
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <header className="relative flex items-center justify-between px-4 py-6 mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="z-10">
          <h2 className="mb-2 text-2xl font-bold text-gray-800 font-inter">
            {isSpecialDay ? greeting : `${greeting}, ${userName}! 🎉`}
          </h2>
          <p className="text-gray-600 text-md font-inter">
            Welcome back to{" "}
            <span className="font-semibold text-blue-500">Docflex Pro</span>.
            <span className="block mt-1 text-sm text-gray-500">
              Let’s make today{" "}
              <span className="font-medium text-green-500">productive</span> and{" "}
              <span className="font-medium text-yellow-500">stress-free</span>.
            </span>
          </p>
        </div>
        <Lottie
          animationData={systhesisLottie}
          loop
          autoplay
          className="w-48 h-48"
        />
        <div className="absolute w-32 h-32 bg-blue-100 rounded-full opacity-50 -top-10 -right-10 blur-2xl"></div>
        <div className="absolute w-48 h-48 bg-blue-200 rounded-full opacity-50 -bottom-8 -left-12 blur-2xl"></div>
      </header>

      <main className="flex-grow">
        {hasValidCenter && (
          <section className="grid grid-cols-1 gap-6 mb-2 md:grid-cols-3">
            <OverviewCard
              title="Total Patients"
              subtitle="Registered"
              value={dashboardData.totalPatients.toString()}
              className="h-full bg-white border-l-8 border-blue-500"
              icon={<Users className="w-8 h-8 text-blue-500" />}
            />
            <OverviewCard
              title="Total Appointments"
              subtitle="Today"
              value={dashboardData.currentDateTotalAppointments.toString()}
              className="h-full bg-white border-l-8 border-yellow-500"
              icon={<Clock className="w-8 h-8 text-yellow-500" />}
            />
            <OverviewCard
              title="Total Prescriptions"
              subtitle="Today"
              value={dashboardData.currentDateTotalPrescriptions.toString()}
              className="h-full bg-white border-l-8 border-green-500"
              icon={<FileText className="w-8 h-8 text-green-500" />}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;
