import { Plus, Upload } from "lucide-react";

function UserManagementHeader({
  onAddUser,
  onImportStudents,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#003459]">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and oversee all system users.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onImportStudents}
          className="flex items-center gap-2 rounded-lg border border-[#007EA7] px-4 py-2.5 text-sm font-medium text-[#007EA7] transition hover:bg-[#007EA7] hover:text-white"
        >
          <Upload size={16} />
          Import Students
        </button>

        <button
          type="button"
          onClick={onAddUser}
          className="flex items-center gap-2 rounded-lg bg-[#007EA7] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#003459]"
        >
          <Plus size={16} />
          Add New User
        </button>
      </div>
    </div>
  );
}

export default UserManagementHeader;