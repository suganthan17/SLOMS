import { Menu, ChevronDown, User } from "lucide-react";

const AdminNavbar = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Menu Button */}
      <button className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100">
        <Menu size={18} />
      </button>

      {/* Profile Section */}
      <div className="flex items-center">
        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-gray-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#007EA7]">
            <User size={14} className="text-white" />
          </div>

          <div className="leading-tight">
            <p className="text-xs font-semibold text-[#003459]">Admin</p>
            <p className="text-[10px] text-gray-400">Administrator</p>
          </div>

          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;