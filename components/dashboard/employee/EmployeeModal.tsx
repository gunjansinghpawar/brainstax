"use client";

import { X } from "lucide-react";

interface EmployeeModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    name: string;
    email: string;
    password: string;
    department: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  departmentOptions: string[];
  isEditing: boolean;
}

export function EmployeeModal({
  title,
  onClose,
  onSubmit,
  form,
  handleChange,
  departmentOptions,
  isEditing,
}: EmployeeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-999">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center px-6 py-4 bg-purple-700 text-white rounded-t-2xl">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="input-field"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="input-field"
            />

            {!isEditing && (
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="input-field"
              />
            )}

            <select
              name="department"
              className="input-field"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>

          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
