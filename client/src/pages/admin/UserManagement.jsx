import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import UserManagementHeader from "../../components/admin/UserManagementHeader";
import UserFilters from "../../components/admin/UserFilters";
import UsersTable from "../../components/admin/UsersTable";
import AddUserModal from "../../components/admin/AddUserModal";
import ViewUserModal from "../../components/admin/ViewUserModal";
import EditUserModal from "../../components/admin/EditUserModal";
import { Loader2 } from "lucide-react";

const defaultFilters = {
  search: "",
  role: "All Roles",
  department: "All Departments",
  status: "All Status",
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams({
          search: filters.search,
          role: filters.role,
          department: filters.department,
          status: filters.status,
          page,
          limit: pageSize,
        });

        const res = await fetch(`/api/users?${params}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        if (!cancelled) {
          setUsers(data.users);
          setTotalCount(data.total);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Fetch users error:", err);
          setErrorMsg("Could not load users. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters, page, pageSize, refreshFlag]);

  const refetch = useCallback(() => setRefreshFlag((f) => f + 1), []);

  const handleCreateUser = async (formData) => {
    const res = await fetch("/api/users", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create user");
    }

    setPage(1);
    refetch();
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setSelected((prev) => prev.filter((id) => id !== user._id));
      refetch();
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            <UserManagementHeader onAddUser={() => setAddModalOpen(true)} />
            <UserFilters
              filters={filters}
              onChange={(newFilters) => {
                setPage(1);
                setFilters(newFilters);
              }}
            />

            {errorMsg && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-20">
                <Loader2 size={24} className="animate-spin text-[#007EA7]" />
              </div>
            ) : (
              <UsersTable
                users={users}
                selected={selected}
                onSelectChange={setSelected}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPage(1);
                  setPageSize(size);
                }}
                onEdit={(user) => setEditUserId(user._id)}
                onView={(user) => setViewUserId(user._id)}
                onDelete={handleDeleteUser}
              />
            )}
          </div>
        </main>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreate={handleCreateUser}
      />

      <ViewUserModal
        isOpen={!!viewUserId}
        onClose={() => setViewUserId(null)}
        userId={viewUserId}
      />

      <EditUserModal
        isOpen={!!editUserId}
        onClose={() => setEditUserId(null)}
        userId={editUserId}
        onUpdated={refetch}
      />
    </div>
  );
}

export default UserManagement;
