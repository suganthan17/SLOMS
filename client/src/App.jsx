import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
