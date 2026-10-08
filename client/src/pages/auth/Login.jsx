import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      showToast({
        type: "error",
        title: "Login Failed",
        message: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      showToast({
        type: "success",
        title: "Login Successful",
        message: "Welcome back!",
        duration: 1500,
      });

      setTimeout(() => {
        navigate(roleRoutes[data.role] || "/");
      }, 300);
    } catch (err) {
      showToast({
        type: "error",
        title: "Login Failed",
        message: err.message || "Something went wrong. Please try again.",
      });
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
          <div className="mb-6">
            <label className="mb-2 block font-medium text-[#003459]">
              Email
            </label>

            <div className="flex h-14 items-center rounded-xl border border-gray-300 bg-white px-4 transition-all duration-300 focus-within:border-[#00A8E8]">
              <Mail size={20} className="text-[#007EA7]" />

              <input
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                autoComplete="email"
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
                autoComplete="current-password"
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
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#007EA7] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#003459] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
