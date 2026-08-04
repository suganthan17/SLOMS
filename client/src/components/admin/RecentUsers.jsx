import { UserPlus } from "lucide-react";

const recentUsers = [];

function RecentUsers() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-[#003459]">
            Recently Added Users
          </h2>
          <p className="text-xs text-gray-400">Students, Faculty, Security</p>
        </div>

        <button className="rounded-md bg-[#007EA7] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#003459]">
          View All
        </button>
      </div>

      {recentUsers.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <UserPlus size={18} className="text-[#007EA7]" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-[#003459]">
            No Users Added
          </h3>
          <p className="mt-1 text-center text-xs text-gray-500">
            New registrations will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
          {recentUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#007EA7] text-xs font-semibold text-white">
                {user.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-semibold text-[#003459]">
                  {user.name}
                </h4>
                <p className="truncate text-[11px] text-gray-500">
                  {user.department}
                </p>
              </div>

              <span
                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium
                  ${
                    user.role === "Student"
                      ? "bg-blue-100 text-blue-700"
                      : user.role === "Faculty"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentUsers;