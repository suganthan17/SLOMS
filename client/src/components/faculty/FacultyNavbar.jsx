import { useState, useEffect } from "react";
import { Menu, Bell, ChevronDown, User } from "lucide-react";

function FacultyNavbar() {
  const [profile, setProfile] = useState(() => {
    const cached = sessionStorage.getItem("facultyProfile");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (profile) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          sessionStorage.setItem("facultyProfile", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      <button className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100">
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-5">
        <button className="relative rounded-xl bg-gray-100 p-2.5 text-gray-600 transition hover:bg-gray-200">
          <Bell size={20} />
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50">
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007EA7]">
              <User size={18} className="text-white" />
            </div>
          )}

          <div className="leading-tight">
            <p className="text-sm font-semibold text-[#003459]">{profile?.name || "Faculty"}</p>
            <p className="text-xs text-gray-400">{profile?.designation || "Faculty"}</p>
          </div>

          <ChevronDown size={16} className="ml-1 text-gray-400" />
        </div>
      </div>
    </header>
  );
}

export default FacultyNavbar;