"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiDollarSign,
  FiTag,
  FiArrowRight,
  FiUsers,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

// --- Skeleton Components for Loading State (Unchanged) ---
const JobCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-6 w-32 bg-slate-700 rounded-md"></div>
        <div className="h-5 w-48 bg-slate-700 rounded-md"></div>
      </div>
      <div className="h-5 w-20 bg-slate-700 rounded-full"></div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-4 w-1/2 bg-slate-700 rounded-md"></div>
      <div className="h-4 w-2/3 bg-slate-700 rounded-md"></div>
      <div className="h-5 w-1/3 bg-slate-700 rounded-md mt-2"></div>
    </div>
    <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
  </div>
);

// --- Helper Function (from above) ---
const getProposalRangeText = (count) => {
  if (count === undefined || count === null) return null; // Return null to render nothing
  if (count === 0) return "";
  if (count <= 5) return "1-5 Proposals";
  if (count <= 10) return "5-10 Proposals";
  if (count <= 20) return "10-20 Proposals";
  return "20+ Proposals";
};

// --- UI Sub-Components ---
const JobCard = ({ job }) => {
  // Assuming your job object now has a `proposalCount` property, e.g., job.proposalCount = 12
  const proposalText = getProposalRangeText(job.applications.length);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 flex flex-col group">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors ">
              {job.title}
            </h2>
            <p className="text-sm text-slate-400">{job.brand?.companyName}</p>
          </div>
          <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
        </div>

        <p className="text-slate-300 text-sm mb-5 leading-relaxed line-clamp-2">
          {job.description}
        </p>

        <div className="space-y-3 mb-5 text-sm">
          <div className="flex items-center text-slate-400 gap-2">
            <FiTag className="text-indigo-500" />
            <span className="capitalize">{job.niches.join(", ")}</span>
          </div>
          <div className="flex items-center text-slate-400 gap-2">
            <FiUsers className="text-indigo-500" />
            <span>
              Followers: {job.influencerCriteria.minFollowers?.toLocaleString()}
              +
            </span>
          </div>
          {/* <div className="flex items-center text-slate-400 gap-2">
            <FiTrendingUp className="text-indigo-500" />
            <span>
              Engagement: {job.influencerCriteria.minEngagementRate}%+
            </span>
          </div> */}

          {/* --- NEW SECTION TO SHOW PROPOSALS --- */}
          {proposalText && ( // <-- 2. Conditionally render only if there's text to show
            <div className="flex items-center text-slate-400 gap-2">
              <FiFileText className="text-indigo-500" />{" "}
              {/* <-- 3. The new icon */}
              <span>{proposalText}</span>{" "}
              {/* <-- 4. The formatted proposal text */}
            </div>
          )}
          {/* --- END OF NEW SECTION --- */}
        </div>
      </div>
      <div className="p-6 pt-0 border-t border-slate-700/50 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-green-400 font-bold">
            <FiDollarSign size={20} />
            <span>
              {job.budget.min.toLocaleString()} -{" "}
              {job.budget.max.toLocaleString()}
            </span>
          </div>
          <Link
            href={`/jobs/${job._id}`}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors gap-2"
          >
            Details <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED FilterBar to accept dynamic options ---
const FilterBar = ({
  filters,
  handleFilterChange,
  searchTerm,
  handleSearchChange,
  uniqueNiches, // Now accepts unique niches
}) => (
  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search Input */}
      <div className="lg:col-span-2 relative">
        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, brand, or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      {/* Niche Filter (Now Dynamic) */}
      <div className="relative">
        <FiTag className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
        <select
          name="niche"
          value={filters.niche}
          onChange={handleFilterChange}
          className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
        >
          <option value="">All Niches</option>
          {uniqueNiches.map((niche) => (
            <option key={niche} value={niche}>
              {niche}
            </option>
          ))}
        </select>
      </div>
      {/* Price Filter (Remains hardcoded) */}
      <div className="relative">
        <FiDollarSign className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
        <select
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
          className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
        >
          <option value="">All Budgets</option>
          <option value="400">$400+</option>
          <option value="600">$600+</option>
          <option value="800">$800+</option>
          <option value="1000">$1,000+</option>
        </select>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
export default function JobsPage() {
  // State for the complete, unfiltered list of jobs from the API
  const [allJobs, setAllJobs] = useState([]);
  // State to hold the dynamically generated unique niches for the filter
  const [uniqueNiches, setUniqueNiches] = useState([]);

  // State for the current filter values and search term
  const [filters, setFilters] = useState({ price: "", niche: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch ALL jobs ONCE on component mount
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/campaigns`);
        const data = await res.json();
        const jobsData = data.campaigns || [];
        setAllJobs(jobsData);

        // --- Logic to extract unique niches from the fetched data ---
        const allNichesFromData = jobsData.flatMap((job) => job.niches);
        const uniqueNichesData = [...new Set(allNichesFromData)];
        setUniqueNiches(uniqueNichesData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, []); // Empty dependency array ensures this runs only once

  // Perform filtering on the client-side whenever the master list or filters change
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const searchLower = searchTerm.toLowerCase();
      const priceThreshold = parseInt(filters.price, 10);

      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchLower) ||
        job.brand?.companyName.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower);

      const matchesNiche =
        filters.niche === "" || job.niches.includes(filters.niche);

      const matchesPrice = !priceThreshold || job.budget.max >= priceThreshold;

      return matchesSearch && matchesNiche && matchesPrice;
    });
  }, [allJobs, searchTerm, filters]);

  // Handlers to update state
  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 py-10 bg-slate-800/20 rounded-2xl">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Influencer <span className="text-indigo-400">Job Board</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Discover your next brand collaboration from our curated list of
            opportunities.
          </p>
        </header>

        <FilterBar
          filters={filters}
          handleFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          uniqueNiches={uniqueNiches}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeletons while loading the initial data
            [...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
          ) : filteredJobs.length > 0 ? (
            // Display the filtered jobs
            filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            // Display a message if no jobs match the filters
            <div className="col-span-full text-center py-16 bg-slate-800/50 rounded-lg">
              <h3 className="text-2xl font-semibold text-slate-300">
                No Jobs Found
              </h3>
              <p className="text-slate-500 mt-2">
                Try adjusting your search or filters to find new opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
