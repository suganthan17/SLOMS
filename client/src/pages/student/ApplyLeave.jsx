import { useState } from "react";
import { Loader2 } from "lucide-react";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentNavbar from "../../components/student/StudentNavbar";
import { useToast } from "../../context/ToastContext";

function ApplyLeave() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    reason: "",
    fromDateTime: "",
    toDateTime: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    if (!formData.fromDateTime) {
      newErrors.fromDateTime = "From date & time is required";
    }

    if (!formData.toDateTime) {
      newErrors.toDateTime = "To date & time is required";
    }

    if (
      formData.fromDateTime &&
      formData.toDateTime &&
      new Date(formData.fromDateTime) > new Date(formData.toDateTime)
    ) {
      newErrors.toDateTime = "To date & time cannot be before from date & time";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        type: "error",
        title: "Invalid Request",
        message: "Please check the highlighted fields.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(err.message || "Failed to submit leave request");
      }

      showToast({
        type: "success",
        title: "Leave Request Submitted",
        message:
          "Your leave request has been submitted successfully and is awaiting faculty approval.",
      });

      setFormData({
        reason: "",
        fromDateTime: "",
        toDateTime: "",
      });

      setErrors({});
    } catch (err) {
      showToast({
        type: "error",
        title: "Submission Failed",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <StudentSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <StudentNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">Apply Leave</h1>

          <p className="mt-1 text-sm text-gray-500">
            Submit a leave request for faculty approval.
          </p>

          <div className="mt-6 max-w-xl rounded-xl border border-gray-200 bg-white p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Reason
                </label>

                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  placeholder="Reason for leave"
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#007EA7] ${
                    errors.reason ? "border-red-300" : "border-gray-200"
                  }`}
                />

                {errors.reason && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.reason}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    From Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={formData.fromDateTime}
                    onChange={(e) =>
                      handleChange("fromDateTime", e.target.value)
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#007EA7] ${
                      errors.fromDateTime ? "border-red-300" : "border-gray-200"
                    }`}
                  />

                  {errors.fromDateTime && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.fromDateTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    To Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={formData.toDateTime}
                    onChange={(e) => handleChange("toDateTime", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#007EA7] ${
                      errors.toDateTime ? "border-red-300" : "border-gray-200"
                    }`}
                  />

                  {errors.toDateTime && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.toDateTime}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#007EA7] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#003459] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ApplyLeave;
