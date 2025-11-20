export interface DeleteModalProps {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ name, onCancel, onConfirm }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-999">
      <div
        className="
          bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200
          animate-[fadeIn_.25s_ease-out]
        "
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            Delete Company
          </h2>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M4.93 4.93l14.14 14.14M9.17 9.17l5.66 5.66"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-700 text-lg">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">{name}</span>?
          </p>

          <p className="text-gray-500 mt-1 text-sm">
            This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700
              hover:bg-gray-100 transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium
              hover:bg-red-700 shadow-sm transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
