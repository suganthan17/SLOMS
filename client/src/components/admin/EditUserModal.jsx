import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";

const roleFieldConfig = {
  Student: [
    { name: "registerNumber", label: "Register Number", type: "text" },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    },
    {
      name: "year",
      label: "Year",
      type: "select",
      options: ["1", "2", "3", "4"],
    },
    { name: "section", label: "Section", type: "text" },
    { name: "photo", label: "Student Photo", type: "file" },
  ],
  Faculty: [
    { name: "facultyId", label: "Faculty ID", type: "text" },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    },
    {
      name: "designation",
      label: "Designation",
      type: "select",
      options: [
        "Assistant Professor",
        "Associate Professor",
        "Professor",
        "HOD",
      ],
    },
  ],
  Security: [
    { name: "employeeId", label: "Employee ID", type: "text" },
    {
      name: "shift",
      label: "Shift",
      type: "select",
      options: ["Morning", "Evening", "Night"],
    },
  ],
};

function EditUserModal({ isOpen, onClose, userId, onUpdated }) {
  const [formData, setFormData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setErrors({});
      try {
        const res = await fetch(`/api/users/${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load user");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role,
          username: data.username || "",
          password: "",
          registerNumber: data.registerNumber || "",
          department: data.department || "",
          year: data.year || "",
          section: data.section || "",
          facultyId: data.facultyId || "",
          designation: data.designation || "",
          employeeId: data.employeeId || "",
          shift: data.shift || "",
          status: data.status || "Active",
        });
        setPhotoPreview(data.photoUrl || null);
      } catch (err) {
        setErrors({ form: err.message || "Failed to load user" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhotoChange = (file) => {
    if (!file) return;
    handleChange("photo", file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setFormData(null);
    setPhotoPreview(null);
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    const roleFields = roleFieldConfig[formData.role] || [];
    roleFields.forEach((field) => {
      if (field.type === "file") return;
      if (!formData[field.name] || !String(formData[field.name]).trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") payload.append(key, value);
      });

      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        credentials: "include",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update user");
      }

      await onUpdated();
      handleClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Failed to update user",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const roleFields = formData ? roleFieldConfig[formData.role] || [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#003459]">Edit User</h2>
            <p className="text-xs text-gray-500">Update account details.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {loading || !formData ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#007EA7]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5">
            {errors.form && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {errors.form}
              </div>
            )}

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Full Name"
                value={formData.name}
                onChange={(v) => handleChange("name", v)}
                error={errors.name}
              />
              <Field
                label="Email"
                type="email"
                value={formData.email}
                onChange={(v) => handleChange("email", v)}
                error={errors.email}
              />
              <Field
                label="Phone Number"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
                error={errors.phone}
              />
              <Field
                label="Username"
                value={formData.username}
                onChange={(v) => handleChange("username", v)}
                error={errors.username}
              />
              <Field
                label="New Password (optional)"
                type="password"
                value={formData.password}
                onChange={(v) => handleChange("password", v)}
                error={errors.password}
              />
              <SelectField
                label="Status"
                value={formData.status}
                options={["Active", "Inactive"]}
                onChange={(v) => handleChange("status", v)}
              />
            </div>

            {roleFields.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {formData.role} Details
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {roleFields.map((field) => {
                    if (field.type === "select") {
                      return (
                        <SelectField
                          key={field.name}
                          label={field.label}
                          value={formData[field.name] || ""}
                          options={field.options}
                          onChange={(v) => handleChange(field.name, v)}
                          error={errors[field.name]}
                        />
                      );
                    }
                    if (field.type === "file") {
                      return (
                        <PhotoField
                          key={field.name}
                          label={field.label}
                          preview={photoPreview}
                          onChange={handlePhotoChange}
                        />
                      );
                    }
                    return (
                      <Field
                        key={field.name}
                        label={field.label}
                        value={formData[field.name] || ""}
                        onChange={(v) => handleChange(field.name, v)}
                        error={errors[field.name]}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#007EA7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003459] disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#007EA7] ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#007EA7] ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function PhotoField({ label, preview, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Upload size={16} className="text-gray-400" />
          </div>
        )}
        <span>{preview ? "Change photo" : "Upload photo"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default EditUserModal;
