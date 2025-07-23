"use client";

import { useRouter } from "next/navigation";
import { FaCheckCircle, FaArrowRight, FaQuestion } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShouldRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  const handleManualRedirect = () => {
    setShouldRedirect(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 mb-6">
            <FaCheckCircle className="h-10 w-10 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Email Verified</h1>
          <p className="text-slate-400">Your account is now fully activated</p>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-center text-slate-300 text-sm">
              Redirecting in{" "}
              <span className="font-mono text-emerald-400">{countdown}s</span>
            </p>
          </div>

          <button
            onClick={handleManualRedirect}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Continue to Login
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 bg-slate-900/50 p-4 text-center">
          <a
            href="/help"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <FaQuestion className="mr-2" />
            Need assistance?
          </a>
        </div>
      </div>
    </div>
  );
}
