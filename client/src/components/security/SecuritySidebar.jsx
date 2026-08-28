import { useState, useEffect } from "react";
import { LayoutDashboard, ScanLine, Users, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", path: "/security/dashboard", icon: LayoutDashboard },
  { title: "Scan QR", path: "/security/scan", icon: ScanLine },
  { title: "Students Outside", path: "/security/outside", icon: Users },
];

function SecuritySidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("securitySidebarCollapsed") === "true";
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const [profile, setProfile] = useState(() => {
    const cached = sessionStorage.getItem("securityProfile");
    return cached ? JSON.parse(cached) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("securitySidebarCollapsed", collapsed);
  }, [collapsed]);

  useEffect(() => {
    if (profile) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          sessionStorage.setItem("securityProfile", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      sessionStorage.removeItem("securityProfile");
      setLoggingOut(false);
      navigate("/");
    }
  };

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

      <div className={`relative z-10 flex flex-col items-center px-6 pt-8 pb-6 ${collapsed ? "px-0" : ""}`}>
        {profile?.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className={`rounded-full object-cover ${collapsed ? "h-11 w-11" : "h-20 w-20"}`}
          />
        ) : (
          <div className={`flex items-center justify-center rounded-full bg-[#007EA7] ${collapsed ? "h-11 w-11" : "h-20 w-20"}`}>
            <User size={collapsed ? 20 : 32} className="text-white" />
          </div>
        )}

        {!collapsed && profile && (
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-white">{profile.name}</p>
            <p className="mt-0.5 text-[11px] text-gray-300">{profile.shift} Shift</p>
          </div>
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
                } ${isActive ? "bg-[#007EA7] text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"}`
              }
            >
              <Icon size={19} className="shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="pointer-events-none absolute -bottom-10 -right-16 z-0 h-64 w-64">
        <div className="absolute inset-0 rounded-full border-[16px] border-[#00A8E8]/25" />
        <div className="absolute inset-8 rounded-full border-[16px] border-[#00A8E8]/30" />
        <div className="absolute inset-16 rounded-full border-[16px] border-[#00A8E8]/40" />
      </div>

      <div className={`relative z-10 border-t border-white/10 ${collapsed ? "mx-4" : "mx-6"}`} />

      <div className="relative z-10 px-4 py-6">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Logout" : undefined}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-red-500 disabled:opacity-60"
        >
          <LogOut size={19} className="shrink-0" />
          {!collapsed && (loggingOut ? "Logging out..." : "Logout")}
        </button>
      </div>
    </aside>
  );
}

export default SecuritySidebar;