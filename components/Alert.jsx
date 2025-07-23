"use client";

import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { useSearchParams } from "next/navigation";

export function Alert({
  message,
  type = "success",
  duration = 5000,
  onClose,
  showIcon = true,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  if (error) {
    message = error;
    type = "error";
  }
  if (success) {
    message = success;
    type = "success";
  }
  let isHidden = false;
  if (!message) {
    isHidden = true;
  }
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const alertStyles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-400",
      text: "text-emerald-800",
      icon: <FiCheckCircle className="text-emerald-500" />,
    },
    error: {
      bg: "bg-rose-50",
      border: "border-rose-400",
      text: "text-rose-800",
      icon: <FiXCircle className="text-rose-500" />,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-400",
      text: "text-amber-800",
      icon: <FiAlertCircle className="text-amber-500" />,
    },
    info: {
      bg: "bg-slate-50",
      border: "border-slate-400",
      text: "text-slate-800",
      icon: <FiInfo className="text-slate-500" />,
    },
  };

  const { bg, border, text, icon } = alertStyles[type];
  if (isHidden) return null;
  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-md border-l-4 ${bg} ${border} p-4 pr-10 shadow-md ${text} max-w-xs sm:max-w-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        {showIcon && <span className="text-lg flex-shrink-0">{icon}</span>}
        <p className="text-sm leading-snug">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 focus:outline-none"
      >
        <FiX className="text-slate-500" size={18} />
      </button>
    </div>
  );
}
