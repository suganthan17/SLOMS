import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const roleRoutes = {
        Admin: "/admin/dashboard",
        Faculty: "/faculty/dashboard",
        Student: "/student/dashboard",
        Security: "/security/dashboard",
      };

      navigate(roleRoutes[data.role] || "/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      <div className="absolute -top-72 -right-72">
        <div className="h-[600px] w-[600px] rounded-full border-[60px] border-[#D8F0FB]" />
        <div className="absolute top-[60px] left-[60px] h-[480px] w-[480px] rounded-full border-[60px] border-[#72C3E5]" />
        <div className="absolute top-[120px] left-[120px] h-[360px] w-[360px] rounded-full border-[60px] border-[#1A9DD3]" />
      </div>

      <div className="absolute -bottom-80 -left-80">
        <div className="h-[750px] w-[750px] rounded-full border-[70px] border-[#D8F0FB]" />
        <div className="absolute top-[70px] left-[70px] h-[610px] w-[610px] rounded-full border-[70px] border-[#72C3E5]" />
        <div className="absolute top-[140px] left-[140px] h-[470px] w-[470px] rounded-full border-[70px] border-[#1A9DD3]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-8">
        <h1 className="text-center text-5xl font-bold font-sans text-[#003459]">
          BIT
        </h1>

        <p className="mt-3 mb-12 text-center text-gray-500">
          Smart Leave & Outpass Management System
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block font-medium text-[#003459]">
              Username
            </label>

            <div className="flex h-14 items-center rounded-xl border border-gray-300 bg-white px-4 transition-all duration-300 focus-within:border-[#00A8E8]">
              <User size={20} className="text-[#007EA7]" />
              <input
                type="text"
                placeholder="Enter Username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="ml-3 w-full bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="mb-10">
            <label className="mb-2 block font-medium text-[#003459]">
              Password
            </label>

            <div className="flex h-14 items-center rounded-xl border border-gray-300 bg-white px-4 transition-all duration-300 focus-within:border-[#00A8E8]">
              <Lock size={20} className="text-[#007EA7]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="ml-3 w-full bg-transparent outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#007EA7]"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-xl bg-[#007EA7] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#003459] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
