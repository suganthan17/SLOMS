import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import UserManagementHeader from "../../components/admin/UserManagementHeader";
import UserFilters from "../../components/admin/UserFilters";
import UsersTable from "../../components/admin/UsersTable";
import AddUserModal from "../../components/admin/AddUserModal";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    department: "all",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCreateUser = async (formData) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create user");
    }

    const newUser = await res.json();
    setUsers((prev) => [newUser, ...prev]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            <UserManagementHeader onAddUser={() => setModalOpen(true)} />
            <UserFilters filters={filters} onChange={setFilters} />
            <UsersTable
              users={users}
              selected={selected}
              onSelectChange={setSelected}
              page={page}
              pageSize={pageSize}
              totalCount={users.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={() => {}}
              onView={() => {}}
              onDelete={() => {}}
            />
          </div>
        </main>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
}

export default UserManagement;
