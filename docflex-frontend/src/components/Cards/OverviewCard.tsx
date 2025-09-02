"use client";

import React from "react";

interface OverviewCardProps {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  value?: string | number;
  className?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  icon,
  subtitle,
  value,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-5 p-4 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] ${className}`}
    >
      <div className="flex flex-col justify-center">
        <div>{icon}</div>
        <h2 className="mt-3 mb-1 text-sm font-inter">{subtitle}</h2>
        <h3 className="text-sm font-interMedium">{title}</h3>
      </div>

      <div className="flex justify-center text-2xl font-bold text-customRed font-interSemibold">
        {value}
      </div>
    </div>
  );
};

export default OverviewCard;
