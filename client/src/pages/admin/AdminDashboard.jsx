import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatsCards from "../../components/admin/StatsCards";
import CampusStatus from "../../components/admin/CampusStatus";
import AdminGraph from "../../components/admin/AdminGraph";
import RecentUsers from "../../components/admin/RecentUsers";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      students: 0,
      faculty: 0,
      security: 0,
    },
    campus: {
      inside: 0,
      outside: 0,
    },
    recentUsers: [],
    weeklyMovement: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }

      setDashboardData(data);
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-hidden p-4">
          <div className="grid h-full grid-rows-[auto_auto_1fr] gap-4">
            <StatsCards stats={dashboardData.stats} />

            <CampusStatus campus={dashboardData.campus} />

            <div className="grid min-h-0 grid-cols-3 gap-4">
              <div className="col-span-2 min-h-0">
                <AdminGraph data={dashboardData.weeklyMovement} />
              </div>

              <div className="col-span-1 min-h-0">
                <RecentUsers users={dashboardData.recentUsers} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;