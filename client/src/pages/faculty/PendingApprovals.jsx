import { useState, useEffect } from "react";
import FacultySidebar from "../../components/faculty/FacultySidebar";
import FacultyNavbar from "../../components/faculty/FacultyNavbar";
import { Loader2, ClipboardCheck, User, Check, X } from "lucide-react";

function PendingApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [remarksMap, setRemarksMap] = useState({});

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faculty/leaves/pending", { credentials: "include" });
      const data = await res.json();
      setLeaves(data.leaves || []);
    } catch (err) {
      console.error("Fetch pending leaves error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (leaveId, action) => {
    setActioningId(leaveId);
    try {
      const res = await fetch(`/api/faculty/leaves/${leaveId}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ remarks: remarksMap[leaveId] || "" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to ${action} leave`);
      }

      setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
    } catch (err) {
      console.error(`${action} leave error:`, err);
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

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
          <h1 className="text-2xl font-bold text-[#003459]">Pending Approvals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and act on student leave requests.
          </p>

          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-20">
                <Loader2 size={24} className="animate-spin text-[#007EA7]" />
              </div>
            ) : leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <ClipboardCheck size={20} className="text-[#007EA7]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#003459]">No pending requests</h3>
                <p className="mt-1 text-xs text-gray-500">All caught up.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {leaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {leave.student?.photoUrl ? (
                          <img
                            src={leave.student.photoUrl}
                            alt={leave.student.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                            <User size={20} className="text-[#007EA7]" />
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-[#003459]">
                            {leave.student?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {leave.student?.registerNumber} • {leave.student?.department} • Year{" "}
                            {leave.student?.year} • Sec {leave.student?.section}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                        Pending
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Reason</p>
                        <p className="mt-0.5 text-sm text-gray-700">{leave.reason}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Duration</p>
                        <p className="mt-0.5 text-sm text-gray-700">
                          {formatDateTime(leave.fromDateTime)} → {formatDateTime(leave.toDateTime)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={remarksMap[leave._id] || ""}
                        onChange={(e) =>
                          setRemarksMap((prev) => ({ ...prev, [leave._id]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#007EA7]"
                      />
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(leave._id, "reject")}
                        disabled={actioningId === leave._id}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        <X size={15} />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(leave._id, "approve")}
                        disabled={actioningId === leave._id}
                        className="flex items-center gap-1.5 rounded-lg bg-[#007EA7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003459] disabled:opacity-60"
                      >
                        <Check size={15} />
                        {actioningId === leave._id ? "Processing..." : "Approve"}
                      </button>
                    </div>
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

export default PendingApprovals;