import React from "react";

const steps = [
  "Basic Info",
  "About",
  "Socials",
  "Services",
  "Profile",
  "Portfolio",
];

interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl space-x-4">
      {steps.map((_, index) => (
        <div key={index} className="flex items-center flex-1 ">
          {/* Step Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
              index + 1 <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1  ${
                index + 1 < currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
