"use client";

import Link from "next/link";
import { FiArrowRight, FiBriefcase } from "react-icons/fi";

export default function BrandOwnerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16">
      {/* Icon and Welcome Message */}
      <div className="bg-slate-800 p-6 rounded-full border-2 border-slate-700 mb-8">
        <FiBriefcase className="h-12 w-12 text-indigo-400" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Welcome to Your Dashboard
      </h1>

      <p className="max-w-xl mx-auto text-lg text-slate-400 mb-10">
        This is your central hub to create, manage, and track the performance of
        all your influencer marketing campaigns.
      </p>

      {/* Primary Call to Action Button */}
      <Link
        href="/dashboard/brand-owner/campaigns"
        className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-900/50 transform hover:scale-105"
      >
        <span>Manage My Campaigns</span>
        <FiArrowRight className="ml-3 h-5 w-5" />
      </Link>
    </div>
  );
}
