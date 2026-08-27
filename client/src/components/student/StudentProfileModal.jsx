import { X, User } from "lucide-react";

function StudentProfileModal({ isOpen, onClose, profile }) {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#003459]">My Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-6 flex items-center gap-4">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <User size={28} className="text-[#007EA7]" />
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-[#003459]">{profile.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#007EA7]">
                  {profile.role}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    profile.status === "Active"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {profile.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Contact Information
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Email" value={profile.email} />
              <DetailItem label="Phone" value={profile.phone} />
              <DetailItem label="Username" value={profile.username} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Academic Details
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Register Number" value={profile.registerNumber} />
              <DetailItem label="Department" value={profile.department} />
              <DetailItem label="Year" value={profile.year} />
              <DetailItem label="Section" value={profile.section} />
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <DetailItem
              label="Account Created"
              value={
                profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </div>
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

export default StudentProfileModal;