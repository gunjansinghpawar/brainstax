"use client";

import Image from "next/image";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import logo from "@/assets/full-logo.svg";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  useLoginMutation,
  useChangePasswordMutation
} from "@/lib/store/services/authApi";
import { setCredentials } from "@/lib/store/slices/authSlice";

import { Eye, EyeOff } from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, token } = useAppSelector((s) => s.auth);

  const [login, { isLoading }] = useLoginMutation();
  const [changePassword] = useChangePasswordMutation();

  /* -----------------------------------------------------------
    LOCAL FORM STATE
  ----------------------------------------------------------- */
  const [form, setForm] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const firstLoginModal = Boolean(user && token && user.isFirstLogin);

  /* -----------------------------------------------------------
    REDIRECT NORMAL USERS TO DASHBOARD
  ----------------------------------------------------------- */
  useEffect(() => {
    if (user && token && !user.isFirstLogin) {
      router.replace("/dashboard");
    }
  }, [user, token, router]);

  /* -----------------------------------------------------------
    SAFE ERROR FORMATTER
  ----------------------------------------------------------- */
  const formatError = (err: unknown): string => {
    const e = err as FetchBaseQueryError | SerializedError;

    if (e && typeof e === "object" && "data" in e && e.data) {
      const data = e.data as { message?: string };
      return data.message ?? "Something went wrong";
    }

    if ("message" in (e as SerializedError)) {
      return (e as SerializedError).message ?? "Unexpected error";
    }

    return "Unexpected error occurred";
  };

  /* -----------------------------------------------------------
    INPUT HANDLER
  ----------------------------------------------------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* -----------------------------------------------------------
    LOGIN HANDLER
  ----------------------------------------------------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(form).unwrap();
      toast.success(res.message);

      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token
        })
      );

      if (!res.data.user.isFirstLogin) {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(formatError(err));
    }
  };

  /* -----------------------------------------------------------
    PASSWORD UPDATE HANDLER (FIRST LOGIN)
  ----------------------------------------------------------- */
  const handlePasswordUpdate = async () => {
    if (!newPassword.trim()) return toast.error("Enter a new password");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const res = await changePassword({ newPassword }).unwrap();
      toast.success(res.message);

      if (user && token) {
        dispatch(
          setCredentials({
            user: { ...user, isFirstLogin: false },
            token
          })
        );
      }

      router.push("/dashboard");
    } catch (err) {
      toast.error(formatError(err));
    }
  };

  /* -----------------------------------------------------------
    UI
  ----------------------------------------------------------- */
  return (
    <>
      {/* LOGIN SCREEN */}
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

          <div className="bg-[#6A0DAD] py-6 px-8 flex justify-center">
            <Image src={logo} width={160} height={50} alt="Logo" />
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>

              {/* Password + Eye */}
              <div className="flex flex-col gap-1">
                <label>Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setPasswordVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6A0DAD] text-white py-2 rounded-lg"
              >
                {isLoading ? "Logging in…" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* FIRST LOGIN PASSWORD CHANGE MODAL                                      */}
      {/* ======================================================================= */}

      {firstLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-semibold text-gray-800 text-center">
              First Login – Set a New Password
            </h2>

            {/* New Password */}
            <div className="mt-4">
              <label>New Password</label>
              <div className="relative">
                <input
                  type={modalPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg pr-12"
                />

                <button
                  type="button"
                  onClick={() => setModalPasswordVisible((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {modalPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
              <label>Confirm Password</label>
              <div className="relative">
                <input
                  type={modalConfirmVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg pr-12"
                />

                <button
                  type="button"
                  onClick={() => setModalConfirmVisible((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {modalConfirmVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handlePasswordUpdate}
              className="w-full mt-5 bg-[#6A0DAD] text-white py-2 rounded-lg"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </>
  );
}
