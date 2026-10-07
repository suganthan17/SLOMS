import { useState, useEffect } from "react";
import FacultySidebar from "../../components/faculty/FacultySidebar";
import FacultyNavbar from "../../components/faculty/FacultyNavbar";
import { Clock, CheckCircle, XCircle } from "lucide-react";

function FacultyDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const [pendingRes, historyRes] = await Promise.all([
          fetch("/api/faculty/leaves/pending", {
            credentials: "include",
          }),
          fetch("/api/faculty/leaves/history", {
            credentials: "include",
          }),
        ]);

        const pendingData = await pendingRes.json();
        const historyData = await historyRes.json();

        if (!pendingRes.ok) {
          throw new Error(
            pendingData.message || "Failed to fetch pending leaves",
          );
        }

        if (!historyRes.ok) {
          throw new Error(
            historyData.message || "Failed to fetch leave history",
          );
        }

        const history = historyData.leaves || [];

        setStats({
          pending: (pendingData.leaves || []).length,
          approved: history.filter((leave) => leave.status === "Approved")
            .length,
          rejected: history.filter((leave) => leave.status === "Rejected")
            .length,
        });
      } catch (err) {
        console.error("Faculty dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <FacultySidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <FacultyNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of leave approvals.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Pending Approvals
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-[#003459]">
                    {loading ? "—" : stats.pending}
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <Clock size={20} className="text-amber-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Approved (all time)
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-[#003459]">
                    {loading ? "—" : stats.approved}
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Rejected (all time)
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-[#003459]">
                    {loading ? "—" : stats.rejected}
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <XCircle size={20} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FacultyDashboard;
