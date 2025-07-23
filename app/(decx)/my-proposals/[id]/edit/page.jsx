"use client";

import { useState, useEffect, use } from "react";
import {
  FiArrowLeft,
  FiDollarSign,
  FiLoader,
  FiPlus,
  FiTrash2,
  FiInfo,
  FiTag,
  FiTarget,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// --- Skeleton Component for Loading State ---
function EditApplicationSkeleton() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-slate-800 border-b border-slate-700 py-4 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-48 bg-slate-700 rounded-md"></div>
        </div>
      </div>
      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="h-8 w-3/4 bg-slate-700 rounded-md mb-6"></div>
            <div className="space-y-6">
              <div className="h-20 w-full bg-slate-700/50 rounded-lg"></div>
              <div className="h-32 w-full bg-slate-700/50 rounded-lg"></div>
              <div className="h-24 w-full bg-slate-700/50 rounded-lg"></div>
              <div className="h-12 w-full bg-slate-700 rounded-lg"></div>
            </div>
          </div>
          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="h-6 w-1/2 bg-slate-700 rounded-md mb-6"></div>
              <div className="space-y-4">
                <div className="h-16 w-full bg-slate-700/50 rounded-lg"></div>
                <div className="h-16 w-full bg-slate-700/50 rounded-lg"></div>
                <div className="h-12 w-full bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Animated Modal Component ---
const Modal = ({ isOpen, onClose, title, message, confirmText, isError }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md w-full shadow-2xl"
        >
          <h3
            className={`text-xl font-semibold ${
              isError ? "text-red-400" : "text-white"
            } mb-4`}
          >
            {title}
          </h3>
          <p className="text-slate-300 text-sm mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              {confirmText || "OK"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Main Page Component ---
export default function EditApplicationPage({ params }) {
  // --- State Management ---
  const [application, setApplication] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    proposal: "",
    quote: "",
    portfolioLinks: [""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false });
  const router = useRouter();
  const { id } = use(params);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok)
          throw new Error("Failed to fetch application details");
        const data = await response.json();
        setApplication(data.application);
        setFormData({
          proposal: data.application.proposal || "",
          quote: data.application.quote || "",
          portfolioLinks:
            data.application.portfolioLinks?.length > 0
              ? data.application.portfolioLinks
              : [""],
        });

        if (data.application.campaign) {
          const campaignResponse = await fetch(
            `/api/campaigns/${data.application.campaign}`
          );
          if (campaignResponse.ok) {
            const campaignData = await campaignResponse.json();
            setCampaign(campaignData.campaign);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePortfolioLinkChange = (index, value) => {
    const newLinks = [...formData.portfolioLinks];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, portfolioLinks: newLinks }));
  };

  const addPortfolioLink = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, ""],
    }));
  };

  const removePortfolioLink = (index) => {
    const newLinks = formData.portfolioLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, portfolioLinks: newLinks }));
  };

  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal: formData.proposal,
          quote: Number(formData.quote),
          portfolioLinks: formData.portfolioLinks.filter(
            (link) => link.trim() !== ""
          ),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update application");
      }

      setModalState({
        isOpen: true,
        title: "Application Updated",
        message: "Your application has been successfully updated.",
        onClose: () => {
          setModalState({ isOpen: false });
          router.push(`/my-proposals/${id}`);
        },
      });
    } catch (err) {
      setModalState({
        isOpen: true,
        title: "Update Failed",
        message: err.message,
        isError: true,
        onClose: () => setModalState({ isOpen: false }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (loading) return <EditApplicationSkeleton />;
  if (error)
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            href="/my-proposals"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  if (!application || !campaign)
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">
            Application Not Found
          </h2>
          <p className="text-slate-400 mb-6">
            The application you are trying to edit does not exist or has been
            deleted.
          </p>
          <Link
            href="/my-proposals"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  if (application.status !== "pending")
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <FiLock className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">
            Editing Locked
          </h2>
          <p className="text-slate-400 mb-6">
            This application cannot be edited because its status is no longer
            "Pending".
          </p>
          <Link
            href={`/my-proposals/${id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
          >
            View Application
          </Link>
        </div>
      </div>
    );

  const budget = campaign.budget;

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200">
      <Modal {...modalState} />
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/my-proposals/${id}`}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors w-fit"
          >
            <FiArrowLeft /> Cancel Edit
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Form */}
          <section className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="mb-6">
              <p className="text-sm text-indigo-400">Editing application for</p>
              <h1 className="text-3xl font-bold text-white">
                {campaign.title}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="quote"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Your Rate ({budget.currency})
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                  <input
                    id="quote"
                    type="number"
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder={`e.g., ${(budget.min + budget.max) / 2}`}
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Campaign budget is between {budget.min.toLocaleString()} -{" "}
                  {budget.max.toLocaleString()} {budget.currency}.
                </p>
              </div>

              <div>
                <label
                  htmlFor="proposal"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Cover Letter
                </label>
                <textarea
                  id="proposal"
                  name="proposal"
                  value={formData.proposal}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Explain why you're a great fit for this campaign..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Portfolio Links
                </label>
                <div className="space-y-3">
                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) =>
                          handlePortfolioLinkChange(index, e.target.value)
                        }
                        className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="https://your-portfolio.com/work"
                        required={index === 0}
                      />
                      {formData.portfolioLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePortfolioLink(index)}
                          className="p-3 bg-slate-700 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addPortfolioLink}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mt-3 flex items-center gap-2"
                >
                  <FiPlus size={16} /> Add another link
                </button>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Right Column - Campaign Info */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24 space-y-5">
              <h2 className="text-xl font-semibold text-white">
                Campaign Snapshot
              </h2>
              <div className="flex items-center gap-3">
                {campaign.brand?.logo && (
                  <Image
                    src={campaign.brand.logo}
                    alt={`${campaign.brand.companyName} logo`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover bg-slate-700"
                  />
                )}
                <p className="font-semibold text-white">
                  {campaign.brand?.companyName}
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                  <FiTag /> Niches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.niches?.map((n) => (
                    <span
                      key={n}
                      className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                    >
                      {n}
                    </span>
                  )) || (
                    <span className="text-sm text-slate-500">
                      Not specified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                  <FiTarget /> Requirements
                </h3>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Platforms: {campaign.platforms?.join(", ") || "N/A"}</li>
                  <li>
                    Min. Engagement:{" "}
                    {campaign.influencerCriteria?.minEngagementRate
                      ? `${campaign.influencerCriteria.minEngagementRate}%`
                      : "N/A"}
                  </li>
                </ul>
              </div>
              <div className="border-t border-slate-700 pt-5">
                <Link
                  href={`/jobs/${campaign._id}`}
                  target="_blank"
                  className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  View Full Campaign Details
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
