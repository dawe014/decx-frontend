"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiCheck,
  FiX,
  FiExternalLink,
  FiCalendar,
  FiBarChart2,
  FiTag,
} from "react-icons/fi";

const CampaignCardSkeleton = () => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-3/4 h-6 bg-slate-700 rounded"></div>
      <div className="w-16 h-5 bg-slate-700 rounded-full"></div>
    </div>
    <div className="w-1/2 h-4 bg-slate-700 rounded mb-6"></div>
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div>
        <div className="h-3 w-12 bg-slate-700 rounded mb-2"></div>
        <div className="h-5 w-20 bg-slate-700 rounded"></div>
      </div>
      <div>
        <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
        <div className="h-5 w-8 bg-slate-700 rounded"></div>
      </div>
      <div>
        <div className="h-3 w-14 bg-slate-700 rounded mb-2"></div>
        <div className="h-5 w-24 bg-slate-700 rounded"></div>
      </div>
    </div>
    <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
  </div>
);

const CampaignSkeleton = () => (
  <div className="space-y-6">
    <div className="border-b border-slate-700">
      <div className="flex space-x-8 animate-pulse">
        <div className="h-5 w-12 bg-slate-700 rounded my-4"></div>
        <div className="h-5 w-16 bg-slate-700 rounded my-4"></div>
        <div className="h-5 w-20 bg-slate-700 rounded my-4"></div>
        <div className="h-5 w-24 bg-slate-700 rounded my-4"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <CampaignCardSkeleton key={index} />
        ))}
    </div>
  </div>
);

// --- Main Component ---
export default function CampaignManagement() {
  const [activeTab, setActiveTab] = useState("active");
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Simulate a longer fetch to see the skeleton
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const response = await fetch("/api/campaigns");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const campaignsData = Array.isArray(data.campaigns)
          ? data.campaigns.map((campaign) => ({
              ...campaign,
              brand:
                typeof campaign.brand === "object"
                  ? campaign.brand.companyName || campaign.brand.name
                  : campaign.brand,
            }))
          : [];

        setCampaigns(campaignsData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = Array.isArray(campaigns)
    ? campaigns.filter((campaign) => {
        if (activeTab === "all") return true;
        return campaign.status === activeTab;
      })
    : [];

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-900/30 text-green-400",
      pending: "bg-yellow-900/30 text-yellow-400",
      completed: "bg-blue-900/30 text-blue-400",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full capitalize ${
          colors[status] || "bg-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleCampaignAction = async (campaignId, action) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error("Failed to update campaign status");
      }

      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign._id === campaignId || campaign.id === campaignId
            ? {
                ...campaign,
                status: action === "approve" ? "active" : "rejected",
              }
            : campaign
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // --- THE ONLY CHANGE YOU NEED TO MAKE IN THIS FILE ---
  if (loading) {
    return <CampaignSkeleton />;
  }
  // --- END OF CHANGE ---

  if (error) {
    return (
      <div className="bg-red-900/30 text-red-400 p-4 rounded-lg">
        Error loading campaigns: {error}
      </div>
    );
  }

  // ... (rest of the component remains exactly the same)
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {["all", "active", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
          <p className="text-slate-400">No campaigns found for "{activeTab}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign._id || campaign.id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">
                  {campaign.title || "Untitled Campaign"}
                </h3>
                {getStatusBadge(campaign.status)}
              </div>

              <p className="text-sm text-slate-400 mb-6">
                Brand: {campaign.brand || "No brand specified"}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-400">Budget</p>
                  <p className="text-white font-medium">
                    {campaign.budget?.min || "N/A"} -{" "}
                    {campaign.budget?.max || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Influencers</p>
                  <p className="text-white font-medium">
                    {campaign.applications?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">End Date</p>
                  <p className="text-white font-medium">
                    {formatDate(campaign.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setViewingCampaign(campaign)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View Details
                </button>
                {campaign.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleCampaignAction(
                          campaign._id || campaign.id,
                          "approve"
                        )
                      }
                      className="text-green-400 hover:text-green-300 p-2"
                    >
                      <FiCheck size={18} />
                    </button>
                    <button
                      onClick={() =>
                        handleCampaignAction(
                          campaign._id || campaign.id,
                          "reject"
                        )
                      }
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <FiX size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Details Modal (no changes needed here) */}
      {viewingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {viewingCampaign.title}
                  </h2>
                  <p className="text-indigo-400">{viewingCampaign.brand}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(viewingCampaign.status)}
                  <button
                    onClick={() => setViewingCampaign(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiBriefcase className="mr-2 text-indigo-400" />
                      Campaign Details
                    </h3>
                    <p className="text-slate-300">
                      {viewingCampaign.description ||
                        "No description available"}
                    </p>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">
                      Timeline
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Start Date</p>
                        <div className="text-white font-medium flex items-center">
                          <FiCalendar className="mr-2 text-indigo-400" />
                          {formatDate(viewingCampaign.startDate)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">End Date</p>
                        <div className="text-white font-medium flex items-center">
                          <FiCalendar className="mr-2 text-indigo-400" />
                          {formatDate(viewingCampaign.endDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {viewingCampaign.influencerCriteria && (
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">
                        Influencer Criteria
                      </h4>
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-900/30 p-3 rounded-lg">
                          <FiBarChart2 className="text-indigo-400" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">
                            Min Engagement Rate
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {viewingCampaign.influencerCriteria
                              .minEngagementRate || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {viewingCampaign.deliverables?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">
                        Content Deliverables
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {viewingCampaign.deliverables.map((item, index) => (
                          <div
                            key={index}
                            className="bg-slate-900/30 p-3 rounded-lg"
                          >
                            <p className="text-white font-medium">
                              {item.type || "Content"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.quantity || 0}{" "}
                              {item.quantity === 1 ? "post" : "posts"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">
                      Quick Stats
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-400">Budget Range</p>
                        <p className="text-white font-medium flex items-center">
                          <FiDollarSign className="mr-2 text-indigo-400" />
                          {viewingCampaign.budget?.min || "N/A"} -{" "}
                          {viewingCampaign.budget?.max || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Applications</p>
                        <p className="text-white font-medium flex items-center">
                          <FiUsers className="mr-2 text-indigo-400" />
                          {viewingCampaign.applications?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {viewingCampaign.platforms?.length > 0 && (
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">
                        Platforms
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingCampaign.platforms.map((platform, index) => (
                          <span
                            key={index}
                            className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingCampaign.niches?.length > 0 && (
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">
                        Niches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingCampaign.niches.map((niche, index) => (
                          <span
                            key={index}
                            className="bg-indigo-900/30 text-indigo-400 text-xs px-3 py-1 rounded-full flex items-center"
                          >
                            <FiTag className="mr-1" size={12} />
                            {niche}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link
                      href={`/jobs/${
                        viewingCampaign._id || viewingCampaign.id
                      }`}
                    >
                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
                        <FiExternalLink className="mr-2" />
                        View Full Campaign Post
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
