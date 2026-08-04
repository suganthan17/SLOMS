import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  UserCircle,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Reports",
    path: "/admin/reports",
    icon: FileBarChart2,
  },
  {
    title: "Profile",
    path: "/admin/profile",
    icon: UserCircle,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col overflow-hidden bg-[#003459] transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-9 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#007EA7] text-white shadow-md transition hover:bg-[#00A8E8]"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`relative z-10 px-6 pt-7 pb-6 ${
          collapsed ? "flex justify-center px-0" : ""
        }`}
      >
        {collapsed ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#007EA7]">
            <GraduationCap size={22} className="text-white" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-wide text-white">
              BIT
            </h1>
            <p className="mt-1 text-[12px] leading-tight text-gray-300">
              Smart Leave & Outpass
              <br />
              Management System
            </p>
          </>
        )}
      </div>

      <div className={`relative z-10 border-t border-white/10 ${collapsed ? "mx-4" : "mx-6"}`} />

      <div className="relative z-10 flex-1 px-4 pt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              title={collapsed ? item.title : undefined}
              className={({ isActive }) =>
                `mb-1.5 flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  collapsed ? "justify-center px-0" : ""
                } ${
                  isActive
                    ? "bg-[#007EA7] text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Decorative rings */}
      <div className="pointer-events-none absolute -bottom-10 -right-16 z-0 h-64 w-64">
        <div className="absolute inset-0 rounded-full border-[16px] border-[#00A8E8]/25" />
        <div className="absolute inset-8 rounded-full border-[16px] border-[#00A8E8]/30" />
        <div className="absolute inset-16 rounded-full border-[16px] border-[#00A8E8]/40" />
      </div>

      <div className={`relative z-10 border-t border-white/10 ${collapsed ? "mx-4" : "mx-6"}`} />

      <div className="relative z-10 px-4 py-6">
        <button
          title={collapsed ? "Logout" : undefined}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-white"
        >
          <LogOut size={19} className="shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;