"use client";

import React from "react";
import { IconType } from "react-icons";

interface RoundButtonProps {
    label?: string;
    icon: IconType;
    onClick: () => void;
    className?: string;
    iconSize?: string;
}

const RoundButton: React.FC<RoundButtonProps> = ({
    label,
    icon: Icon,
    onClick,
    className = "bg-gray-200",
    iconSize = "w-5 h-5",
}) => (
    <div className="flex flex-col items-center justify-center gap-1" onClick={onClick}>
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className={`${className} rounded-full p-2 shadow-lg border`}>
            <Icon className={`${iconSize} hover:cursor-pointer`} />
        </span>
    </div>
);

export default RoundButton;
