import {
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  IdCard,
  Clock,
  CalendarDays,
} from "lucide-react";

function SecurityProfileModal({ isOpen, onClose, profile }) {
  if (!isOpen || !profile) return null;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#003459]">
              My Profile
            </h2>

            <p className="mt-0.5 text-xs text-gray-400">
              View your account information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#E4F3F8] bg-[#F7FCFE] p-5">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name || "Security"}
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#E8F6FB] ring-4 ring-white shadow-sm">
                <User
                  size={32}
                  className="text-[#007EA7]"
                />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-[#003459]">
                {profile.name || "Security"}
              </h3>

              <p className="mt-1 truncate text-sm text-gray-500">
                {profile.email || "Security"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E6F5FA] px-3 py-1 text-[11px] font-semibold text-[#007EA7]">
                  Security
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    profile.status === "Active"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {profile.status || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <ProfileSection
            icon={User}
            title="Contact Information"
          >
            <DetailItem
              icon={Mail}
              label="Email"
              value={profile.email}
            />

            <DetailItem
              icon={Phone}
              label="Phone"
              value={profile.phone}
            />
          </ProfileSection>

          <ProfileSection
            icon={ShieldCheck}
            title="Security Details"
          >
            <DetailItem
              icon={IdCard}
              label="Employee ID"
              value={profile.employeeId}
            />

            <DetailItem
              icon={Clock}
              label="Shift"
              value={profile.shift}
            />
          </ProfileSection>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <CalendarDays
                  size={17}
                  className="text-[#007EA7]"
                />
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-400">
                  Account Created
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#003459]">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#007EA7] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#003459]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ icon: Icon, title, children }) {
  return (
    <div className="mb-5 rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F5FA]">
          <Icon
            size={16}
            className="text-[#007EA7]"
          />
        </div>

        <p className="text-sm font-semibold text-[#003459]">
          {title}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1.5">
        {Icon && (
          <Icon
            size={13}
            className="shrink-0 text-gray-400"
          />
        )}

        <p className="text-[11px] font-medium text-gray-400">
          {label}
        </p>
      </div>

      <p className="break-words text-sm font-medium text-gray-700">
        {value || "—"}
      </p>
    </div>
  );
}

export default SecurityProfileModal;