import { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, User } from "lucide-react";
import FacultyHelpModal from "./FacultyHelpModal";

function FacultyNavbar() {
  const [profile, setProfile] = useState(() => {
    const cached = sessionStorage.getItem("facultyProfile");
    return cached ? JSON.parse(cached) : null;
  });

  const [isHelpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        setProfile(data);
        sessionStorage.setItem("facultyProfile", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
        <div />

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
          >
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </button>

          <div className="h-8 w-px bg-gray-200" />

          <button
            type="button"
            className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-gray-50"
          >
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name || "Faculty"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007EA7]">
                <User size={18} className="text-white" />
              </div>
            )}

            <div className="leading-tight">
              <p className="text-sm font-semibold text-[#003459]">
                {profile?.name || "Faculty"}
              </p>

              <p className="text-xs text-gray-400">
                {profile?.designation || profile?.email || "Faculty"}
              </p>
            </div>

            <ChevronDown size={16} className="ml-1 text-gray-400" />
          </button>
        </div>
      </header>

      <FacultyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </>
  );
}

export default FacultyNavbar;
