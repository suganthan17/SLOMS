import { useState, useEffect, useCallback } from "react";
import SecuritySidebar from "../../components/security/SecuritySidebar";
import SecurityNavbar from "../../components/security/SecurityNavbar";
import { Loader2, Users, User, RefreshCw } from "lucide-react";

function StudentsOutside() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOutside = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const res = await fetch("/api/security/outside", {
        credentials: "include",
      });
      const data = await res.json();
      setLeaves(data.leaves || []);
    } catch (err) {
      console.error("Fetch students outside error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOutside();

    // Auto-refresh every 10 seconds so the list stays live without manual action
    const interval = setInterval(() => {
      fetchOutside();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOutside]);

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <SecuritySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SecurityNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#003459]">
                Students Outside
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Students who have exited but not yet returned.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchOutside(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[#007EA7]" />
              </div>
            ) : leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Users size={20} className="text-[#007EA7]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#003459]">
                  All students are inside campus
                </h3>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="flex items-center gap-3 px-6 py-4"
                  >
                    {leave.student?.photoUrl ? (
                      <img
                        src={leave.student.photoUrl}
                        alt={leave.student.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <User size={16} className="text-[#007EA7]" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#003459]">
                        {leave.student?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {leave.student?.registerNumber} •{" "}
                        {leave.student?.department}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400">
                      Exited: {formatDateTime(leave.exitTime)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentsOutside;
