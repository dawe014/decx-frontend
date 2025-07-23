"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiStar,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiUsers,
  FiMail,
} from "react-icons/fi";
import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// In a real app, move these to a utils/formatters.js file
const formatNumber = (num) => {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// In a real app, move to constants/index.js
const TABS = {
  ABOUT: "About",
  STATS: "Statistics",
  PORTFOLIO: "Portfolio",
  RATES: "Rates",
};

const socialIcons = {
  Instagram: FaInstagram,
  Youtube: FaYoutube,
  Tiktok: FaTiktok,
  Twitter: FaTwitter,
  Facebook: FaFacebook,
  Linkedin: FaLinkedin,
};

// --- Reusable Components (could be in their own files) ---

const ProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div className="w-48 h-48 rounded-full bg-slate-700 mx-auto"></div>
        <div className="h-6 bg-slate-700 rounded w-3/4 mx-auto mt-4"></div>
        <div className="h-12 bg-slate-700 rounded w-full mt-6"></div>
        <div className="h-40 bg-slate-800 rounded-xl w-full mt-8"></div>
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4">
        <div className="h-10 bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/3 mt-4"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
          <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-12 border-b border-slate-700 mt-6"></div>
        <div className="h-6 bg-slate-700 rounded w-1/4 mt-8"></div>
        <div className="h-20 bg-slate-700 rounded w-full mt-4"></div>
      </div>
    </div>
  </div>
);

const InfoCard = ({ title, children, icon: Icon }) => (
  <div className="bg-slate-800/50 rounded-xl p-6">
    <h3 className="flex items-center text-lg font-semibold mb-4">
      {Icon && <Icon className="text-indigo-400 mr-3" />}
      {title}
    </h3>
    {children}
  </div>
);

