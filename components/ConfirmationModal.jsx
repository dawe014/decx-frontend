"use client";

import { FiAlertTriangle, FiLoader } from "react-icons/fi";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // Close modal on overlay click
    >
      {/* Modal content container */}
      <div
        className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md m-4 border border-slate-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-500/10">
            <FiAlertTriangle className="h-6 w-6 text-red-500" />
          </div>

          {/* Text content */}
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{message}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
