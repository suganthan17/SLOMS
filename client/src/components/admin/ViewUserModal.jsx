import { X, Loader2, User } from "lucide-react";
import { useState, useEffect } from "react";

const roleFieldLabels = {
  Student: [
    { key: "registerNumber", label: "Register Number" },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    { key: "section", label: "Section" },
  ],
  Faculty: [
    { key: "facultyId", label: "Faculty ID" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
  ],
  Security: [
    { key: "employeeId", label: "Employee ID" },
    { key: "shift", label: "Shift" },
  ],
};

function ViewUserModal({ isOpen, onClose, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError("");
      setUser(null);
      try {
        const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const roleFields = user ? roleFieldLabels[user.role] || [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#003459]">User Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#007EA7]" />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          ) : user ? (
            <>
              <div className="mb-6 flex items-center gap-4">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <User size={28} className="text-[#007EA7]" />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-[#003459]">{user.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#007EA7]">
                      {user.role}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Contact Information
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem label="Email" value={user.email} />
                  <DetailItem label="Phone" value={user.phone} />
                  <DetailItem label="Username" value={user.username} />
                </div>
              </div>

              {roleFields.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {user.role} Details
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {roleFields.map((field) => (
                      <DetailItem key={field.key} label={field.label} value={user[field.key]} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 border-t border-gray-100 pt-4">
                <DetailItem
                  label="Created On"
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"
                  }
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-700">{value || "—"}</p>
    </div>
  );
}

export default ViewUserModal;