const ProfileSidebar = ({ influencer }) => {
  const calculateAverageEngagement = () => {
    if (!influencer.socialMedia || influencer.socialMedia.length === 0)
      return 0;
    const total = influencer.socialMedia.reduce(
      (sum, p) => sum + (p.engagementRate || 0),
      0
    );
    return total / influencer.socialMedia.length;
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center">
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-500/30 group">
        <Image
          src={influencer.profilePhoto || "/default-profile.png"}
          alt={influencer.fullName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        {influencer.socialMedia?.map((social) => {
          const Icon = socialIcons[social.platform];
          return Icon ? (
            <Link
              key={social.platform}
              href={social.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transform hover:scale-110 transition-transform"
            >
              <Icon size={24} />
            </Link>
          ) : null;
        })}
      </div>

      <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
        Invite to Campaign
      </button>

      <div className="w-full mt-8">
        <InfoCard title="Audience Snapshot">
          <ul className="space-y-3">
            {influencer.socialMedia?.map((p) => (
              <li
                key={p.platform}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-400">{p.platform}:</span>
                <span className="font-medium">{formatNumber(p.followers)}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </div>
  );
};

const ProfileHeader = ({ influencer }) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
      <h1 className="text-3xl lg:text-4xl font-extrabold">
        {influencer.fullName}
      </h1>
      {influencer.isFeatured && (
        <span className="flex items-center text-indigo-400 text-sm font-medium mt-2 sm:mt-0">
          <FiCheckCircle className="mr-1" /> Featured Influencer
        </span>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-300 mb-6">
      {/* <div className="flex items-center">
        <FiStar className="text-yellow-400 mr-2" />
        <span className="font-semibold">
          {influencer.rating?.average?.toFixed(1) || "N/A"}
        </span>
        <span className="ml-1 text-slate-400">
          ({influencer.rating?.count || 0} reviews)
        </span>
      </div> */}
      <div className="flex items-center">
        <FiMapPin className="text-indigo-400 mr-2" />
        <span>
          {influencer.location?.city || "Unknown"},{" "}
          {influencer.location?.country || "Unknown"}
        </span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {influencer.niches?.map((niche) => (
        <span
          key={niche}
          className="bg-indigo-600/20 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-500/30"
        >
          {niche}
        </span>
      ))}
    </div>
  </>
);

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-slate-700 mb-8">
    <nav className="flex space-x-8">
      {Object.values(TABS).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === tab
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  </div>
);

const TabContent = ({ activeTab, influencer }) => {
  const content = {
    [TABS.ABOUT]: (
      <InfoCard title="About Me">
        <p className="text-slate-300 whitespace-pre-line">
          {influencer.bio || "This influencer hasn't provided a bio yet."}
        </p>
      </InfoCard>
    ),
    [TABS.STATS]: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencer.socialMedia?.map((p) => (
            <InfoCard
              key={p.platform}
              title={p.platform}
              icon={socialIcons[p.platform]}
            >
              {p.handle && (
                <p className="text-sm text-slate-400 -mt-3 mb-3">@{p.handle}</p>
              )}
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Followers:</span>{" "}
                  <strong>{formatNumber(p.followers)}</strong>
                </li>
              </ul>
            </InfoCard>
          ))}
        </div>
      </div>
    ),
    [TABS.PORTFOLIO]: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Portfolio Highlights</h2>
        {influencer.portfolio?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {influencer.portfolio.map((item, index) => (
              <div
                // Using a unique ID from the data is better for keys
                key={item._id || index}
                className="bg-slate-800/50 rounded-xl overflow-hidden flex flex-col"
              >
                {/* Media Section */}
                {item.mediaUrl && (
                  <div className="relative h-56 w-full bg-slate-900">
                    {/* --- CONDITIONAL RENDERING LOGIC --- */}
                    {item.mediaType === "video" ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // Default to Image if not a video
                      <Image
                        src={item.mediaUrl}
                        alt={item.title || "Portfolio media"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-semibold mb-2">
                    {item.title || "Untitled Project"}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4 flex-grow">
                    {item.description || "No description provided."}
                  </p>

                  {/* Metrics Section */}
                  {item.metrics && (
                    <div className="border-t border-slate-700 pt-3 flex justify-around text-center text-sm mt-auto">
                      <div>
                        <strong className="block">
                          {formatNumber(item.metrics.likes)}
                        </strong>
                        <span className="text-slate-400">Likes</span>
                      </div>
                      <div>
                        <strong className="block">
                          {formatNumber(item.metrics.comments)}
                        </strong>
                        <span className="text-slate-400">Comments</span>
                      </div>
                      <div>
                        <strong className="block">
                          {formatNumber(item.metrics.reach)}
                        </strong>
                        <span className="text-slate-400">Reach</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No portfolio items to display.</p>
        )}
      </div>
    ),
    [TABS.RATES]: (
      <InfoCard title="Standard Rates" icon={FiDollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {influencer.services?.map((service) => (
            <div key={service.name} className="flex justify-between">
              <span className="text-slate-400 capitalize">{service.name}:</span>
              <span className="font-medium">${service.fee || "N/A"}</span>
            </div>
          ))}
        </div>
        {(!influencer.services || influencer.services.length === 0) && (
          <p className="text-slate-400">Rates are available upon request.</p>
        )}
      </InfoCard>
    ),
  };

  return <div>{content[activeTab]}</div>;
};

// --- Main Page Component ---

const InfluencerProfilePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.ABOUT);

  useEffect(() => {
    const fetchInfluencer = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // This is where you would fetch your data.
        // For demonstration, I'm using a timeout with mock data.
        const response = await fetch(`/api/influencers/${id}`);
        if (!response.ok) throw new Error("Failed to fetch influencer data.");

        const data = await response.json();
        setInfluencer(data.influencer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <ProfileSkeleton />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }
  if (!influencer) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        Influencer not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-400 hover:text-indigo-300 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Search
        </button>
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <ProfileSidebar influencer={influencer} />

          <div className="w-full md:w-2/3 lg:w-3/4">
            <ProfileHeader influencer={influencer} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
              <InfoCard title="Key Info" icon={FiUsers}>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FiGlobe className="mr-3 text-slate-500" />
                    Speaks:{" "}
                    {influencer.languages?.map((l) => l.name).join(", ") ||
                      "N/A"}
                  </li>
                  <li className="flex items-center">
                    <FiCalendar className="mr-3 text-slate-500" />
                    Availability:{" "}
                    <span className="capitalize ml-1">
                      {influencer.availability || "N/A"}
                    </span>
                  </li>
                  {/* <li className="flex items-center">
                    <FiMail className="mr-3 text-slate-500" />
                    Contact Email: {influencer.email || "Not provided"}
                  </li> */}
                </ul>
              </InfoCard>
            </div>

            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabContent activeTab={activeTab} influencer={influencer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfilePage;
