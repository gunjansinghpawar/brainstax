"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  ArrowRightToLine,
  ArrowLeftToLine,
  NotepadText,
  Box,
  MessageSquareText,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";

// Static images
import homesvg from "@/assets/home.svg";
import project from "@/assets/project_management.svg";
import purchase from "@/assets/purchase.svg";
import sales from "@/assets/sales.svg";
import inventory from "@/assets/inventory.svg";
import manufacturing from "@/assets/manufacturing.svg";
import operations from "@/assets/operations.svg";
import accounting from "@/assets/accounting.svg";
import reports from "@/assets/reports.svg";
import logo from "@/assets/logo.svg";
import Full_logo from "@/assets/full-logo.svg";
import setting from "@/assets/settings.svg";
import store from "@/assets/store.svg";
import profile from "@/assets/profile.svg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const role = user?.role; // "superadmin" | "admin" | "companyadmin" | etc.
  const pathname = usePathname();

  /* 🔥 Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================================
     MENU ROLE RULES
  ================================= */
  const dropdownmenus = [
    {
      name: "Sales Order",
      icon: <NotepadText size={18} />,
      subMenus: [{ name: "Sales Quote" }, { name: "Customer" }],
    },
    {
      name: "Product",
      icon: <Box size={18} />,
      subMenus: [{ name: "Transfer" }, { name: "Adjustment" }, { name: "Count" }],
    },
    {
      name: "Purchase Order",
      icon: <MessageSquareText size={18} />,
      subMenus: [{ name: "Purchase Quote" }, { name: "Vendor" }],
    },
  ];
  const menuItems = [
    { name: "Home", icon: homesvg, path: "/dashboard" },

    { 
      name: "Project Management", 
      icon: project, 
      path: "/dashboard/project-management",
      roles: ["superadmin", "companyadmin"]
    },

    { 
      name: "Purchase", 
      icon: purchase, 
      path: "/dashboard/purchase",
      roles: ["superadmin", "companyadmin", "employee"]
    },

    { 
      name: "Sales", 
      icon: sales, 
      path: "/dashboard/sales",
      roles: ["superadmin", "companyadmin"]
    },

    { 
      name: "Inventory", 
      icon: inventory, 
      path: "/dashboard/inventory",
      roles: ["superadmin", "companyadmin"]
    },

    { 
      name: "Manufacturing", 
      icon: manufacturing, 
      path: "/dashboard/manufacturing",
      roles: ["superadmin"]
    },

    { 
      name: "Operations", 
      icon: operations, 
      path: "/dashboard/operations",
      roles: ["superadmin"]
    },

    { 
      name: "Accounting", 
      icon: accounting, 
      path: "/dashboard/accounting",
      roles: ["superadmin"]
    },

    { 
      name: "Reports", 
      icon: reports, 
      path: "/dashboard/reports",
      roles: ["superadmin", "companyadmin"]
    },

    { 
      name: "Company", 
      icon: store, 
      path: "/dashboard/company",
      roles: ["superadmin"]
    },

    { 
      name: "Employees", 
      icon: profile, 
      path: "/dashboard/employees",
      roles: ["superadmin", "companyadmin"]
    },
  ];

  const bottomItems = [
    { name: "Settings", icon: setting, path: "/dashboard/settings" },
    { name: "Store", icon: store, path: "/dashboard/store", roles: ["superadmin"] },
    { name: "Profile", icon: profile, path: "/dashboard/profile" },
  ];

  /* Filter menus based on user role */
  const allowedMenus = menuItems.filter(item =>
    !item.roles || item.roles.includes(role || "")
  );

  const allowedBottomMenus = bottomItems.filter(item =>
    !item.roles || item.roles.includes(role|| "")
  );

  /* ================================
     UI 
  ================================= */

  return (
    <div
      className={`
        h-screen bg-[#6A0DAD] text-white flex flex-col p-4
        transition-all duration-300 ease-out
        ${isOpen ? "w-[226px]" : "w-[74px]"}
      `}
    >

      {/* ---------- TOP LOGO ---------- */}
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        <div>
          {isOpen ? (
            <Image src={Full_logo} width={124} height={40} alt="Full logo" />
          ) : (
            <Image src={logo} width={20} height={20} alt="Collapsed logo" />
          )}
        </div>

        {isOpen ? (
          <button
            className="p-1 rounded-md hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <ArrowLeftToLine />
          </button>
        ) : (
          <button
            className="z-99 absolute w-[30px] h-[30px] right-[-30px] p-1 rounded-md bg-white text-purple-700 shadow-md hover:bg-white/80"
            onClick={() => setIsOpen(true)}
          >
            <ArrowRightToLine size={18} />
          </button>
        )}
      </div>

      {/* ---------- CREATE NEW BUTTON ---------- */}
      <div className="relative my-10 flex items-center justify-center" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`border border-purple-300 hover:bg-purple-900/40 
            transition p-2 rounded-md flex items-center w-full gap-3
            ${isOpen ? "justify-start" : "justify-center"}
          `}
        >
          <Plus size={18} />
          {isOpen && <span className="text-[14px]">Create New</span>}
        </button>

         {dropdownOpen && (
          <div
            className="
              absolute left-[110%] top-0 ml-3 w-72 bg-white text-black
              p-4 rounded-xl shadow-xl z-50  origin-top-left
              animate-scaleFade
            "
          >
            <h3 className="text-gray-500 text-sm mb-3">Create New</h3>

            {dropdownmenus.map((menu, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-200 text-purple-800 p-2 rounded-md">
                    {menu.icon}
                  </div>
                  <h4 className="font-semibold text-gray-700 text-lg">{menu.name}</h4>
                </div>

                <div className="ml-10 mt-2 flex flex-col gap-1">
                  {menu.subMenus.map((sub, j) => (
                    <div
                      key={j}
                      className="
                        flex items-center justify-between px-2 py-1 rounded-md
                        hover:bg-purple-100 cursor-pointer transition
                      "
                    >
                      <span className="text-[15px] text-gray-700">{sub.name}</span>
                      <Plus className="text-gray-400" size={18} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- MAIN MENU ---------- */}
      <div className="flex flex-col mt-4 gap-2">
        {allowedMenus.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <Link
              href={item.path}
              key={index}
              className={`flex items-center gap-4 p-2 rounded-md transition
                ${isOpen ? "justify-start" : "justify-center"}
                ${isActive ? "bg-[#490080]" : "hover:bg-[#490080]"}
              `}
            >
              <Image src={item.icon} width={20} height={20} alt={item.name} />
              {isOpen && <span className="text-[14px]">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* ---------- BOTTOM MENU ---------- */}
      <div className="mt-auto pt-4 border-t border-white/20 flex flex-col gap-3">
        {allowedBottomMenus.map((item, i) => {
          const isActive = pathname === item.path;

          return (
            <Link
              href={item.path}
              key={i}
              className={`flex items-center gap-3 p-2 rounded-md transition
                ${isOpen ? "justify-start" : "justify-center"}
                ${isActive ? "bg-purple-900" : "hover:bg-purple-800"}
              `}
            >
              <Image src={item.icon} width={20} height={20} alt={item.name} />
              {isOpen && <span className="text-[14px]">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
