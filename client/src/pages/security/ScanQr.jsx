import { useEffect, useRef, useState } from "react";
import SecuritySidebar from "../../components/security/SecuritySidebar";
import SecurityNavbar from "../../components/security/SecurityNavbar";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { CheckCircle, ScanLine, User, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

function ScanQr() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);

  const html5QrRef = useRef(null);
  const processingRef = useRef(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (!scannerActive) return;

    let mounted = true;
    let unmountedBeforeStart = false;
    const html5Qr = new Html5Qrcode("qr-reader");

    html5QrRef.current = html5Qr;

    const stopAndClear = async () => {
      try {
        const scanner = html5QrRef.current;
        if (!scanner) return;

        const state = scanner.getState();

        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          await scanner.stop();
        }

        await scanner.clear();
      } catch (err) {}
    };

    html5Qr
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 300,
            height: 300,
          },
          aspectRatio: 1,
          disableFlip: false,
        },
        (decodedText) => {
          if (!mounted || processingRef.current) return;
          handleScanSuccess(decodedText);
        },
        () => {},
      )
      .then(() => {
        if (!mounted) {
          unmountedBeforeStart = true;
          stopAndClear();
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(`Could not access camera: ${err?.message || String(err)}`);
        }
      });

    return () => {
      mounted = false;

      if (!unmountedBeforeStart) {
        stopAndClear();
      }
    };
  }, [scannerActive]);

  const handleScanSuccess = async (qrToken) => {
    if (processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/security/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ qrToken }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Invalid QR code");
      }

      setScannerActive(false);
      setScanResult(data);
    } catch (err) {
      setError(err.message || "Failed to process QR code");

      showToast({
        type: "error",
        title: "Scan Failed",
        message: err.message || "Failed to process QR code",
      });
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!scanResult || processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);
    setError("");

    try {
      const endpoint =
        scanResult.nextAction === "exit"
          ? "/api/security/scan/confirm-exit"
          : "/api/security/scan/confirm-entry";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          leaveId: scanResult.leave._id,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Unexpected server response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm");
      }

      showToast({
        type: "success",
        title:
          scanResult.nextAction === "exit"
            ? "Exit Confirmed"
            : "Entry Confirmed",
        message: data.message,
      });

      resetScanner();
    } catch (err) {
      setError(err.message || "Failed to confirm");

      showToast({
        type: "error",
        title: "Confirmation Failed",
        message: err.message || "Failed to confirm",
      });
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError("");
    setProcessing(false);
    processingRef.current = false;
    setScannerActive(false);

    setTimeout(() => {
      setScannerActive(true);
    }, 100);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const student = scanResult?.leave?.student;
  const leave = scanResult?.leave;

  return (
    <div className="flex h-screen bg-gray-50">
      <SecuritySidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SecurityNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Scan QR</h1>

            <p className="mt-1 text-sm text-gray-500">
              Scan a student's outpass QR to verify exit or entry.
            </p>
          </div>

          {!scanResult && (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-lg">
                  <div id="qr-reader" className="w-full" />
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <ScanLine size={18} />
                  <span>Position the QR code inside the frame</span>
                </div>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Verify Student
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Verify the details before confirming.
                    </p>
                  </div>

                  <button
                    onClick={resetScanner}
                    disabled={processing}
                    className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
                  <div className="flex flex-col items-center text-center">
                    {student?.photoUrl ? (
                      <img
                        src={student.photoUrl}
                        alt={student.name || "Student"}
                        className="h-24 w-24 rounded-full border-4 border-gray-100 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <User size={42} />
                      </div>
                    )}

                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {student?.name || "Unknown Student"}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {student?.registerNumber || "-"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {student?.department || "-"} • Year {student?.year || "-"}{" "}
                      • Sec {student?.section || "-"}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Reason
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-800">
                        {leave?.reason || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Valid Window
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-800">
                        {formatDate(leave?.fromDate)} →{" "}
                        {formatDate(leave?.toDate)}
                      </p>
                    </div>

                    <div
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                        scanResult.nextAction === "exit"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      <CheckCircle size={18} />

                      {scanResult.nextAction === "exit"
                        ? "Confirm EXIT"
                        : "Confirm ENTRY"}
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <button
                    onClick={resetScanner}
                    disabled={processing}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={processing}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      scanResult.nextAction === "exit"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {processing
                      ? "Processing..."
                      : scanResult.nextAction === "exit"
                        ? "Confirm EXIT"
                        : "Confirm ENTRY"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ScanQr;
