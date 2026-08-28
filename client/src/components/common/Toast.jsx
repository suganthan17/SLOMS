import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: "bg-white",
    border: "border-green-200",
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  error: {
    icon: XCircle,
    bg: "bg-white",
    border: "border-red-200",
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-white",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
};

function Toast({ id, type = "success", title, message, onClose, duration = 4000 }) {
  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border ${config.border} ${config.bg} p-4 shadow-lg`}
      style={{ animation: "toast-slide-in 0.25s ease-out" }}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
        <Icon size={18} className={config.iconColor} />
      </div>

      <div className="flex-1 pt-0.5">
        {title && <p className="text-sm font-semibold text-[#003459]">{title}</p>}
        {message && <p className="mt-0.5 text-xs text-gray-500">{message}</p>}
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;