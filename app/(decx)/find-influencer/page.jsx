"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiGlobe,
  FiMapPin,
  FiStar,
  FiArrowRight,
  FiTag,
  FiFilter,
  FiX,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// --- Skeleton Components for Loading State ---
const InfluencerCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-2xl p-6 animate-pulse">
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 mb-4 rounded-full bg-slate-700"></div>
      <div className="h-7 w-3/4 bg-slate-700 rounded-md mb-3"></div>
      <div className="h-5 w-1/4 bg-slate-700 rounded-md mb-4"></div>
      <div className="flex flex-wrap gap-2 justify-center w-full mb-4">
        <div className="h-6 w-1/3 bg-slate-700 rounded-full"></div>
        <div className="h-6 w-1/4 bg-slate-700 rounded-full"></div>
      </div>
      <div className="h-12 w-full bg-slate-700 rounded-lg mt-4"></div>
    </div>
  </div>
);

// --- UI Sub-Components ---
const InfluencerCard = ({ influencer }) => {
  const router = useRouter();
  const socialIcons = {
    Facebook: FaFacebook,
    Twitter: FaTwitter,
    Instagram: FaInstagram,
    instagram: FaInstagram,
    Youtube: FaYoutube,
    youtube: FaYoutube,
    Tiktok: FaTiktok,
    Linkedin: FaLinkedin,
  };

  return (
    // Main container with subtle glow on hover for a premium feel
    <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 group transition-all duration-300 hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-900/50">
      {/* Featured Badge */}
      {influencer.isFeatured && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10">
          <FiStar className="inline-block -mt-1 mr-1.5" size={12} />
          Featured
        </div>
      )}

      {/* Main content flex container */}
      <div className="p-5 flex flex-col h-full">
        {/* 1. HEADER: Image, Name, and Rating */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={influencer.profilePhoto || "/default-profile.png"}
              alt={influencer.fullName}
              fill
              className="rounded-full object-cover border-2 border-slate-700 group-hover:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white leading-tight">
              {influencer.fullName}
            </h2>
            {/* <div className="flex items-center mt-1.5 text-sm text-slate-400">
              <FiStar className="text-yellow-400 fill-current" />
              <span className="text-white font-semibold ml-1.5">
                {influencer.rating.average.toFixed(1)}
              </span>
              <span className="ml-1">({influencer.rating.count} reviews)</span>
            </div> */}
          </div>
        </div>

        {/* 2. BODY: Details and Niches (takes up remaining space) */}
        <div className="flex-grow space-y-4 text-slate-300 text-sm">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-indigo-400 flex-shrink-0" size={16} />
            <span className="truncate capitalize">
              {influencer.location.city}, {influencer.location.country}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FiGlobe className="text-indigo-400 flex-shrink-0" size={16} />
            <span className="truncate capitalize">
              {influencer.languages?.map((l) => l.name).join(", ")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {influencer.niches.slice(0, 3).map((niche, i) => (
              <span
                key={i}
                className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full capitalize"
              >
                {niche}
              </span>
            ))}
          </div>
        </div>

        {/* 3. FOOTER: Social Icons and Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {influencer.socialMedia.slice(0, 4).map((social, i) => {
              const Icon = socialIcons[social.platform];
              return Icon ? (
                <Link
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-400 transition-colors"
                  aria-label={social.platform}
                >
                  <Icon size={20} />
                </Link>
              ) : null;
            })}
          </div>
          <button
            onClick={() => router.push(`/find-influencer/${influencer._id}`)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm flex items-center gap-2"
          >
            Profile
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
const FilterControls = ({
  filters,
  handleFilterChange,
  niches,
  locations,
  languages,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="relative">
      <FiTag className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
      <select
        name="niche"
        onChange={handleFilterChange}
        value={filters.niche}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="">All Niches</option>
        {niches.map((n) => (
          <option key={n} value={n} className="capitalize">
            {n}
          </option>
        ))}
      </select>
    </div>
    <div className="relative">
      <FiMapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
      <select
        name="location"
        onChange={handleFilterChange}
        value={filters.location}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="">All Locations</option>
        {locations.map((c) => (
          <option key={c} value={c} className="capitalize">
            {c}
          </option>
        ))}
      </select>
    </div>
    <div className="relative">
      <FiGlobe className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
      <select
        name="language"
        onChange={handleFilterChange}
        value={filters.language}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="">All Languages</option>
        {languages.map((l) => (
          <option key={l} value={l} className="capitalize">
            {l}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// --- Main Page Component ---
const FindInfluencerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    niche: "",
    location: "",
    language: "",
  });
  const [influencers, setInfluencers] = useState([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch influencers from API
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/influencers");
        if (!response.ok) throw new Error("Failed to fetch influencers");
        const data = await response.json();
        setInfluencers(data.influencers);
        setFilteredInfluencers(data.influencers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    const results = influencers.filter((influencer) => {
      return (
        influencer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filters.niche === "" || influencer.niches.includes(filters.niche)) &&
        (filters.location === "" ||
          influencer.location?.city === filters.location) &&
        (filters.language === "" ||
          influencer.languages?.some((lang) => lang.name === filters.language))
      );
    });
    setFilteredInfluencers(results);
  }, [filters, searchTerm, influencers]);

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Unique values for filter dropdowns
  const normalize = (str) => str?.toLowerCase().trim();

  const uniqueNiches = [
    ...new Set(
      influencers
        .flatMap((i) => i.niches || [])
        .map(normalize)
        .filter(Boolean)
    ),
  ];

  const uniqueLocations = [
    ...new Set(
      influencers.map((i) => normalize(i.location?.city)).filter(Boolean)
    ),
  ];

  const uniqueLanguages = [
    ...new Set(
      influencers
        .flatMap((i) => (i.languages || []).map((l) => normalize(l.name)))
        .filter(Boolean)
    ),
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-10 py-10 bg-slate-800/20 rounded-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Discover <span className="text-indigo-400">Top Influencers</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Find the perfect match for your campaign from our curated list of
            creators.
          </p>
        </section>

        <div className="mb-8">
          {/* Main container for the search and filter controls */}
          {/* On mobile (default): flex-col to stack items */}
          {/* On desktop (md and up): flex-row to create a single line, with items centered vertically */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input - flex-grow allows it to take up available space */}
            <div className="relative flex-grow">
              <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search influencers by name..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Desktop Filter Controls */}
            {/* 'hidden md:flex' ensures this block only appears on medium screens and up, as a flex container */}
            <div className="hidden md:flex items-center gap-4">
              <FilterControls
                filters={filters}
                handleFilterChange={handleFilterChange}
                niches={uniqueNiches}
                locations={uniqueLocations}
                languages={uniqueLanguages}
              />
            </div>

            {/* Mobile Filter Toggle Button */}
            {/* 'md:hidden' ensures this button only appears on small screens */}
            <button
              className="md:hidden flex items-center justify-center gap-2 w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FiFilter /> {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Conditionally Rendered Mobile Filters */}
          {/* This container remains separate and only appears on mobile when toggled */}
          {showMobileFilters && (
            <div className="md:hidden mt-4 bg-slate-800/50 p-4 rounded-lg">
              <FilterControls
                filters={filters}
                handleFilterChange={handleFilterChange}
                niches={uniqueNiches}
                locations={uniqueLocations}
                languages={uniqueLanguages}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Results ({filteredInfluencers.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <InfluencerCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <InfluencerCard key={influencer._id} influencer={influencer} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-800/50 rounded-lg">
            <h3 className="text-2xl font-semibold text-slate-300">
              No Influencers Found
            </h3>
            <p className="text-slate-500 mt-2">
              Try adjusting your search or filters to find the perfect match.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindInfluencerPage;
