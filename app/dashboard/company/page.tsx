"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation
} from "@/lib/store/services/companyApi";

import toast from "react-hot-toast";
import { Building2, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { IDepartment, ICompany } from "@/types/company";
import AuthGuard from "@/lib/utils/authGuard";
import { DeleteModal } from "@/components/Modals/DeleteModal";
import { CompanyModal } from "@/components/dashboard/company/CompanyModal";

/* -------------------------------------------------------
   Types for Modal Props
------------------------------------------------------- */
export interface CompanyModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  form: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  admin?: {
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  };
  editMode?: boolean;

  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAdminChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  selectedDepartments: string[];
  setSelectedDepartments: (deps: string[]) => void;

  dropdownRef: React.RefObject<HTMLDivElement>;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;

  newDepartment: string;
  setNewDepartment: (v: string) => void;

  departmentOptions: string[];
}

export default function CompanyPage() {
  const { data, isLoading } = useGetCompaniesQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  
  const companies = data?.data ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  /* ------------------------------------------
     CREATE / UPDATE FORMS
  ------------------------------------------ */
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const [admin, setAdmin] = useState({
    adminName: "",
    adminEmail: "",
    adminPassword: ""
  });

  /* ------------------------------------------
     DEPARTMENTS
  ------------------------------------------ */
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const departmentOptions = ["HR", "IT", "Finance", "Operations", "Sales", "Support"];

  /* Close dropdown */
  useEffect(() => {
    const close = (e: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ------------------------------------------
     INPUT HANDLERS
  ------------------------------------------ */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdminChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAdmin({ ...admin, [e.target.name]: e.target.value });

  /* ------------------------------------------
     CREATE COMPANY
  ------------------------------------------ */
  const handleAddCompany = async (e: FormEvent) => {
    e.preventDefault();

    const departments: IDepartment[] = selectedDepartments.map((d) => ({
      name: d,
      description: ""
    }));

    try {
      await createCompany({
        ...form,
        ...admin,
        departments
      }).unwrap();

      toast.success("Company created successfully!");
      resetForms();
      setIsOpen(false);
    } catch {
      toast.error("Failed to create company");
    }
  };

  /* ------------------------------------------
     UPDATE COMPANY
  ------------------------------------------ */
  const handleUpdateCompany = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    const departments: IDepartment[] = selectedDepartments.map((d) => ({
      name: d,
      description: ""
    }));

    try {
      await updateCompany({
        id: selectedCompany._id!,
        body: { ...form, departments }
      }).unwrap();

      toast.success("Company updated!");
      resetForms();
      setEditOpen(false);
    } catch {
      toast.error("Failed to update company");
    }
  };

  /* ------------------------------------------
     DELETE COMPANY
  ------------------------------------------ */
  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;

    try {
      await deleteCompany(selectedCompany._id!).unwrap();
      toast.success("Company deleted");
      setDeleteConfirm(false);
      setSelectedCompany(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const resetForms = () => {
    setForm({ name: "", email: "", address: "", phone: "" });
    setAdmin({ adminName: "", adminEmail: "", adminPassword: "" });
    setSelectedDepartments([]);
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ------------------------------------------
     RENDER
  ------------------------------------------ */
  return (
    <AuthGuard roles={["superadmin", "admin"]}>
      <div className="min-h-screen w-full bg-gray-50 p-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="text-purple-600" size={36} />
            Company Management
          </h1>

          <button
            onClick={() => {
              resetForms();
              setIsOpen(true);
            }}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl flex items-center gap-2 transition"
          >
            <Plus size={20} /> Add Company
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies…"
            className="w-full pl-12 pr-4 py-3 rounded-xl border shadow-sm"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-md">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-100 text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Departments</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">Loading…</td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No companies found.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c._id} className="border-t hover:bg-purple-50 transition">
                    <td className="p-4">{c.name}</td>
                    <td className="p-4">{c.email}</td>
                    <td className="p-4">{c.phone}</td>

                    {/* FIXED: SAFE ADMIN RENDER */}
                    <td className="p-4">
                      {typeof c.companyAdmin === "object"
                        ? c.companyAdmin.name
                        : "—"}
                    </td>

                    <td className="p-4">
                      {c.departments.map((d) => d.name).join(", ")}
                    </td>

                    <td className="p-4">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 flex justify-center gap-3">
                      {/* EDIT */}
                      <button
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        onClick={() => {
                          setSelectedCompany(c);
                          setForm({
                            name: c.name,
                            email: c.email,
                            address: c.address,
                            phone: c.phone
                          });
                          setSelectedDepartments(c.departments.map((d) => d.name));
                          setEditOpen(true);
                        }}
                      >
                        <Pencil size={18} />
                      </button>

                      {/* DELETE */}
                      <button
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        onClick={() => {
                          setSelectedCompany(c);
                          setDeleteConfirm(true);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE MODAL */}
        {isOpen && (
          <CompanyModal
            title="Create New Company"
            onClose={() => setIsOpen(false)}
            onSubmit={handleAddCompany}
            form={form}
            admin={admin}
            handleAdminChange={handleAdminChange}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
            dropdownRef={dropdownRef}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            newDepartment={newDepartment}
            setNewDepartment={setNewDepartment}
            handleChange={handleChange}
            departmentOptions={departmentOptions}
          />
        )}

        {/* EDIT MODAL */}
        {editOpen && selectedCompany && (
          <CompanyModal
            title="Edit Company"
            editMode
            onClose={() => setEditOpen(false)}
            onSubmit={handleUpdateCompany}
            form={form}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
            dropdownRef={dropdownRef}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            newDepartment={newDepartment}
            setNewDepartment={setNewDepartment}
            handleChange={handleChange}
            departmentOptions={departmentOptions}
          />
        )}

        {/* DELETE CONFIRM MODAL */}
        {deleteConfirm && selectedCompany && (
          <DeleteModal
            name={selectedCompany.name}
            onCancel={() => setDeleteConfirm(false)}
            onConfirm={handleDeleteCompany}
          />
        )}
      </div>
    </AuthGuard>
  );
}


