"use client";

import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiSearch,
  FiUsers,
  FiChevronRight,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiCheck,
  FiAward,
  FiBarChart2,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";
import { useCampaignDetails } from "@/hooks/useCampaignDetails"; // Adjust path
import ApplicantDetailsModal from "@/components/campaigns/ApplicantDetailsModal"; // Adjust path
import {
  getStatusColor,
  getStatusIcon,
  formatDate,
  getSafeValue,
} from "@/components/campaigns/ui-helpers"; // Adjust path
import { use } from "react";

// ====================================================================================
// RESPONSIVE SKELETON LOADER
// ====================================================================================
const CampaignDetailsSkeleton = () => (
  <div className="bg-slate-900 min-h-screen text-slate-100 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-48 bg-slate-700 rounded"></div>
        <div className="h-7 w-24 bg-slate-700 rounded-full"></div>
      </div>

      <div className="flex border-b border-slate-700 mb-8">
        <div className="h-10 w-40 bg-slate-800 mr-4"></div>
        <div className="h-10 w-32 bg-slate-800"></div>
      </div>

      {/* Skeleton for the main content area */}
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
        <div className="h-8 w-3/4 bg-slate-700 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-slate-700 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-20 w-full bg-slate-700/50 rounded-lg"></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-24 w-full bg-slate-700/50 rounded-lg"></div>
            <div className="h-24 w-full bg-slate-700/50 rounded-lg"></div>
          </div>
          <div className="h-32 w-full bg-slate-700/50 rounded-lg mt-6"></div>
        </div>
      </div>
    </div>
  </div>
);

