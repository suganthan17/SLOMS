import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

function Reports() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminNavbar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#003459]">
            Reports
          </h1>

          <p className="mt-2 text-gray-500">
            View leave reports and system statistics.
          </p>
        </main>
      </div>
    </div>
  );
}

export default Reports;