import { Plus } from "lucide-react";

function UserManagementHeader({ onAddUser }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#003459]">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and oversee all system users.
        </p>
      </div>

      <button
        onClick={onAddUser}
        className="flex items-center gap-2 rounded-lg bg-[#007EA7] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#003459]"
      >
        <Plus size={16} />
        Add New User
      </button>
    </div>
  );
}

export default UserManagementHeader;