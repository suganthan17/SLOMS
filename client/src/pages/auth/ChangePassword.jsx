import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({
        type: "error",
        title: "Incomplete Details",
        message: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        type: "error",
        title: "Invalid Password",
        message: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        title: "Passwords Do Not Match",
        message: "New password and confirm password must match.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      showToast({
        type: "error",
        title: "Invalid Password",
        message: "New password must be different from your current password.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to change password"
        );
      }

      showToast({
        type: "success",
        title: "Password Changed",
        message: "Your password has been changed successfully.",
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      showToast({
        type: "error",
        title: "Password Change Failed",
        message:
          err.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto w-full max-w-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#007EA7] transition hover:text-[#003459]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6FB]">
              <Lock size={24} className="text-[#007EA7]" />
            </div>

            <h1 className="text-2xl font-bold text-[#003459]">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Update your account password securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#003459]">
                Current Password
              </label>

              <div className="flex h-12 items-center rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#007EA7]">
                <Lock
                  size={18}
                  className="text-[#007EA7]"
                />

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleChange(
                      "currentPassword",
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  className="text-gray-500 hover:text-[#007EA7]"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#003459]">
                New Password
              </label>

              <div className="flex h-12 items-center rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#007EA7]">
                <Lock
                  size={18}
                  className="text-[#007EA7]"
                />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleChange(
                      "newPassword",
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="text-gray-500 hover:text-[#007EA7]"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                Password must be at least 6 characters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#003459]">
                Confirm New Password
              </label>

              <div className="flex h-12 items-center rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#007EA7]">
                <Lock
                  size={18}
                  className="text-[#007EA7]"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="text-gray-500 hover:text-[#007EA7]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#007EA7] text-sm font-semibold text-white transition hover:bg-[#003459] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;