import Toast from "./Toast";

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed left-1/2 top-6 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-3 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}

      <style>{`
        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ToastContainer;