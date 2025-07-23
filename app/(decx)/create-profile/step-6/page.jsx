"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { FiCheckCircle, FiClock } from "react-icons/fi";

export default function StepFive() {
  const router = useRouter();

  return (
    <ProfileLayout step={5}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Profile Submitted</h2>
          <p className="text-slate-400">
            Your profile is complete and awaiting verification
          </p>
        </div>

        <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700 space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <FiCheckCircle className="text-indigo-500 text-5xl" />
              <FiClock className="absolute -bottom-1 -right-1 text-yellow-500 bg-slate-900 rounded-full p-1 text-xl" />
            </div>
            
            <h3 className="text-xl font-semibold text-white">
              Under Review
            </h3>
            
            <p className="text-slate-400">
              Our team will verify your profile within 24-48 hours. You'll receive a notification once approved.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={() => router.push("/profile/preview")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              Preview Your Profile
            </button>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}