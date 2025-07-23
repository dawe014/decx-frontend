"use client";
import {
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiClock,
  FiMail,
  FiUser,
  FiChevronRight,
  FiSearch,
  FiEye,
  FiBriefcase,
  FiArrowLeft,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const JobDetailsPage = ({ params }) => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' or 'applicants'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { jobsId } = await params;
        const response = await fetch(
          `/api/campaigns/${jobsId}?populate=applications`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJob(data.campaign);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const getSafeValue = (obj, path, defaultValue = "Not specified") => {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return defaultValue;
    }
    return result ?? defaultValue;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredApplicants =
    job?.applications?.filter((applicant) => {
      const nameMatch = applicant.influencer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const emailMatch = applicant.influencer?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return nameMatch || emailMatch;
    }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>Error loading job: {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p>Job not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const status = getSafeValue(job, "status", "draft");
  const statusDisplay = status || "Draft";

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            <FiArrowLeft className="mr-1" />
            Back to Jobs
          </button>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "active"
                ? "bg-green-900/30 text-green-400"
                : status === "draft"
                ? "bg-yellow-900/30 text-yellow-400"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {statusDisplay}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium ${
              activeTab === "overview"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Campaign Overview
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-4 py-2 font-medium ${
              activeTab === "applicants"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Applicants ({job.applications?.length || 0})
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-slate-700/50 p-6 border-b border-slate-700">
              <h1 className="text-2xl font-bold mb-2">
                {getSafeValue(job, "title", "Untitled Campaign")}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400">
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
            <div className="p-6 space-y-8">
              {/* Campaign Overview */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                  Campaign Overview
                </h2>
                <p className="text-slate-300">
                  {getSafeValue(job, "description", "No description provided")}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Budget */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <FiDollarSign className="mr-2 text-indigo-400" />
                    Budget
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Range:</span>
                      <span>
                        ${getSafeValue(job, "budget.min", 0)} - $
                        {getSafeValue(job, "budget.max", 0)}{" "}
                        {getSafeValue(job, "budget.currency", "USD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <FiClock className="mr-2 text-indigo-400" />
                    Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Start:</span>
                      <span>{formatDate(getSafeValue(job, "startDate"))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">End:</span>
                      <span>{formatDate(getSafeValue(job, "endDate"))}</span>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3">
                    <FiBarChart2 className="mr-2 text-indigo-400" />
                    Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getSafeValue(job, "platforms", []).length > 0 ? (
                      job.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                        >
                          {platform}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>

                {/* Niches */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Target Niches</h3>
                  <div className="flex flex-wrap gap-2">
                    {getSafeValue(job, "niches", []).length > 0 ? (
                      job.niches.map((niche, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                        >
                          {niche}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Not specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                  Deliverables
                </h2>
                <div className="space-y-3">
                  {getSafeValue(job, "deliverables", []).length > 0 ? (
                    job.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/30 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium capitalize">
                              {getSafeValue(deliverable, "type", "unknown")}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                              Quantity:{" "}
                              {getSafeValue(deliverable, "quantity", 0)}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-slate-800 rounded text-xs">
                            {getSafeValue(deliverable, "status", "pending")}
                          </span>
                        </div>
                        {deliverable.description && (
                          <p className="mt-2 text-slate-300">
                            {deliverable.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No deliverables specified</p>
                  )}
                </div>
              </div>

              {/* Influencer Criteria */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                  Influencer Requirements
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Engagement</h3>
                    <p>
                      <span className="text-slate-400">Minimum Rate: </span>
                      {getSafeValue(
                        job,
                        "influencerCriteria.minEngagementRate"
                      )}
                      %
                    </p>
                    <p className="mt-1">
                      <span className="text-slate-400">
                        Minimum Followers:{" "}
                      </span>
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
                      {getSafeValue(job, "influencerCriteria.gender") === "any"
                        ? "Any"
                        : getSafeValue(job, "influencerCriteria.gender")
                            ?.charAt(0)
                            ?.toUpperCase() +
                          getSafeValue(job, "influencerCriteria.gender")?.slice(
                            1
                          )}
                    </p>
                    <p className="mt-1">
                      <span className="text-slate-400">Age Range: </span>
                      {getSafeValue(
                        job,
                        "influencerCriteria.ageRange.min",
                        "N/A"
                      )}{" "}
                      -{" "}
                      {getSafeValue(
                        job,
                        "influencerCriteria.ageRange.max",
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Requirements */}
              {getSafeValue(job, "contentRequirements") && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-400 border-b border-slate-700 pb-2">
                    Content Requirements
                  </h2>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <p className="whitespace-pre-line">
                      {job.contentRequirements}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-700/50 p-4 border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => router.push(`/brand/jobs/${job._id}/edit`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
              >
                Edit Campaign
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-indigo-400">
                  Applications
                </h2>
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
              </div>

              {filteredApplicants.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplicants.map((application) => (
                    <div
                      key={application._id}
                      className="bg-slate-700/30 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/brand/applications/${application._id}`)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center mt-1">
                            <FiUser className="text-indigo-400" size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">
                                {application.influencer?.name ||
                                  "Unknown Influencer"}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                {application.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 flex items-center mt-1">
                              <FiMail className="mr-1" size={14} />
                              {application.influencer?.email ||
                                "No email provided"}
                            </p>
                            {application.proposal && (
                              <p className="text-slate-300 text-sm mt-2 line-clamp-2">
                                {application.proposal}
                              </p>
                            )}
                            <div className="flex items-center mt-3 space-x-4">
                              {application.quote && (
                                <span className="flex items-center text-sm">
                                  <FiDollarSign className="mr-1 text-indigo-400" />
                                  {formatCurrency(application.quote)}
                                </span>
                              )}
                              <span className="flex items-center text-sm text-slate-400">
                                <FiCalendar className="mr-1" />
                                Applied {formatDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-400 ml-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-slate-600 mb-4 flex items-center justify-center">
                    <FiUsers className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-thin text-slate-300 mb-1">
                    {searchTerm
                      ? "No matching applications found"
                      : "No applications yet"}
                  </h3>
                  <p className="text-slate-500">
                    {searchTerm
                      ? "Try a different search term"
                      : "Your campaign hasn't received any applications yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
