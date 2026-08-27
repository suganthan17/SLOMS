import { Pencil, Eye, Trash2, Users as UsersIcon } from "lucide-react";
import Pagination from "./Pagination";

const roleStyles = {
  Student: "bg-blue-50 text-blue-600",
  Faculty: "bg-purple-50 text-purple-600",
  Security: "bg-amber-50 text-amber-600",
};

const statusStyles = {
  Active: "bg-green-50 text-green-600",
  Inactive: "bg-red-50 text-red-600",
};

const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getDisplayId(user) {
  return user.registerNumber || user.facultyId || user.employeeId || user.username || "—";
}

function UsersTable({
  users,
  selected,
  onSelectChange,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onView,
  onDelete,
}) {
  const allSelected = users.length > 0 && selected.length === users.length;

  const toggleAll = () => {
    onSelectChange(allSelected ? [] : users.map((u) => u._id));
  };

  const toggleOne = (id) => {
    onSelectChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-medium text-gray-500">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                      <UsersIcon size={20} className="text-[#007EA7]" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[#003459]">No Users Found</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Try adjusting your filters or add a new user.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user._id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(user._id)}
                      onChange={() => toggleOne(user._id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                            avatarColors[idx % avatarColors.length]
                          }`}
                        >
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#003459]">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-600">{getDisplayId(user)}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        roleStyles[user.role] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">{user.department || "—"}</td>

                  <td className="px-4 py-3 text-gray-600">{user.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[user.status] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="rounded-md p-1.5 text-[#007EA7] transition hover:bg-blue-50"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(user)}
                        className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        rangeStart={users.length === 0 ? 0 : (page - 1) * pageSize + 1}
        rangeEnd={Math.min(page * pageSize, totalCount)}
      />
    </div>
  );
}

export default UsersTable;