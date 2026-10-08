import { useState, useEffect } from "react";
import {
  HelpCircle,
  ChevronDown,
  User,
  Lock,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyHelpModal from "./FacultyHelpModal";
import FacultyProfileModal from "./FacultyProfileModal";
import { useToast } from "../../context/ToastContext";

function FacultyNavbar() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(() => {
    const cached = sessionStorage.getItem("facultyProfile");
    return cached ? JSON.parse(cached) : null;
  });

  const [isHelpOpen, setHelpOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        setProfile(data);
        sessionStorage.setItem(
          "facultyProfile",
          JSON.stringify(data)
        );
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to logout"
        );
      }

      sessionStorage.removeItem("facultyProfile");

      showToast({
        type: "success",
        title: "Logged Out",
        message: "You have been logged out successfully.",
      });

      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      showToast({
        type: "error",
        title: "Logout Failed",
        message:
          err.message ||
          "Something went wrong while logging out.",
      });
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };

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

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!isMenuOpen)}
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
                  {profile?.designation ||
                    profile?.email ||
                    "Faculty"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`ml-1 text-gray-400 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-14 z-50 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <User
                    size={17}
                    className="text-[#007EA7]"
                  />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/change-password");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <Lock
                    size={17}
                    className="text-[#007EA7]"
                  />
                  Change Password
                </button>

                <div className="border-t border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={17} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <FacultyProfileModal
        isOpen={isProfileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
      />

      <FacultyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </>
  );
}

export default FacultyNavbar;