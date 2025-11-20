"use client";

import { useState, ChangeEvent } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";
import type { AuthUser } from "@/types/auth";
import { useUpdateUserMutation } from "@/lib/store/services/usersApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/slices/authSlice"; // MUST be named export

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [updateUser] = useUpdateUserMutation();

  /* --------------------------------------------
   * INITIAL FORM (safe default)
   * -------------------------------------------- */
  const initialFormState: Pick<AuthUser, "name" | "email"> = {
    name: user?.name ?? "",
    email: user?.email ?? "",
  };

  /* --------------------------------------------
   * HOOKS (must run before conditional return)
   * -------------------------------------------- */
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* --------------------------------------------
   * RETURN LOADING (after hooks)
   * -------------------------------------------- */
  if (!user) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading profile…
      </div>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* --------------------------------------------
   * SAVE HANDLER
   * -------------------------------------------- */
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const res = await updateUser({
        userId: user._id,
        body: {
          name: form.name,
          email: form.email,
        },
      }).unwrap();

      dispatch(setUser(res)); // MUST match your slice

      toast.success("Profile updated!");

      setIsSaving(false);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setIsEditing(false);
  };

  /* --------------------------------------------
   * UI
   * -------------------------------------------- */
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-purple-50 via-white to-purple-100 p-4 sm:p-6 lg:p-10">

      {/* Header */}
      <header className="mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Account Settings
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Manage and update your personal information
        </p>
      </header>

      <section className="w-full bg-white rounded-3xl border border-purple-200 p-6 sm:p-10 lg:p-12 shadow-sm">

        {/* PROFILE TOP */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">

          {/* Info */}
          <div className="text-center lg:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {user.name}
            </h2>

            <p className="text-purple-700 font-medium mt-1 text-base sm:text-lg">
              {user.email}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
              <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200 text-xs sm:text-sm">
                {user.role}
              </span>

              <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full border border-green-200 text-xs sm:text-sm">
                Active
              </span>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 sm:px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-base sm:text-lg font-medium transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-purple-300 to-transparent mb-10" />

        {/* FORM */}
        <div className="space-y-12 sm:space-y-16">

          {/* Personal Info */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-7 bg-purple-700 rounded-full" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm sm:text-base">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-2 w-full px-4 py-3 rounded-xl border text-sm sm:text-base transition ${
                    isEditing
                      ? "border-purple-300 bg-white focus:ring-2 focus:ring-purple-200"
                      : "border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm sm:text-base">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  disabled
                  className="mt-2 w-full px-4 py-3 rounded-xl border bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                />
              </div>

            </div>
          </section>

          {/* Account Info */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-7 bg-purple-700 rounded-full" />
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm sm:text-base">
                  Role
                </label>
                <input
                  disabled
                  value={user.role}
                  className="mt-2 w-full px-4 py-3 rounded-xl border bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm sm:text-base">
                  First Login Status
                </label>
                <input
                  disabled
                  value={user.isFirstLogin ? "Yes" : "No"}
                  className="mt-2 w-full px-4 py-3 rounded-xl border bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                />
              </div>

            </div>
          </section>

        </div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-4 mt-14 pt-8 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white rounded-xl transition text-sm sm:text-base"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
