import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  X,
  Upload,
  FileSpreadsheet,
  Trash2,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const departments = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
];

const requiredColumns = [
  "Name",
  "Email",
  "Phone",
  "Password",
  "Register Number",
  "Department",
  "Year",
  "Parent Name",
  "Parent Phone",
];

const emptyStudent = {
  Name: "",
  Email: "",
  Phone: "",
  Password: "",
  "Register Number": "",
  Department: "",
  Year: "",
  "Parent Name": "",
  "Parent Phone": "",
};

function ImportStudentsModal({
  isOpen,
  onClose,
  onImported,
}) {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] =
    useState(null);
  const [editForm, setEditForm] =
    useState(emptyStudent);

  if (!isOpen) return null;

  const resetModal = () => {
    setRows([]);
    setFileName("");
    setLoading(false);
    setEditingIndex(null);
    setEditForm(emptyStudent);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (loading) return;

    resetModal();
    onClose();
  };

  const normalizeHeaders = (headers) => {
    return headers.map((header) =>
      String(header || "").trim()
    );
  };

  const validateColumns = (headers) => {
    const normalizedHeaders =
      normalizeHeaders(headers);

    return requiredColumns.every((column) =>
      normalizedHeaders.includes(column)
    );
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const extension =
        file.name.split(".").pop()?.toLowerCase();

      if (
        !["xlsx", "xls", "csv"].includes(
          extension
        )
      ) {
        showToast({
          type: "error",
          title: "Invalid File",
          message:
            "Please upload an Excel or CSV file.",
        });

        return;
      }

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const firstSheetName =
        workbook.SheetNames[0];

      if (!firstSheetName) {
        showToast({
          type: "error",
          title: "Invalid File",
          message:
            "The uploaded file does not contain a sheet.",
        });

        return;
      }

      const worksheet =
        workbook.Sheets[firstSheetName];

      const data = XLSX.utils.sheet_to_json(
        worksheet,
        {
          defval: "",
        }
      );

      if (!data.length) {
        showToast({
          type: "error",
          title: "Empty File",
          message:
            "The uploaded file does not contain student data.",
        });

        return;
      }

      const headers = Object.keys(data[0]);

      if (!validateColumns(headers)) {
        showToast({
          type: "error",
          title: "Invalid Columns",
          message:
            "The Excel file must contain all required student columns.",
        });

        return;
      }

      const cleanedRows = data.map((row) => ({
        Name: String(row.Name || "").trim(),
        Email: String(row.Email || "")
          .trim()
          .toLowerCase(),
        Phone: String(row.Phone || "").trim(),
        Password: String(row.Password || ""),
        "Register Number": String(
          row["Register Number"] || ""
        ).trim(),
        Department: String(
          row.Department || ""
        ).trim(),
        Year: String(row.Year || "").trim(),
        "Parent Name": String(
          row["Parent Name"] || ""
        ).trim(),
        "Parent Phone": String(
          row["Parent Phone"] || ""
        ).trim(),
      }));

      const invalidDepartment =
        cleanedRows.find(
          (row) =>
            row.Department &&
            !departments.includes(
              row.Department
            )
        );

      if (invalidDepartment) {
        showToast({
          type: "error",
          title: "Invalid Department",
          message: `Invalid department: ${invalidDepartment.Department}`,
        });

        return;
      }

      setRows(cleanedRows);
      setFileName(file.name);

      showToast({
        type: "success",
        title: "Excel Loaded",
        message: `${cleanedRows.length} student${
          cleanedRows.length === 1 ? "" : "s"
        } loaded for preview.`,
      });
    } catch (error) {
      console.error(
        "EXCEL READ ERROR:",
        error
      );

      showToast({
        type: "error",
        title: "File Error",
        message:
          "Unable to read the uploaded file.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (index) => {
    setEditingIndex(index);
    setEditForm({
      ...rows[index],
    });
  };

  const updateEditField = (
    field,
    value
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveEdit = () => {
    setRows((prev) =>
      prev.map((row, index) =>
        index === editingIndex
          ? editForm
          : row
      )
    );

    setEditingIndex(null);
    setEditForm(emptyStudent);
  };

  const deleteRow = (index) => {
    setRows((prev) =>
      prev.filter(
        (_, rowIndex) => rowIndex !== index
      )
    );

    if (editingIndex === index) {
      setEditingIndex(null);
      setEditForm(emptyStudent);
    }
  };

  const validateRows = () => {
    if (!rows.length) {
      return "Please upload an Excel file first.";
    }

    const emails = new Set();
    const registerNumbers = new Set();

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 2;

      for (const column of requiredColumns) {
        if (
          !String(row[column] || "").trim()
        ) {
          return `Row ${rowNumber}: ${column} is required.`;
        }
      }

      const email =
        row.Email.trim().toLowerCase();

      const registerNumber =
        row["Register Number"].trim();

      if (emails.has(email)) {
        return `Row ${rowNumber}: Duplicate email ${email}.`;
      }

      if (
        registerNumbers.has(
          registerNumber
        )
      ) {
        return `Row ${rowNumber}: Duplicate register number ${registerNumber}.`;
      }

      emails.add(email);
      registerNumbers.add(registerNumber);

      if (
        !departments.includes(
          row.Department
        )
      ) {
        return `Row ${rowNumber}: Invalid department ${row.Department}.`;
      }
    }

    return null;
  };

  const handleImport = async () => {
    const validationError =
      validateRows();

    if (validationError) {
      showToast({
        type: "error",
        title: "Import Failed",
        message: validationError,
      });

      return;
    }

    try {
      setLoading(true);

      const students = rows.map((row) => ({
        name: row.Name,
        email: row.Email,
        phone: row.Phone,
        password: row.Password,
        registerNumber:
          row["Register Number"],
        department: row.Department,
        year: row.Year,
        parentName: row["Parent Name"],
        parentPhone:
          row["Parent Phone"],
      }));

      const res = await fetch(
        "/api/users/import-students",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            students,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          Array.isArray(data.errors)
            ? data.errors.join(" ")
            : data.message ||
              "Student import failed.";

        throw new Error(errorMessage);
      }

      showToast({
        type: "success",
        title: "Import Successful",
        message: `${data.imported} student${
          data.imported === 1 ? "" : "s"
        } imported successfully.`,
      });

      if (onImported) {
        onImported();
      }

      resetModal();
      onClose();
    } catch (error) {
      console.error(
        "IMPORT STUDENTS ERROR:",
        error
      );

      showToast({
        type: "error",
        title: "Import Failed",
        message:
          error.message ||
          "Unable to import students.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#003459]">
              Import Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload an Excel or CSV file to
              import students.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#007EA7]">
                <FileSpreadsheet
                  size={28}
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#003459]">
                Upload Student Excel File
              </h3>

              <p className="mt-1 max-w-md text-xs text-gray-500">
                Required columns: Name, Email,
                Phone, Password, Register
                Number, Department, Year,
                Parent Name and Parent Phone.
              </p>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={loading}
                className="mt-4 flex items-center gap-2 rounded-lg bg-[#007EA7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003459] disabled:opacity-50"
              >
                <Upload size={16} />
                Choose File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />

              {fileName && (
                <p className="mt-3 text-xs font-medium text-[#007EA7]">
                  {fileName}
                </p>
              )}
            </div>
          </div>

          {rows.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#003459]">
                    Preview
                  </h3>

                  <p className="text-xs text-gray-500">
                    {rows.length} student
                    {rows.length === 1
                      ? ""
                      : "s"}{" "}
                    ready to import
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-[1250px] w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                        #
                      </th>

                      {requiredColumns.map(
                        (column) => (
                          <th
                            key={column}
                            className="px-4 py-3 text-xs font-semibold text-gray-500"
                          >
                            {column}
                          </th>
                        )
                      )}

                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                        Faculty
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map(
                      (row, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-100"
                        >
                          <td className="px-4 py-3 text-gray-500">
                            {index + 1}
                          </td>

                          {requiredColumns.map(
                            (column) => (
                              <td
                                key={column}
                                className="max-w-[180px] truncate px-4 py-3 text-gray-700"
                                title={
                                  row[column]
                                }
                              >
                                {row[column]}
                              </td>
                            )
                          )}

                          <td className="px-4 py-3">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#007EA7]">
                              Auto Assign
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEdit(
                                    index
                                  )
                                }
                                className="rounded-lg p-2 text-[#007EA7] transition hover:bg-blue-50"
                              >
                                <Pencil
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteRow(
                                    index
                                  )
                                }
                                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {editingIndex !== null && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <h3 className="font-semibold text-[#003459]">
                    Edit Student
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(
                        null
                      );
                      setEditForm(
                        emptyStudent
                      );
                    }}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
                  {requiredColumns.map(
                    (field) => (
                      <div
                        key={field}
                        className={
                          field ===
                            "Parent Name" ||
                          field ===
                            "Parent Phone"
                            ? ""
                            : ""
                        }
                      >
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          {field}
                        </label>

                        {field ===
                        "Department" ? (
                          <select
                            value={
                              editForm[
                                field
                              ]
                            }
                            onChange={(e) =>
                              updateEditField(
                                field,
                                e.target
                                  .value
                              )
                            }
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#007EA7]"
                          >
                            <option value="">
                              Select Department
                            </option>

                            {departments.map(
                              (
                                department
                              ) => (
                                <option
                                  key={
                                    department
                                  }
                                  value={
                                    department
                                  }
                                >
                                  {
                                    department
                                  }
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <input
                            type={
                              field ===
                              "Password"
                                ? "text"
                                : "text"
                            }
                            value={
                              editForm[
                                field
                              ]
                            }
                            onChange={(e) =>
                              updateEditField(
                                field,
                                e.target
                                  .value
                              )
                            }
                            className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#007EA7]"
                          />
                        )}
                      </div>
                    )
                  )}

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Assigned Faculty
                    </label>

                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-sm text-[#007EA7]">
                      Automatically assigned
                      based on department
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(
                        null
                      );
                      setEditForm(
                        emptyStudent
                      );
                    }}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex items-center gap-2 rounded-lg bg-[#007EA7] px-4 py-2 text-sm font-medium text-white hover:bg-[#003459]"
                  >
                    <Check size={16} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={
              loading || rows.length === 0
            }
            className="flex items-center gap-2 rounded-lg bg-[#007EA7] px-5 py-2 text-sm font-medium text-white hover:bg-[#003459] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Importing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Import Students
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportStudentsModal;