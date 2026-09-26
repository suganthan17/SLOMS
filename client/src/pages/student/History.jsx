import { useState, useEffect } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentNavbar from "../../components/student/StudentNavbar";
import { Loader2, FileText } from "lucide-react";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-600",
  Approved: "bg-green-50 text-green-600",
  Rejected: "bg-red-50 text-red-600",
};

const outpassStatusStyles = {
  Active: "bg-blue-50 text-[#007EA7]",
  Outside: "bg-orange-50 text-orange-600",
  Completed: "bg-green-50 text-green-600",
};

function History() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("current");

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/leaves/my", {
          credentials: "include",
        });

        const data = await res.json();
        setLeaves(data.leaves || []);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();

    const interval = setInterval(fetchLeaves, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentLeaves = leaves.filter((leave) => leave.status === "Pending");

  const recentLeaves = leaves.filter((leave) => leave.status !== "Pending");

  const displayedLeaves = tab === "current" ? currentLeaves : recentLeaves;

  const formatDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <StudentSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <StudentNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">My Leave</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your leave requests and outpass activity.
          </p>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setTab("current")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === "current"
                  ? "bg-[#007EA7] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Currently Applied
            </button>

            <button
              onClick={() => setTab("recent")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === "recent"
                  ? "bg-[#007EA7] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Recent
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-gray-200 bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[#007EA7]" />
              </div>
            ) : displayedLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <FileText size={20} className="text-[#007EA7]" />
                </div>

                <h3 className="mt-3 text-sm font-semibold text-[#003459]">
                  No records found
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {tab === "current"
                    ? "You have no pending requests right now."
                    : "No approved or rejected leaves yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {displayedLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="flex items-start justify-between gap-4 px-6 py-5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#003459]">
                        {leave.reason}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDateTime(leave.fromDateTime)} -{" "}
                        {formatDateTime(leave.toDateTime)}
                      </p>

                      {leave.remarks && (
                        <p className="mt-1 text-xs text-gray-400">
                          Remarks: {leave.remarks}
                        </p>
                      )}

                      {leave.status === "Approved" && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium text-gray-400">
                              Outpass:
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                outpassStatusStyles[leave.outpassStatus] ||
                                "bg-blue-50 text-[#007EA7]"
                              }`}
                            >
                              {leave.outpassStatus || "Active"}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                Exit Time
                              </p>

                              <p className="mt-0.5 text-xs font-medium text-gray-700">
                                {leave.exitTime
                                  ? formatDateTime(leave.exitTime)
                                  : "Not exited yet"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                Entry Time
                              </p>

                              <p className="mt-0.5 text-xs font-medium text-gray-700">
                                {leave.entryTime
                                  ? formatDateTime(leave.entryTime)
                                  : "Not entered yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[leave.status] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {leave.status}
                    </span>
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

export default History;
