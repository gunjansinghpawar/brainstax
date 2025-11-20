"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, UsersRound } from "lucide-react";
import toast from "react-hot-toast";

import AuthGuard from "@/lib/utils/authGuard";
import { useAuth } from "@/lib/hooks/useAuth";

import {
  useGetCompaniesQuery,
  useGetCompanyEmployeesQuery,
  useAddEmployeeMutation,
  useRemoveEmployeeMutation,
} from "@/lib/store/services/companyApi";

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/lib/store/services/usersApi";

import { EmployeeModal } from "@/components/dashboard/employee/EmployeeModal";
import { DeleteModal } from "@/components/Modals/DeleteModal";
import type { IEmployee } from "@/types/employee";

export default function EmployeePage() {
  const { user } = useAuth();

  // ======================================================
  // COMPANY AUTO-SELECTION FOR COMPANY ADMIN
  // ======================================================
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    if (user?.role === "companyadmin") {
      const companyId = user?.companies?.[0] || "";
      if (companyId && selectedCompanyId !== companyId) {
        setSelectedCompanyId(companyId);
      }
    }
  }, [user, selectedCompanyId]);

  // ====================================================== 
  // STATE
  // ======================================================
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const departmentOptions = ["HR", "Finance", "IT", "Operations", "Sales", "Support"];

  // ======================================================
  // QUERIES
  // ======================================================
  const { data: companiesData } = useGetCompaniesQuery();

  const visibleCompanies =
    user?.role === "companyadmin"
      ? companiesData?.data?.filter((c) => user.companies?.includes(c._id)) ?? []
      : companiesData?.data ?? [];

  const { data: employeesResp } = useGetCompanyEmployeesQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const employees = employeesResp?.data ?? [];

  const editUserId = selectedEmployee?.userId?._id ?? "";
  const { data: userDetails } = useGetUserByIdQuery(editUserId, {
    skip: !editUserId,
  });

  // ======================================================
  // MUTATIONS
  // ======================================================
  const [addEmployee] = useAddEmployeeMutation();
  const [removeEmployee] = useRemoveEmployeeMutation();
  const [updateUser] = useUpdateUserMutation();

  // ======================================================
  // SYNC EDIT FORM WHEN DATA ARRIVES
  // ======================================================
  useEffect(() => {
    if (selectedEmployee && userDetails?.data) {
      setForm({
        name: userDetails.data.name || "",
        email: userDetails.data.email || "",
        password: "",
        department: selectedEmployee.department || "",
      });
    }
  }, [selectedEmployee, userDetails]);

  // ======================================================
  // INPUT HANDLERS
  // ======================================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ======================================================
  // SUBMIT HANDLER
  // ======================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedEmployee) {
        await updateUser({
          userId: selectedEmployee.userId._id,
          body: {
            name: form.name,
            email: form.email,
          },
        }).unwrap();

        toast.success("Employee updated!");
      } else {
        await addEmployee({
          companyId: selectedCompanyId,
          body: {
            user: {
              name: form.name,
              email: form.email,
              password: form.password,
            },
            department: form.department,
          },
        }).unwrap();

        toast.success("Employee added!");
      }

      setModalOpen(false);
      setSelectedEmployee(null);
      setForm({ name: "", email: "", password: "", department: "" });

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // ======================================================
  // DELETE EMPLOYEE
  // ======================================================
  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await removeEmployee({
        companyId: selectedCompanyId,
        employeeId: selectedEmployee._id,
      }).unwrap();

      toast.success("Employee removed!");
      setDeleteOpen(false);
      setSelectedEmployee(null);
    } catch {
      toast.error("Failed to remove employee.");
    }
  };

  // ======================================================
  // FILTER
  // ======================================================
  const filteredEmployees = employees.filter((emp) =>
    emp?.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ======================================================
  // UI
  // ======================================================
  return (
    <AuthGuard roles={["superadmin", "admin", "companyadmin"]}>
      <div className="p-6 sm:p-8 min-h-screen bg-gray-50 space-y-6">

        {/* COMPANY SELECTOR */}
        <div>
          <select
            className="input-field w-full max-w-md"
            value={selectedCompanyId}
            disabled={user?.role === "companyadmin"}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
          >
            <option value="">Select Company</option>
            {visibleCompanies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3">
            <UsersRound className="text-purple-700" size={32} />
            Employee Management
          </h1>

          <button
            disabled={!selectedCompanyId}
            onClick={() => {
              setSelectedEmployee(null);
              setForm({ name: "", email: "", password: "", department: "" });
              setModalOpen(true);
            }}
            className="px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl flex items-center gap-2 transition disabled:opacity-40"
          >
            <Plus size={20} /> Add Employee
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border shadow-sm bg-white"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-purple-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="border-t hover:bg-purple-50 transition">
                  <td className="p-4">{emp.userId?.name ?? "—"}</td>
                  <td className="p-4">{emp.department ?? "—"}</td>

                  <td className="p-4 flex justify-center gap-3">

                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setModalOpen(true);
                      }}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                    >
                      ✏️
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setDeleteOpen(true);
                      }}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500 italic">
                    No employees found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <EmployeeModal
            title={selectedEmployee ? "Edit Employee" : "Add Employee"}
            onClose={() => {
              setModalOpen(false);
              setSelectedEmployee(null);
              setForm({ name: "", email: "", password: "", department: "" });
            }}
            onSubmit={handleSubmit}
            form={form}
            handleChange={handleChange}
            departmentOptions={departmentOptions}
            isEditing={!!selectedEmployee}
          />
        )}

        {/* DELETE MODAL */}
        {deleteOpen && selectedEmployee && (
          <DeleteModal
            name={selectedEmployee?.userId?.name}
            onCancel={() => {
              setDeleteOpen(false);
              setSelectedEmployee(null);
            }}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </AuthGuard>
  );
}
