"use client";

import {
  FiUser,
  FiCheck,
  FiAward,
  FiLink,
  FiExternalLink,
  FiX,
  FiMessageSquare,
} from "react-icons/fi";
import Link from "next/link";
import { formatDate, getStatusColor } from "./ui-helpers"; // Import helpers

export default function ApplicantDetailsModal({
  applicant,
  onClose,
  onStatusUpdate,
  onInterview,
  isUpdatingStatus,
  isCreatingThread,
  campaignId,
}) {
  if (!applicant) return null;
  console.log("Applicant Details:", applicant);
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-slate-800/90 backdrop-blur-sm p-4 border-b border-slate-700 flex justify-between items-center z-10 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">
            Application Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          {/* Header with photo and name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                {applicant.influencer?.profilePhoto ? (
                  <img
                    src={applicant.influencer.profilePhoto}
                    alt={applicant.influencer.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-white" size={24} />
                )}
              </div>
              {applicant.status === "hired" && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <FiCheck className="text-white text-xs" />
                </div>
              )}
              {applicant.status === "completed" && (
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1">
                  <FiAward className="text-white text-xs" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {applicant.influencer?.fullName || "Unknown Influencer"}
                </h3>
                <select
                  value={applicant.status}
                  onChange={(e) =>
                    onStatusUpdate(applicant._id, e.target.value, campaignId)
                  }
                  disabled={isUpdatingStatus}
                  className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(
                    applicant.status
                  )} border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="pending">Pending</option>
                  <option value="hired">Hired</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {applicant.title && (
                <div className="mt-2 bg-slate-750 inline-block px-3 py-1 rounded-lg">
                  <p className="text-sm text-slate-300">{applicant.title}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-750 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                APPLICATION DATE
              </h4>
              <p className="text-white">{formatDate(applicant.createdAt)}</p>
            </div>
            <div className="bg-slate-750 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                QUOTED RATE
              </h4>
              <p className="text-white">
                {applicant.quote
                  ? `${applicant.quote.toLocaleString()} ETB`
                  : "Not specified"}
              </p>
            </div>
          </div>

          {/* Proposal and Portfolio sections */}
          {applicant.proposal && (
            <div className="bg-slate-750 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                PROPOSAL
              </h4>
              <p className="text-slate-300 whitespace-pre-line">
                {applicant.proposal}
              </p>
            </div>
          )}
          {applicant.portfolioLinks?.length > 0 && (
            <div className="bg-slate-750 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                PORTFOLIO LINKS ({applicant.portfolioLinks.length})
              </h4>
              <ul className="space-y-2">
                {applicant.portfolioLinks.map((link, index) => (
                  <li key={index} className="flex items-center">
                    <FiLink className="text-indigo-400 mr-2 flex-shrink-0" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 hover:underline truncate transition-colors"
                    >
                      {link}
                    </a>
                    <FiExternalLink className="text-slate-500 ml-1" size={12} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <Link
                href={`/find-influencer/${applicant.influencer?._id}`}
                className="flex items-center justify-center px-4 py-2.5 border border-slate-600 hover:border-indigo-400 text-slate-300 hover:text-white rounded-lg transition-colors text-sm"
              >
                <FiUser className="mr-2" />
                View Full Profile
              </Link>
              <button
                onClick={() => onInterview(applicant.influencer)}
                disabled={isCreatingThread}
                className={`flex items-center justify-center px-4 py-2.5 border border-slate-600 rounded-lg transition-colors text-sm w-40 ${
                  isCreatingThread
                    ? "bg-blue-600/40 text-slate-300 cursor-wait"
                    : "hover:border-blue-400 text-slate-300 hover:text-white bg-blue-600/20 hover:bg-blue-600/40"
                }`}
              >
                {isCreatingThread ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4" /*...spinner svg...*/
                    ></svg>
                    Starting...
                  </>
                ) : (
                  <>
                    <FiMessageSquare className="mr-2" />
                    Interview Now
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => onStatusUpdate(applicant._id, "hired", campaignId)}
              disabled={isUpdatingStatus || applicant.status === "hired"}
              className={`px-6 py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors w-48 ${
                applicant.status === "hired"
                  ? "bg-green-600/50 text-green-200 cursor-not-allowed"
                  : isUpdatingStatus
                  ? "bg-indigo-600/70 text-white cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isUpdatingStatus ? (
                <> {/* spinner */} Processing...</>
              ) : applicant.status === "hired" ? (
                "Already Hired"
              ) : (
                "Hire This Influencer"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
