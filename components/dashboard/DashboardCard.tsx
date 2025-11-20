"use client";

import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import projectBg from "@/assets/project-bg.png";

interface DashboardCardProps {
  icon: string;          // Path to static asset
  title: string;
  items: string[];
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, items }) => {
  const showBackgroundImage = title === "Project Management";
  
  return (
    <div
      className="
        group relative w-full h-full bg-white 
        rounded-xl border border-gray-200 shadow-sm 
        transition-all duration-300 
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] 
        hover:-translate-y-1 overflow-hidden
      "
    >
      {/* Header */}
      <div className="bg-[#6A0DAD] text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
        <h3 className="flex items-center gap-3">
          <Image
            src={icon}
            alt={title}
            width={20}
            height={20}
            className="object-contain"
          />
          <span className="text-[15px] font-medium">{title}</span>
        </h3>

        <button
          className="
            w-8 h-8 flex items-center justify-center rounded-full 
            bg-white/15 hover:bg-white/30 
            transition cursor-pointer text-white
          "
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Items */}
      <ul className="relative z-10 px-4 py-4 space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center font-normal gap-2 text-[14px] text-gray-700"
          >
            <ArrowRight
              size={16}
              className="
                text-black 
                transition-all duration-200 
                group-hover:text-[#6A0DAD]
              "
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Background Illustration */}
      {showBackgroundImage && (
        <Image
          src={projectBg}
          alt="background"
          width={130}
          height={130}
          className="
            absolute bottom-0 right-1 
            opacity-20 w-28 sm:w-32
            group-hover:opacity-70 
            select-none pointer-events-none
          "
        />
      )}
    </div>
  );
};

export default DashboardCard;
