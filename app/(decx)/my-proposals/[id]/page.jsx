"use client";

import { useState, useEffect, use } from "react";
import {
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiExternalLink,
  FiEdit2,
  FiMessageSquare,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// --- Skeleton Component for Loading State ---
function ApplicationDetailsSkeleton() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-700 rounded-md"></div>
          <div className="h-5 w-64 bg-slate-700 rounded-md"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="w-3/4">
                  <div className="h-8 w-4/5 bg-slate-700 rounded-md mb-4"></div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-700 mr-3"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-slate-700 rounded-md"></div>
                      <div className="h-4 w-24 bg-slate-700 rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-32 bg-slate-700 rounded-full"></div>
              </div>
              <div className="h-10 w-48 bg-slate-700 rounded-lg mt-6"></div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="h-6 w-1/3 bg-slate-700 rounded-md mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-700 rounded-md"></div>
                <div className="h-4 w-full bg-slate-700 rounded-md"></div>
                <div className="h-4 w-3/4 bg-slate-700 rounded-md"></div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="h-6 w-1/3 bg-slate-700 rounded-md mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 w-full bg-slate-700/50 rounded-lg"></div>
                <div className="h-10 w-full bg-slate-700/50 rounded-lg"></div>
              </div>
            </div>
          </div>
          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="h-6 w-1/2 bg-slate-700 rounded-md mb-8"></div>
              <div className="space-y-4">
                <div className="h-12 w-full bg-slate-700 rounded-lg"></div>
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
const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isError,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
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
          <div className="flex justify-end space-x-3">
            {!isError && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-medium"
              >
                {cancelText || "Cancel"}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isError
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {confirmText || (isError ? "OK" : "Confirm")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Main Page Component ---
export default function ApplicationDetailsPage({ params }) {
  // --- State ---
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false });
  const router = useRouter();
  const { id } = use(params);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok)
          throw new Error("Failed to fetch application details");
        const data = await response.json();
        setApplication(data.application);

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
    fetchApplication();
  }, [id]);

  // --- Helper Functions ---
  const getStatusInfo = (status) => {
    switch (status) {
      case "hired":
        return {
          icon: <FiCheckCircle />,
          color: "bg-green-900/50 text-green-300 border-green-500/30",
        };
      case "rejected":
        return {
          icon: <FiXCircle />,
          color: "bg-red-900/50 text-red-300 border-red-500/30",
        };
      case "shortlisted":
        return {
          icon: <FiAlertCircle />,
          color: "bg-yellow-900/50 text-yellow-300 border-yellow-500/30",
        };
      case "completed":
        return {
          icon: <FiCheckCircle />,
          color: "bg-indigo-900/50 text-indigo-300 border-indigo-500/30",
        };
      default:
        return {
          icon: <FiLoader className="animate-spin" />,
          color: "bg-blue-900/50 text-blue-300 border-blue-500/30",
        };
    }
  };

  const formatPrice = (amount, currency) =>
    currency === "ETB"
      ? `${amount.toLocaleString()} ETB`
      : `$${amount.toLocaleString()}`;

  // --- Event Handlers ---
  const handleWithdrawApplication = () => {
    setModalState({
      isOpen: true,
      title: "Withdraw Application",
      message:
        "Are you sure you want to withdraw your application? This action cannot be undone.",
      confirmText: "Yes, Withdraw",
      cancelText: "Cancel",
      isError: false,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/applications/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to withdraw application"
            );
          }
          setModalState({
            isOpen: true,
            title: "Application Withdrawn",
            message: "Your application has been successfully withdrawn.",
            confirmText: "Go to Your Proposals",
            isError: true,
            onConfirm: () => {
              setModalState({ isOpen: false });
              router.push("/my-proposals");
            },
          });
        } catch (err) {
          setModalState({
            isOpen: true,
            title: "Error",
            message: err.message || "An error occurred while withdrawing.",
            confirmText: "OK",
            isError: true,
            onConfirm: () => setModalState({ isOpen: false }),
          });
        }
      },
      onClose: () => setModalState({ isOpen: false }),
    });
  };

  // --- Render Logic ---
  if (loading) return <ApplicationDetailsSkeleton />;
  if (error)
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-slate-300">
        <div className="max-w-md w-full text-center p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => router.push("/my-proposals")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Go Back to My Applications
          </button>
        </div>
      </div>
    );
  if (!application)
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-slate-300">
        <div className="max-w-md w-full text-center p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Application Not Found</h2>
          <p className="text-sm">
            The application you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/my-proposals")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Go Back to My Applications
          </button>
        </div>
      </div>
    );

  const statusInfo = getStatusInfo(application.status);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200">
      <Modal
        {...modalState}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />

      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/my-proposals"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
          >
            <FiArrowLeft /> Back to My Applications
          </Link>
          <div className="text-sm text-slate-400">
            Applied:{" "}
            <span className="font-medium text-slate-200">
              {format(new Date(application.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Header Card */}
            <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-3">
                    {campaign?.title || "Campaign"}
                  </h1>
                  <div className="flex items-center gap-3">
                    {campaign?.brand?.logo ? (
                      <Image
                        src={campaign.brand.logo}
                        alt={`${campaign.brand.companyName} logo`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover bg-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {campaign?.brand?.companyName || "Brand"}
                      </p>
                      <div
                        className={`flex items-center text-sm ${
                          application.viewedByBrand
                            ? "text-green-400"
                            : "text-slate-500"
                        }`}
                      >
                        {application.viewedByBrand ? (
                          <FiEye className="mr-1.5" />
                        ) : (
                          <FiEyeOff className="mr-1.5" />
                        )}
                        <span>
                          {application.viewedByBrand
                            ? "Viewed by brand"
                            : "Not viewed yet"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${statusInfo.color} border px-4 py-2 rounded-full flex items-center text-sm font-medium gap-2 self-start`}
                >
                  {statusInfo.icon}{" "}
                  <span className="capitalize">{application.status}</span>
                </div>
              </div>
              {campaign && (
                <div className="mt-6 border-t border-slate-700 pt-6">
                  <Link
                    href={`/jobs/${campaign._id}`}
                    className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors gap-2"
                  >
                    View Original Campaign <FiExternalLink />
                  </Link>
                </div>
              )}
            </section>

            {/* Your Proposal Card */}
            <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Your Proposal
                </h2>
                <button
                  onClick={() =>
                    router.push(`/my-proposals/${application?._id}/edit`)
                  }
                  className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm font-medium gap-1.5"
                >
                  <FiEdit2 size={14} /> Edit
                </button>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 prose-p:my-2 whitespace-pre-line">
                {application.proposal}
              </div>
            </section>

            {/* Portfolio Links Card */}
            <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Portfolio Links
              </h2>
              <div className="space-y-3">
                {application.portfolioLinks?.length > 0 ? (
                  application.portfolioLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline truncate text-sm"
                      >
                        {link}
                      </a>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white ml-4"
                      >
                        <FiExternalLink />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">
                    No portfolio links were submitted.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Actions & Status */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1 gap-2">
                    <FiDollarSign /> Your Quote
                  </div>
                  <div className="font-bold text-lg text-white">
                    {formatPrice(application.quote, campaign?.budget?.currency)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-slate-400 flex items-center text-sm mb-1 gap-2">
                    <FiClock /> Campaign Duration
                  </div>
                  <div className="font-semibold text-white">
                    {campaign?.startDate && campaign?.endDate
                      ? `${format(
                          new Date(campaign.startDate),
                          "MMM d"
                        )} - ${format(new Date(campaign.endDate), "d, yyyy")}`
                      : "Flexible"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Action Buttons */}
                {application.status === "pending" && (
                  <button
                    onClick={handleWithdrawApplication}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Withdraw Application
                  </button>
                )}
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <FiMessageSquare /> Message Brand
                </button>
              </div>

              {/* Status Information */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">
                  What to expect next
                </h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  {/* Dynamic Help Text */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
