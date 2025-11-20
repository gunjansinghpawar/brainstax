import { CompanyModalProps } from "@/app/dashboard/company/page";
import { X } from "lucide-react";

export function CompanyModal({
  title,
  onClose,
  onSubmit,
  form,
  admin,
  editMode,
  handleChange,
  handleAdminChange,
  selectedDepartments,
  setSelectedDepartments,
  dropdownOpen,
  setDropdownOpen,
  newDepartment,
  setNewDepartment,
  dropdownRef,
  departmentOptions,
}: CompanyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-999 animate-[fadeIn_.2s_ease]">
      
      {/* Modal Box */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto animate-[slideUp_.25s_ease-out]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 bg-linear-to-r from-purple-700 to-purple-600 text-white rounded-t-2xl shadow">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-white/80 text-sm mt-1">Manage company details and structure</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-7 space-y-12">
          
          {/* ============================
              COMPANY DETAILS
          ============================= */}
          <section className="bg-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-purple-700"></span>
              Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Company Name"
                className="input-field"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="Corporate Email"
                className="input-field"
              />

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full Address"
                className="input-field sm:col-span-2"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input-field"
              />
            </div>
          </section>

          {/* ============================
              ADMIN BLOCK (CREATE ONLY)
          ============================= */}
          {!editMode && admin && handleAdminChange && (
            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-blue-600"></span>
                Admin User
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  name="adminName"
                  value={admin.adminName}
                  onChange={handleAdminChange}
                  placeholder="Admin Name"
                  required
                  className="input-field"
                />

                <input
                  name="adminEmail"
                  value={admin.adminEmail}
                  onChange={handleAdminChange}
                  type="email"
                  placeholder="Admin Email"
                  required
                  className="input-field"
                />

                <input
                  name="adminPassword"
                  value={admin.adminPassword}
                  onChange={handleAdminChange}
                  type="password"
                  placeholder="Temporary Password"
                  required
                  className="input-field sm:col-span-2"
                />
              </div>
            </section>
          )}

          {/* ============================
              DEPARTMENTS SECTION
          ============================= */}
          <section ref={dropdownRef} className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-green-600"></span>
              Departments
            </h3>

            {/* Selected Chips + Input */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full border rounded-xl bg-white p-3 min-h-[54px] flex flex-wrap gap-2 cursor-pointer shadow-sm"
            >
              {selectedDepartments.map((d) => (
                <span
                  key={d}
                  className="bg-purple-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                >
                  {d}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDepartments(selectedDepartments.filter((x) => x !== d));
                    }}
                    className="text-white hover:text-gray-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Add Department"
                className="flex-1 outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const dep = newDepartment.trim();
                    if (!dep) return;

                    if (!selectedDepartments.includes(dep)) {
                      setSelectedDepartments([...selectedDepartments, dep]);
                    }
                    setNewDepartment("");
                  }
                }}
              />
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="bg-white border rounded-xl shadow-md mt-2 max-h-48 overflow-y-auto animate-[fadeIn_.2s_ease]">
                {departmentOptions
                  .filter((dep) => !selectedDepartments.includes(dep)) // 🔥 remove selected
                  .map((dep) => (
                    <div
                      key={dep}
                      onClick={() => {
                        setSelectedDepartments([...selectedDepartments, dep]);
                        setDropdownOpen(false); // close after selecting
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
                    >
                      {dep}
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* ============================
              BUTTONS
          ============================= */}
          <div className="flex justify-end gap-4 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white shadow transition font-medium"
            >
              {editMode ? "Update Company" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
