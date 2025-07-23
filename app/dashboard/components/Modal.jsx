"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
            onClick={onClose}
          ></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-slate-700">
          <div className="px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-slate-100">{title}</h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                onClick={onClose}
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 text-slate-300">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
