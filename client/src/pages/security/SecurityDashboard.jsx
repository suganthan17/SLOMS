import { useState, useEffect } from "react";
import SecuritySidebar from "../../components/security/SecuritySidebar";
import SecurityNavbar from "../../components/security/SecurityNavbar";
import { Users, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";

function SecurityDashboard() {
  const [outsideCount, setOutsideCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/security/outside", { credentials: "include" });
        const data = await res.json();
        setOutsideCount((data.leaves || []).length);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <SecuritySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SecurityNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Gate activity overview.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Students Currently Outside</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#003459]">
                    {loading ? "—" : outsideCount}
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Users size={20} className="text-[#007EA7]" />
                </div>
              </div>
            </div>

            <Link
              to="/security/scan"
              className="flex items-center justify-between rounded-lg border-2 border-[#007EA7] bg-white p-4 transition hover:bg-blue-50"
            >
              <div>
                <p className="text-sm font-semibold text-[#003459]">Scan a QR Code</p>
                <p className="mt-1 text-xs text-gray-500">Verify student exit or entry</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#007EA7]">
                <ScanLine size={20} className="text-white" />
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SecurityDashboard;