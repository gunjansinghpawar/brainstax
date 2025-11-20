"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import Sidebar from "@/components/main/Sidebar";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";

import profile from "@/assets/profiles.svg";

import { useAuth } from "@/lib/hooks/useAuth";
import AuthGuard from "@/lib/utils/authGuard";
import { logout } from "@/lib/store/slices/authSlice";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useAuth(); // ✅ perfectly typed

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto">

          {/* TOP BAR */}
          <div
            className="
              flex flex-wrap-reverse md:flex-nowrap 
              md:items-center md:justify-between
              gap-4 md:gap-0
              bg-white py-4 px-4 sm:px-6 lg:px-10 rounded-xl
              sticky top-0 z-20 border-b border-gray-200
            "
          >
            {/* Search */}
            <div className="relative w-full sm:w-72 md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search"
                className="
                  w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm
                "
              />
            </div>

            {/* User Section */}
            {user && (
              <div
                className="flex items-center gap-3 w-full md:w-auto justify-end relative"
                ref={dropdownRef}
              >
                {/* Bell */}
                <div className="relative cursor-pointer">
                  <Bell className="text-gray-600" size={22} />
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </div>

                {/* Avatar */}
                <Image
                  src={profile}
                  alt="user"
                  className="rounded-full bg-gray-200"
                  width={40}
                  height={40}
                />

                {/* Name + Email */}
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-700">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition"
                >
                  <ChevronDown className="text-gray-600" size={20} />
                </button>

                {/* Dropdown */}
                {open && (
                  <div
                    className="
                      absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl 
                      border border-gray-200 py-2 z-50
                    "
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        router.push("/dashboard/profile");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm transition"
                    >
                      <User size={16} />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        router.push("/dashboard/settings");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm transition"
                    >
                      <Settings size={16} />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-red-600 text-sm transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Page Content */}
          {children}

          {/* Footer */}
          <div
            className="
              sticky bottom-0 w-full bg-gray-50 
              border-t border-gray-300 py-4 px-4
              sm:px-6 lg:px-10 flex flex-col sm:flex-row justify-between
              text-gray-500 text-sm
            "
          >
            <p>© copyright @gunjanpawar 2025 | All Rights Reserved</p>

            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Terms & Conditions</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
