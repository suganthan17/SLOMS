import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatsCards from "../../components/admin/StatsCards";
import CampusStatus from "../../components/admin/CampusStatus";
import AdminGraph from "../../components/admin/AdminGraph";
import RecentUsers from "../../components/admin/RecentUsers";

function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-hidden p-4">
          <div className="grid h-full grid-rows-[auto_auto_1fr] gap-4">
            <StatsCards />
            <CampusStatus />
            <div className="grid min-h-0 grid-cols-3 gap-4">
              <div className="col-span-2 min-h-0">
                <AdminGraph />
              </div>
              <div className="col-span-1 min-h-0">
                <RecentUsers />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
