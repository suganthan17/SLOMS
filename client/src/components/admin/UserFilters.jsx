import { Search, RotateCcw, ChevronDown } from "lucide-react";

const roleOptions = ["All Roles", "Student", "Faculty", "Security"];
const departmentOptions = [
  "All Departments",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Security",
];
const statusOptions = ["All Status", "Active", "Inactive"];

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-8 text-sm text-gray-700 outline-none transition focus:border-[#007EA7]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function UserFilters({ filters, onChange }) {
  const handleReset = () => {
    onChange({ search: "", role: "all", department: "all", status: "all" });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email or ID"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#007EA7]"
          />
        </div>

        <Dropdown
          label="Role"
          options={roleOptions}
          value={filters.role}
          onChange={(val) => onChange({ ...filters, role: val })}
        />

        <Dropdown
          label="Department"
          options={departmentOptions}
          value={filters.department}
          onChange={(val) => onChange({ ...filters, department: val })}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(val) => onChange({ ...filters, status: val })}
        />

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}

export default UserFilters;