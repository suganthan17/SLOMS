import { useState, useEffect } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentNavbar from "../../components/student/StudentNavbar";
import OutpassDetailModal from "../../components/student/OutpassDetailModal";
import { Loader2, IdCard } from "lucide-react";

function Outpass() {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutpass, setSelectedOutpass] = useState(null);
  const [profile, setProfile] = useState(() => {
    const cached = sessionStorage.getItem("studentProfile");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const fetchOutpasses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/leaves/my/outpasses", { credentials: "include" });
        const data = await res.json();
        setOutpasses(data.leaves || []);
      } catch (err) {
        console.error("Outpass fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOutpasses();
  }, []);

  useEffect(() => {
    if (profile) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          sessionStorage.setItem("studentProfile", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [profile]);

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <StudentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StudentNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">Outpass</h1>
          <p className="mt-1 text-sm text-gray-500">
            Approved leaves automatically appear here as usable outpasses. Tap a card to view the QR.
          </p>

          {loading ? (
            <div className="mt-6 flex items-center justify-center rounded-xl border border-gray-200 bg-white py-20">
              <Loader2 size={24} className="animate-spin text-[#007EA7]" />
            </div>
          ) : outpasses.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <IdCard size={20} className="text-[#007EA7]" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#003459]">No active outpasses</h3>
              <p className="mt-1 text-xs text-gray-500">
                Once a leave is approved by faculty, it will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {outpasses.map((pass) => (
                <button
                  type="button"
                  key={pass._id}
                  onClick={() => setSelectedOutpass(pass)}
                  className="rounded-xl border-2 border-[#007EA7] bg-white p-5 text-left transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      Approved
                    </span>
                    <span className="text-[11px] text-gray-400">
                      ID: {pass._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#003459]">{pass.reason}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDateTime(pass.fromDateTime)} - {formatDateTime(pass.toDateTime)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <OutpassDetailModal
        isOpen={!!selectedOutpass}
        onClose={() => setSelectedOutpass(null)}
        outpass={selectedOutpass}
        profile={profile}
      />
    </div>
  );
}

export default Outpass;