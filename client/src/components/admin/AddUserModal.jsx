import { useState } from "react";
import { X, Upload } from "lucide-react";

const initialCommon = {
  name: "",
  email: "",
  phone: "",
  role: "Student",
  username: "",
  password: "",
};

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

const roleOptions = Object.keys(roleFieldConfig);

function AddUserModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState(initialCommon);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRoleChange = (role) => {
    setFormData({ ...initialCommon, role });
    setPhotoPreview(null);
    setErrors({});
  };

  const handlePhotoChange = (file) => {
    if (!file) return;
    handleChange("photo", file);
    setPhotoPreview(URL.createObjectURL(file));
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
    if (!formData.password || formData.password.length <= 1) {
      newErrors.password = "Password must be entered";
    }

    const roleFields = roleFieldConfig[formData.role] || [];
    roleFields.forEach((field) => {
      if (field.type === "file") {
        if (!formData[field.name])
          newErrors[field.name] = `${field.label} is required`;
      } else if (
        !formData[field.name] ||
        !String(formData[field.name]).trim()
      ) {
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

      await onCreate(payload);
      setFormData(initialCommon);
      setPhotoPreview(null);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err?.message || "Failed to create user",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const roleFields = roleFieldConfig[formData.role] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#003459]">
              Add New User
            </h2>
            <p className="text-xs text-gray-500">
              Register a Student, Faculty, or Security Staff account.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {errors.form && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {errors.form}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    formData.role === role
                      ? "border-[#007EA7] bg-blue-50 text-[#007EA7]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

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
              label="Password"
              type="password"
              value={formData.password}
              onChange={(v) => handleChange("password", v)}
              error={errors.password}
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
                        error={errors[field.name]}
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
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#007EA7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003459] disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
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

function PhotoField({ label, preview, onChange, error }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50 ${
          error ? "border-red-300" : "border-gray-200"
        }`}
      >
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
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

export default AddUserModal;
