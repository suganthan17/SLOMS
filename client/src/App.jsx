import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";

import StudentDashboard from "./pages/student/StudentDashboard";
import ApplyLeave from "./pages/student/ApplyLeave";
import History from "./pages/student/History";
import Outpass from "./pages/student/Outpass";

import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import PendingApprovals from "./pages/faculty/PendingApprovals";
import FacultyHistory from "./pages/faculty/FacultyHistory";

import SecurityDashboard from "./pages/security/SecurityDashboard";
import ScanQr from "./pages/security/ScanQr";
import StudentsOutside from "./pages/security/StudentsOutside";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/admin/settings" element={<Settings />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/apply-leave" element={<ApplyLeave />} />
      <Route path="/student/history" element={<History />} />
      <Route path="/student/outpass" element={<Outpass />} />

      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/approvals" element={<PendingApprovals />} />
      <Route path="/faculty/history" element={<FacultyHistory />} />

      <Route path="/security/dashboard" element={<SecurityDashboard />} />
      <Route path="/security/scan" element={<ScanQr />} />
      <Route path="/security/outside" element={<StudentsOutside />} />
    </Routes>
  );
}

export default App;
