import { useState, useEffect, useRef } from "react";
import SecuritySidebar from "../../components/security/SecuritySidebar";
import SecurityNavbar from "../../components/security/SecurityNavbar";
import { Html5Qrcode } from "html5-qrcode";
import { User, CheckCircle, ScanLine } from "lucide-react";

function ScanQr() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  useEffect(() => {
    if (!scannerActive) return;

    const html5Qr = new Html5Qrcode("qr-reader");
    html5QrRef.current = html5Qr;

    html5Qr
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          console.log("QR DECODED:", decodedText);
          handleScanSuccess(decodedText);
        },
        () => {
          // per-frame decode failures — expected constantly while scanning, ignore
        },
      )
      .then(() => {
        console.log("Camera started successfully");
      })
      .catch((err) => {
        console.error("Camera start error:", err);
        setError(`Could not access camera: ${err.message || err}`);
      });

    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerActive]);

  const handleScanSuccess = async (qrToken) => {
    console.log("handleScanSuccess called with token:", qrToken);
    if (processing) return;
    setProcessing(true);
    setError("");

    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop();
        setScannerActive(false);
      }

      const res = await fetch("/api/security/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ qrToken }),
      });

      console.log("Scan API response status:", res.status);

      const data = await res.json();
      console.log("Scan API response data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Invalid QR code");
      }

      setScanResult(data);
    } catch (err) {
      console.error("Scan error:", err);
      setError(err.message || "Failed to process QR code");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!scanResult) return;
    setProcessing(true);

    try {
      const endpoint =
        scanResult.nextAction === "exit"
          ? "/api/security/scan/confirm-exit"
          : "/api/security/scan/confirm-entry";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ leaveId: scanResult.leave._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm");
      }

      resetScanner();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError("");
    setScannerActive(true);
  };

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <SecuritySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SecurityNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-[#003459]">Scan QR</h1>
          <p className="mt-1 text-sm text-gray-500">
            Scan a student's outpass QR to verify exit or entry.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md">
              {!scanResult ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div
                    id="qr-reader"
                    ref={scannerRef}
                    className="mx-auto overflow-hidden rounded-lg"
                  />
                  {error && (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                      <button
                        onClick={resetScanner}
                        className="ml-2 font-medium underline"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                  <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ScanLine size={14} />
                    Point the camera at the student's QR code
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-[#007EA7] bg-white p-6">
                  <div className="flex flex-col items-center">
                    {scanResult.leave.student?.photoUrl ? (
                      <img
                        src={scanResult.leave.student.photoUrl}
                        alt={scanResult.leave.student.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
                        <User size={36} className="text-[#007EA7]" />
                      </div>
                    )}

                    <p className="mt-3 text-lg font-semibold text-[#003459]">
                      {scanResult.leave.student?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {scanResult.leave.student?.registerNumber} •{" "}
                      {scanResult.leave.student?.department} • Year{" "}
                      {scanResult.leave.student?.year} • Sec{" "}
                      {scanResult.leave.student?.section}
                    </p>

                    <div className="mt-4 w-full rounded-lg bg-gray-50 p-4">
                      <p className="text-[11px] font-medium text-gray-400">
                        Reason
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        {scanResult.leave.reason}
                      </p>

                      <p className="mt-3 text-[11px] font-medium text-gray-400">
                        Valid Window
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        {formatDateTime(scanResult.leave.fromDateTime)} →{" "}
                        {formatDateTime(scanResult.leave.toDateTime)}
                      </p>
                    </div>

                    <div
                      className={`mt-4 rounded-full px-4 py-1.5 text-sm font-medium ${
                        scanResult.nextAction === "exit"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {scanResult.nextAction === "exit"
                        ? "Confirm EXIT"
                        : "Confirm ENTRY"}
                    </div>

                    {error && (
                      <div className="mt-3 w-full rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="mt-5 flex w-full gap-2">
                      <button
                        onClick={resetScanner}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={processing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#007EA7] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#003459] disabled:opacity-60"
                      >
                        <CheckCircle size={16} />
                        {processing ? "Processing..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ScanQr;