// ====================================================================================
// SUB-COMPONENT 1: CampaignOverviewTab (Now Responsive)
// ====================================================================================
const CampaignOverviewTab = ({ job }) => {
  const router = useRouter();

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      {/* Header Section */}
      <div className="bg-slate-700/50 p-4 sm:p-6 border-b border-slate-700">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          {getSafeValue(job, "title", "Untitled Campaign")}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-indigo-400" />
            <span>Posted: {formatDate(job.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="mr-2 text-indigo-400" />
            <span>
              {getSafeValue(job, "applications.length", 0)} Applications
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
            Campaign Overview
          </h2>
          <p className="text-slate-300 whitespace-pre-line">
            {getSafeValue(job, "description", "No description provided")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="flex items-center text-md sm:text-lg font-medium mb-3">
              <FiDollarSign className="mr-2 text-indigo-400" />
              Budget
            </h3>
            <p>
              ${getSafeValue(job, "budget.min", 0)} - $
              {getSafeValue(job, "budget.max", 0)}{" "}
              {getSafeValue(job, "budget.currency", "USD")}
            </p>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="flex items-center text-md sm:text-lg font-medium mb-3">
              <FiClock className="mr-2 text-indigo-400" />
              Timeline
            </h3>
            <p>Start: {formatDate(getSafeValue(job, "startDate"))}</p>
            <p>End: {formatDate(getSafeValue(job, "endDate"))}</p>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="flex items-center text-md sm:text-lg font-medium mb-3">
              <FiBarChart2 className="mr-2 text-indigo-400" />
              Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {getSafeValue(job, "platforms", []).length > 0 ? (
                job.platforms.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                  >
                    {p}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">Not specified</span>
              )}
            </div>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h3 className="flex items-center text-md sm:text-lg font-medium mb-3">
              Target Niches
            </h3>
            <div className="flex flex-wrap gap-2">
              {getSafeValue(job, "niches", []).length > 0 ? (
                job.niches.map((n, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                  >
                    {n}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">Not specified</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
            Deliverables
          </h2>
          <div className="space-y-3">
            {getSafeValue(job, "deliverables", []).length > 0 ? (
              job.deliverables.map((d, i) => (
                <div key={i} className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="font-medium capitalize">
                    {d.type} (x{d.quantity})
                  </h3>
                  {d.description && (
                    <p className="mt-2 text-sm text-slate-300">
                      {d.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-400">No deliverables specified</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
            Influencer Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Engagement</h3>
              <p>
                <span className="text-slate-400">Min Rate: </span>
                {getSafeValue(job, "influencerCriteria.minEngagementRate")}%
              </p>
              <p>
                <span className="text-slate-400">Min Followers: </span>
                {getSafeValue(
                  job,
                  "influencerCriteria.minFollowers"
                )?.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Demographics</h3>
              <p>
                <span className="text-slate-400">Gender: </span>
                {getSafeValue(job, "influencerCriteria.gender", "any").replace(
                  /^\w/,
                  (c) => c.toUpperCase()
                )}
              </p>
              <p>
                <span className="text-slate-400">Age: </span>
                {getSafeValue(
                  job,
                  "influencerCriteria.ageRange.min",
                  "N/A"
                )} -{" "}
                {getSafeValue(job, "influencerCriteria.ageRange.max", "N/A")}
              </p>
            </div>
          </div>
        </div>

        {getSafeValue(job, "contentRequirements") &&
          getSafeValue(job, "contentRequirements") !== "Not specified" && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                Content Requirements
              </h2>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="whitespace-pre-line">{job.contentRequirements}</p>
              </div>
            </div>
          )}
      </div>

      <div className="bg-slate-700/50 p-4 border-t border-slate-700 flex justify-end">
        <button
          onClick={() =>
            router.push(`/dashboard/brand-owner/campaigns/${job._id}/edit`)
          }
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Edit Campaign
        </button>
      </div>
    </div>
  );
};

// ====================================================================================
// SUB-COMPONENT 2: ApplicantsTab (Now Responsive)
// ====================================================================================
const ApplicantsTab = ({
  applicants,
  searchTerm,
  onSearchChange,
  statusFilter,
  onFilterChange,
  onApplicantSelect,
}) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              <span className="text-indigo-400">{applicants.length}</span>{" "}
              Applications
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Showing {statusFilter === "all" ? "all" : `"${statusFilter}"`}{" "}
              applications
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
              <FiSearch className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>

              <option value="hired">Hired</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {applicants.length > 0 ? (
          <div className="space-y-3">
            {applicants.map((app) => (
              <div
                key={app._id}
                onClick={() => onApplicantSelect(app)}
                className="group bg-slate-750 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="relative mt-1 flex-shrink-0">
                      {app.influencer?.profilePhoto ? (
                        <img
                          src={app.influencer.profilePhoto}
                          alt={app.influencer.fullName}
                          className="w-12 h-12 rounded-full object-cover bg-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FiUser className="text-white" size={20} />
                        </div>
                      )}
                      {app.status === "hired" && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-slate-750">
                          <FiCheck className="text-white text-xs" />
                        </div>
                      )}
                      {app.status === "completed" && (
                        <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5 border-2 border-slate-750">
                          <FiAward className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-y-1">
                        <h3 className="font-medium text-white truncate pr-2">
                          {app.influencer?.fullName || "Unknown Influencer"}
                        </h3>
                        <span
                          className={`text-xs rounded-full capitalize flex items-center flex-shrink-0 ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status}
                        </span>
                      </div>
                      {app.title && (
                        <p className="text-sm text-slate-400 truncate mt-1">
                          {app.title}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center mt-3 gap-x-3 gap-y-2 text-xs sm:text-sm">
                        {app.quote && (
                          <span className="flex items-center bg-slate-700/50 px-2.5 py-1 rounded-full">
                            <FiDollarSign
                              className="mr-1.5 text-indigo-400"
                              size={12}
                            />
                            {app.quote.toLocaleString()} ETB
                          </span>
                        )}
                        <span className="flex items-center text-slate-400">
                          <FiCalendar className="mr-1.5" size={12} />
                          Applied {formatDate(app.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FiChevronRight className="text-slate-500 group-hover:text-indigo-400 ml-2 mt-1 transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-slate-600 mb-4 flex items-center justify-center">
              <FiUsers className="w-16 h-16 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-1">
              {searchTerm || statusFilter !== "all"
                ? "No matching applications found"
                : "No applications yet"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search or filter."
                : statusFilter !== "all"
                ? `No applications with "${statusFilter}" status.`
                : "Share your campaign to attract applicants."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ====================================================================================
// MAIN PAGE COMPONENT
// ====================================================================================
export default function JobDetailsPage({ params }) {
  const router = useRouter();
  const { id: campaignId } = use(params); // Correctly get ID from params
  const {
    job,
    loading,
    error,
    activeTab,
    setActiveTab,
    filteredApplicants,
    selectedApplicant,
    setSelectedApplicant,
    handleStatusUpdate,
    handleInterview,
    isUpdatingStatus,
    isCreatingThread,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  } = useCampaignDetails(campaignId);

  if (loading) return <CampaignDetailsSkeleton />;

  if (error || !job) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 text-center">
        <div className="text-red-400">
          <p>{error || "Campaign not found."}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-slate-700 rounded-lg transition-colors hover:bg-slate-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-400 hover:text-indigo-300 flex items-center transition-colors text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-2" />
            Back to Campaigns
          </button>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
              job.status
            )}`}
          >
            {job.status || "Draft"}
          </span>
        </div>

        <div className="flex border-b border-slate-700 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 sm:px-6 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Campaign Overview
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-4 py-3 sm:px-6 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "applicants"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Applicants ({filteredApplicants.length})
          </button>
        </div>

        {activeTab === "overview" ? (
          <CampaignOverviewTab job={job} />
        ) : (
          <ApplicantsTab
            applicants={filteredApplicants}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onApplicantSelect={setSelectedApplicant}
          />
        )}
      </div>

      <ApplicantDetailsModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onStatusUpdate={handleStatusUpdate}
        onInterview={handleInterview}
        isUpdatingStatus={isUpdatingStatus}
        isCreatingThread={isCreatingThread}
        campaignId={campaignId}
      />
    </div>
  );
}
