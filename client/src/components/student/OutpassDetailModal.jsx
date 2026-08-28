import { useState, useEffect } from "react";
import { X, User, Loader2 } from "lucide-react";

function OutpassDetailModal({ isOpen, onClose, outpass, profile }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);

  useEffect(() => {
    if (!isOpen || !outpass) return;

    const fetchQr = async () => {
      setLoadingQr(true);
      try {
        const res = await fetch(`/api/leaves/my/outpasses/${outpass._id}/qr`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setQrDataUrl(data.qrDataUrl);
        }
      } catch (err) {
        console.error("Fetch QR error:", err);
      } finally {
        setLoadingQr(false);
      }
    };

    fetchQr();
  }, [isOpen, outpass]);

  if (!isOpen || !outpass) return null;

  const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#003459]">Outpass Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center px-6 py-6">
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <User size={32} className="text-[#007EA7]" />
            </div>
          )}

          <p className="mt-3 text-base font-semibold text-[#003459]">{profile?.name}</p>
          <p className="text-xs text-gray-500">
            {profile?.registerNumber} • {profile?.department}
          </p>

          <div className="mt-5 flex h-[200px] w-[200px] items-center justify-center rounded-lg border border-gray-200 bg-white">
            {loadingQr ? (
              <Loader2 size={24} className="animate-spin text-[#007EA7]" />
            ) : qrDataUrl ? (
              <img src={qrDataUrl} alt="Outpass QR" className="h-full w-full object-contain" />
            ) : (
              <p className="text-xs text-gray-400">QR unavailable</p>
            )}
          </div>

          <div className="mt-5 w-full rounded-lg bg-gray-50 p-4">
            <p className="text-[11px] font-medium text-gray-400">Reason</p>
            <p className="mt-0.5 text-sm text-gray-700">{outpass.reason}</p>

            <p className="mt-3 text-[11px] font-medium text-gray-400">Valid From</p>
            <p className="mt-0.5 text-sm text-gray-700">{formatDateTime(outpass.fromDateTime)}</p>

            <p className="mt-3 text-[11px] font-medium text-gray-400">Valid Until</p>
            <p className="mt-0.5 text-sm text-gray-700">{formatDateTime(outpass.toDateTime)}</p>

            <p className="mt-3 text-[11px] font-medium text-gray-400">Outpass ID</p>
            <p className="mt-0.5 text-sm text-gray-700">{outpass._id.slice(-8).toUpperCase()}</p>
          </div>

          <p className="mt-4 text-center text-[11px] text-gray-400">
            Show this QR to security at the gate. Scanning is required for both exit and re-entry.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OutpassDetailModal;