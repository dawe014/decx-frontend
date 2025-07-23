"use client";

import { FaEnvelope, FaArrowRight, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPrompt() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer for resend email button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = () => {
    if (countdown > 0) return;

    setIsResending(true);
    // Simulate API call to resend verification email
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setCountdown(30); // Reset countdown
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1000);
  };

  const handleContinue = () => {
    // Add your verification check logic here
    router.push("/login"); // Or wherever you want to redirect
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/10 mb-6">
            <FaEnvelope className="h-10 w-10 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-slate-400 mb-6">
            We've sent a verification link to your email address
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-slate-300 text-sm flex items-center justify-center gap-2">
              <FaClock className="text-blue-400" />
              <span>Link expires in 24 hours</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 space-y-4">
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-lg transition-all duration-200"
          >
            I've verified my email
            <FaArrowRight className="text-sm" />
          </button>

          <div className="text-center">
            <button
              onClick={handleResendEmail}
              disabled={countdown > 0 || isResending}
              className={`text-sm ${
                countdown > 0
                  ? "text-slate-500"
                  : "text-blue-400 hover:text-blue-300"
              } transition-colors`}
            >
              {isResending
                ? "Sending..."
                : resendSuccess
                ? "Email resent successfully!"
                : countdown > 0
                ? `Resend email in ${countdown}s`
                : "Resend verification email"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 bg-slate-900/50 p-4 text-center">
          <p className="text-sm text-slate-500">
            Didn't receive the email? Check your spam folder
          </p>
        </div>
      </div>
    </div>
  );
}
