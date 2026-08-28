import { useState, useEffect } from "react";
import FacultySidebar from "../../components/faculty/FacultySidebar";
import FacultyNavbar from "../../components/faculty/FacultyNavbar";
import { Loader2, History as HistoryIcon, User } from "lucide-react";

const statusStyles = {
  Approved: "bg-green-50 text-green-600",
  Rejected: "bg-red-50 text-red-600",
};

function FacultyHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ status: filter });
        const res = await fetch(`/api/faculty/leaves/history?${params}`, {
          credentials: "include",
        });
        const data = await res.json();
        setLeaves(data.leaves || []);
      } catch (err) {
        console.error("Fetch faculty history error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [filter]);

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <FacultySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <FacultyNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">History</h1>
          <p className="mt-1 text-sm text-gray-500">
            Leave requests you've approved or rejected.
          </p>

          <div className="mt-5 flex gap-2">
            {["All", "Approved", "Rejected"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === opt
                    ? "bg-[#007EA7] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-gray-200 bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[#007EA7]" />
              </div>
            ) : leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <HistoryIcon size={20} className="text-[#007EA7]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#003459]">No records found</h3>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <div key={leave._id} className="flex items-start justify-between gap-4 px-6 py-4">
                    <div className="flex items-start gap-3">
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

                      <div>
                        <p className="text-sm font-semibold text-[#003459]">{leave.student?.name}</p>
                        <p className="text-xs text-gray-500">
                          {leave.student?.registerNumber} • {leave.student?.department}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">{leave.reason}</p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          {formatDateTime(leave.fromDateTime)} → {formatDateTime(leave.toDateTime)}
                        </p>
                        {leave.remarks && (
                          <p className="mt-1 text-[11px] text-gray-400">Remarks: {leave.remarks}</p>
                        )}
                      </div>
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

export default FacultyHistory;