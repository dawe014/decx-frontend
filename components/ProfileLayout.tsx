import { ReactNode } from "react";
import StepProgress from "./StepProgress";

interface ProfileLayoutProps {
  step: number;
  children: ReactNode;
}

export default function ProfileLayout({ step, children }: ProfileLayoutProps) {
  return (
    // <ProfileProvider>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-400">
            Complete your profile to unlock full features
          </p>
        </div>

        <StepProgress currentStep={step} />

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
    // </ProfileProvider>
  );
}
