"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

// Helper to map string icon names from API to actual React components
const iconMap = {
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiTrendingUp,
};

export default function AdminOverview() {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/admin/overview");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data.stats);
        setRecentActivities(data.recentActivities);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch admin overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  <div className="h-7 w-32 bg-slate-700 rounded"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700"></div>
              </div>
              <div className="h-4 w-40 bg-slate-700 rounded mt-4"></div>
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="h-6 w-48 bg-slate-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center pb-4 border-b border-slate-700 last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-28"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-800 rounded-xl border border-red-500/30">
        <FiAlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Failed to load data
        </h2>
        <p className="text-slate-400">
          There was a problem fetching the dashboard overview. Please try again
          later.
        </p>
        <p className="text-xs text-slate-500 mt-2">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon] || FiBriefcase;
          return (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-green-900/30 text-green-400 `}
                >
                  <IconComponent size={20} />
                </div>
              </div>
              <p
                className={`text-sm mt-3 flex items-center font-medium text-green-400`}
              >
                {stat.change} from last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start pb-4 border-b border-slate-700 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-300 font-medium mr-4">
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-medium text-indigo-400">
                    {activity.user}
                  </span>{" "}
                  {activity.action}
                </p>
                <p className="text-sm text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="block bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
        >
          <h3 className="font-bold text-white mb-3">View All Users</h3>
          <p className="text-sm text-slate-400">
            Manage all platform users including brands and influencers
          </p>
        </Link>
        <Link
          href="/dashboard/admin/e-magazine"
          className="block bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
        >
          <h3 className="font-bold text-white mb-3">View E-Magazine</h3>
          <p className="text-sm text-slate-400">
            Access the latest e-magazine issues and content
          </p>
        </Link>
        <Link
          href="/dashboard/admin/settings"
          className="block bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
        >
          <h3 className="font-bold text-white mb-3">System Settings</h3>
          <p className="text-sm text-slate-400">
            Configure your account settings.
          </p>
        </Link>
      </div>
    </div>
  );
}
