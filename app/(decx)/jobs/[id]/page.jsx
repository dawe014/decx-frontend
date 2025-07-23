"use client";
import React, { useState, useEffect, use } from "react";
import {
  FiDollarSign,
  FiClock,
  FiMapPin,
  FiGlobe,
  FiHeart,
  FiShare2,
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiBarChart2,
  FiUser,
  FiUsers, // <-- ADDED ICON
  FiAward,
  FiMessageSquare,
  FiAlertTriangle,
  FiLoader,
  FiCheckCircle,
  FiGift,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

// --- Skeleton Component for Loading State ---
function JobDetailsSkeleton() {
  return (
    <div className="bg-slate-900 min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-6 w-32 bg-slate-700 rounded-md mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="h-8 w-3/4 bg-slate-700 rounded-md mb-4"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-700 rounded-md"></div>
                  <div className="h-4 w-24 bg-slate-700 rounded-md"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-16 bg-slate-700/50 rounded-lg"></div>
                <div className="h-16 bg-slate-700/50 rounded-lg"></div>
                <div className="h-16 bg-slate-700/50 rounded-lg"></div>
                <div className="h-16 bg-slate-700/50 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="h-6 w-1/4 bg-slate-700 rounded-md mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-700 rounded-md"></div>
                <div className="h-4 w-full bg-slate-700 rounded-md"></div>
                <div className="h-4 w-3/4 bg-slate-700 rounded-md"></div>
              </div>
            </div>
          </div>
          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-24">
              <div className="h-8 w-1/2 bg-slate-700 rounded-md mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
                <div className="h-24 w-full bg-slate-700 rounded-lg"></div>
                <div className="h-12 w-full bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UI Sub-Components ---
const InfoCard = ({ icon: Icon, title, children }) => (
  <div className="bg-slate-700/50 p-4 rounded-lg">
    <div className="flex items-center text-sm text-slate-400 mb-1 gap-2">
      <Icon />
      {title}
    </div>
    <div className="font-semibold text-white truncate">{children}</div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
      <Icon className="text-indigo-400" />
      {title}
    </h2>
    <div className="prose prose-sm prose-invert max-w-none text-slate-300">
      {children}
    </div>
  </div>
);
const getProposalRangeText = (count) => {
  if (count === undefined || count === null) return null; // Return null to render nothing
  if (count === 0) return "0";
  if (count <= 5) return "1-5 ";
  if (count <= 10) return "5-10 ";
  if (count <= 20) return "10-20 ";
  return "20+ ";
};
const ApplyForm = ({
  job,
  application,
  setApplication,
  handleSubmit,
  isApplying,
  formError,
}) => {
  const formatPrice = (min, max, currency) =>
    currency === "ETB"
      ? `${min.toLocaleString()} - ${max.toLocaleString()} ETB`
      : `$${min.toLocaleString()} - $${max.toLocaleString()}`;

  const handleInputChange = (e) =>
    setApplication((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePortfolioLinkChange = (index, value) => {
    const newLinks = [...application.portfolioLinks];
    newLinks[index] = value;
    setApplication((prev) => ({ ...prev, portfolioLinks: newLinks }));
  };
  const addPortfolioLink = () =>
    setApplication((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, ""],
    }));
  const removePortfolioLink = (index) =>
    setApplication((prev) => ({
      ...prev,
      portfolioLinks: application.portfolioLinks.filter((_, i) => i !== index),
    }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
      <h2 className="text-2xl font-bold text-white mb-6">Apply for this Job</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="rate"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Your Rate ({job.budget.currency})
          </label>
          <div className="relative">
            <FiDollarSign className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input
              id="rate"
              type="number"
              name="rate"
              value={application.rate}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder={`e.g., ${(job.budget.min + job.budget.max) / 2}`}
              min={job.budget.min}
              max={job.budget.max}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Budget:{" "}
            {formatPrice(job.budget.min, job.budget.max, job.budget.currency)}
          </p>
        </div>
        <div>
          <label
            htmlFor="coverLetter"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={application.coverLetter}
            onChange={handleInputChange}
            rows={5}
            required
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Explain why you're a great fit for this campaign..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Portfolio Links
          </label>
          <div className="space-y-2">
            {application.portfolioLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handlePortfolioLinkChange(i, e.target.value)}
                  required={i === 0}
                  className="flex-grow p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="https://your-portfolio.com"
                />
                {application.portfolioLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePortfolioLink(i)}
                    className="p-2.5 bg-slate-700 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
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
            <FiPlus /> Add another link
          </button>
        </div>
        <div>
          <label className="flex items-center text-sm text-slate-300">
            <input
              type="checkbox"
              checked={application.termsAgreed}
              onChange={(e) =>
                setApplication((prev) => ({
                  ...prev,
                  termsAgreed: e.target.checked,
                }))
              }
              required
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500 mr-2"
            />
            I agree to the terms and conditions
          </label>
        </div>
        {formError && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm text-red-300 flex items-start gap-2">
            <FiAlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isApplying || !application.termsAgreed}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? (
            <>
              <FiLoader className="animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
};

// --- Main Page Component ---
export default function JobDetailsPage({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [application, setApplication] = useState({
    rate: "",
    coverLetter: "",
    portfolioLinks: [""],
    termsAgreed: false,
  });
  const [isApplying, setIsApplying] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/campaigns/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data = await response.json();
        setJob(data.campaign);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    setFormError("");
    try {
      const response = await fetch(`/api/campaigns/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: Number(application.rate),
          coverLetter: application.coverLetter,
          portfolioLinks: application.portfolioLinks,
          campaignId: id,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.message || "Application failed. Please try again."
        );
      toast.success("Proposal submitted successfully!");
      router.push(`/my-proposals?highlight=${result.applicationId}`); // Redirect and highlight
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <JobDetailsSkeleton />;
  if (error || !job)
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">
            {error || "Job Not Found"}
          </h2>
          <p className="text-slate-400 mb-6">
            We couldn't find the job you were looking for.
          </p>
          <Link
            href="/jobs"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            href="/jobs"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
          >
            <FiArrowLeft /> Back to Jobs
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h1 className="text-3xl font-bold text-white mb-3">
                {job.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={job.brand.logo}
                  alt={`${job.brand.companyName} logo`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover bg-slate-700"
                />
                <div>
                  <p className="font-semibold text-white text-lg">
                    {job.brand.companyName}
                  </p>
                  <p className="text-sm text-slate-400">
                    Posted {format(new Date(job.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard icon={FiDollarSign} title="Budget">
                  ${job.budget.min.toLocaleString()} - $
                  {job.budget.max.toLocaleString()}
                </InfoCard>
                <InfoCard icon={FiClock} title="Duration">
                  {job.startDate
                    ? `${format(new Date(job.startDate), "MMM d")} - ${format(
                        new Date(job.endDate),
                        "d, yyyy"
                      )}`
                    : "Flexible"}
                </InfoCard>
                <InfoCard icon={FiMapPin} title="Location">
                  {job.targetLocations?.join(", ") || "Remote"}
                </InfoCard>
                <InfoCard icon={FiGlobe} title="Language">
                  {job.targetLanguages?.join(", ") || "Any"}
                </InfoCard>
              </div>
            </div>

            <SectionCard title="Campaign Description" icon={FiUser}>
              <p className="whitespace-pre-line">{job.description}</p>
            </SectionCard>

            <SectionCard title="Influencer Requirements" icon={FiBarChart2}>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <span className="font-semibold">Platforms:</span>{" "}
                  {job.platforms?.join(", ") || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Followers:</span>{" "}
                  {job.influencerCriteria?.minFollowers?.toLocaleString()}+
                </li>
                {/* <li>
                  <span className="font-semibold">Min. Engagement:</span>{" "}
                  {job.influencerCriteria?.minEngagementRate}%
                </li> */}
                <li>
                  <span className="font-semibold">Niches:</span>{" "}
                  {job.niches?.join(", ")}
                </li>
              </ul>
            </SectionCard>

            <SectionCard title="Deliverables " icon={FiGift}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-indigo-400 mb-2">
                    Deliverables
                  </h3>
                  <ul className="space-y-1 list-disc list-inside">
                    {job.deliverables?.length > 0 ? (
                      job.deliverables.map((d, i) => (
                        <li key={i}>
                          {d.quantity} {d.type}
                        </li>
                      ))
                    ) : (
                      <li>Not specified</li>
                    )}
                  </ul>
                </div>
                {/* <div>
                  <h3 className="font-semibold text-indigo-400 mb-2">Perks</h3>
                  <ul className="space-y-1 list-disc list-inside">
                    {job.perks?.length > 0 ? (
                      job.perks.map((p, i) => <li key={i}>{p}</li>)
                    ) : (
                      <li>Not specified</li>
                    )}
                  </ul>
                </div> */}
              </div>
            </SectionCard>

            <SectionCard
              title={`About ${job.brand.companyName}`}
              icon={FiMessageSquare}
            >
              <p className="whitespace-pre-line">{job.brand.description}</p>
              {job.brand.website && (
                <a
                  href={job.brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-indigo-400 font-semibold hover:underline"
                >
                  Visit Website →
                </a>
              )}
            </SectionCard>

            {/* --- NEW SECTION: JOB ACTIVITY --- */}
            <SectionCard title="Job Activity" icon={FiBarChart2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-2">
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
                  <FiUsers className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                  <div>
                    <div className="text-lg font-bold text-white">
                      {/* Assumes job object has this data. Update as needed. */}
                      {getProposalRangeText(job.applications?.length)}
                    </div>
                    <div className="text-sm text-slate-400">Proposals</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
                  <FiCheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="text-lg font-bold text-white">
                      {/* Assumes job object has this data. Update as needed. */}
                      {job.hiredInfluencers?.length || 0}
                    </div>
                    <div className="text-sm text-slate-400">Hired</div>
                  </div>
                </div>
              </div>
            </SectionCard>
            {/* --- END OF NEW SECTION --- */}
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-1">
            <ApplyForm
              job={job}
              application={application}
              setApplication={setApplication}
              handleSubmit={handleSubmitApplication}
              isApplying={isApplying}
              formError={formError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
