"use client";

import { useState, useEffect } from "react";
import {
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiSearch,
  FiFilter,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import { format } from "date-fns";

// --- Skeleton Components for Loading State ---

/**
 * Renders a single skeleton card with a pulse animation.
 */
function ApplicationCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="animate-pulse flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Left side */}
        <div className="w-full md:w-3/4">
          <div className="flex items-center mb-4">
            <div className="h-6 w-48 bg-slate-700 rounded-md mr-4"></div>
            <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
          </div>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            <div className="h-4 w-36 bg-slate-700 rounded-md"></div>
            <div className="h-4 w-40 bg-slate-700 rounded-md"></div>
            <div className="h-4 w-28 bg-slate-700 rounded-md"></div>
          </div>
        </div>
        {/* Right side */}
        <div className="hidden md:flex items-center">
          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the full page skeleton UI.
 */
function ApplicationSkeleton() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-slate-800 border-b border-slate-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 w-1/3 bg-slate-700 rounded-md mb-3"></div>
          <div className="h-4 w-1/2 bg-slate-700 rounded-md"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Skeleton */}
        <div className="mb-8 bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="h-10 w-full md:flex-1 bg-slate-700 rounded-lg"></div>
            <div className="h-10 w-full md:flex-1 bg-slate-700 rounded-lg"></div>
            <div className="h-6 w-48 bg-slate-700 rounded-md ml-auto hidden md:block"></div>
          </div>
        </div>

        {/* Applications List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ApplicationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function ApplicationsDashboardPage() {
  // --- State Management ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const response = await fetch("/api/applications/me");
        if (!response.ok) throw new Error("Failed to fetch applications");
        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  // --- Helper Functions ---
  const getStatusInfo = (status) => {
    switch (status) {
      case "hired":
        return {
          icon: <FiCheckCircle className="text-green-400" />,
          color: "bg-green-900/50 text-green-300",
        };
      case "rejected":
        return {
          icon: <FiXCircle className="text-red-400" />,
          color: "bg-red-900/50 text-red-300",
        };
      case "shortlisted":
        return {
          icon: <FiAlertCircle className="text-yellow-400" />,
          color: "bg-yellow-900/50 text-yellow-300",
        };
      case "completed":
        return {
          icon: <FiCheckCircle className="text-indigo-400" />,
          color: "bg-indigo-900/50 text-indigo-300",
        };
      default:
        return {
          icon: <FiLoader className="text-blue-400 animate-spin" />,
          color: "bg-blue-900/50 text-blue-300",
        };
    }
  };

  const formatPrice = (amount, currency) => {
    return currency === "ETB"
      ? `${amount.toLocaleString()} ETB`
      : `$${amount.toLocaleString()}`;
  };

  // --- Derived State (Filtering) ---
  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      app.title?.toLowerCase().includes(searchLower) ||
      app.campaign?.brand?.companyName?.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Render Logic ---
  if (loading) {
    return <ApplicationSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">
            Error Loading Applications
          </h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 py-6 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">My Applications</h1>
          <p className="text-slate-400 mt-1">
            Track all your campaign applications in one place.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by campaign title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-auto md:min-w-[200px]">
              <FiFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-slate-400 w-full text-right md:w-auto md:ml-auto pt-2 md:pt-0">
              Showing{" "}
              <span className="font-medium text-white">
                {filteredApplications.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-white">
                {applications.length}
              </span>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <h3 className="text-xl font-medium text-white mb-2">
                No Applications Found
              </h3>
              <p className="text-slate-400 mb-6">
                {statusFilter === "all" && !searchTerm
                  ? "You haven't applied to any campaigns yet."
                  : `Your search for "${searchTerm}" with status "${statusFilter}" returned no results.`}
              </p>
              <Link
                href="/jobs"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg font-medium transition-all duration-300"
              >
                Browse Campaigns
              </Link>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const statusInfo = getStatusInfo(app.status);
              return (
                <Link
                  key={app._id}
                  href={`/my-proposals/${app._id}`}
                  className="group block bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    {/* Left side */}
                    <div className="flex-1 mb-4 sm:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 mb-3">
                        <h2 className="text-xl font-bold text-white leading-tight">
                          {app?.title || "Untitled Campaign"}
                        </h2>
                        <span
                          className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center self-start`}
                        >
                          {statusInfo.icon}
                          <span className="ml-1.5 capitalize">
                            {app.status}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center text-sm text-slate-400 gap-y-2 gap-x-5">
                        <div className="flex items-center">
                          <FiClock className="mr-1.5" />
                          Applied{" "}
                          {format(new Date(app.createdAt), "MMM d, yyyy")}
                        </div>
                        {app.campaign?.brand?.companyName && (
                          <div className="flex items-center font-medium text-slate-300">
                            {app.campaign.brand.companyName}
                          </div>
                        )}
                        {app.quote && (
                          <div className="flex items-center text-teal-400">
                            <FiDollarSign className="mr-1" />
                            <span className="font-semibold">
                              {formatPrice(
                                app.quote,
                                app.campaign?.budget?.currency
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center self-end sm:self-center">
                      <FiChevronRight
                        size={24}
                        className="text-slate-500 transition-transform duration-300 group-hover:text-white group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
