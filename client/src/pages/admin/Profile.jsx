import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

function Profile() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminNavbar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#003459]">
            Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your administrator profile.
          </p>
        </main>
      </div>
    </div>
  );
}

export default Profile;