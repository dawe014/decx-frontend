"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiArrowRight,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";
import { format } from "date-fns";

// --- Skeleton Components for Loading State ---
const ArticleSkeleton = ({ isFeatured = false }) => (
  <div
    className={`bg-slate-800/50 rounded-xl overflow-hidden animate-pulse ${
      isFeatured ? "md:col-span-2" : ""
    }`}
  >
    <div className={`bg-slate-700 ${isFeatured ? "h-80" : "h-48"}`}></div>
    <div className="p-6">
      <div className="h-4 w-1/4 bg-slate-700 rounded-md mb-3"></div>
      <div className="h-6 w-3/4 bg-slate-700 rounded-md mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-slate-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-slate-700 rounded-md"></div>
      </div>
      <div className="h-5 w-1/3 bg-slate-700 rounded-md"></div>
    </div>
  </div>
);

// --- UI Sub-Components ---
const ArticleCard = ({ article, isFeatured = false }) => (
  <Link
    href={`/e-magazine/${article._id}`}
    className={`group relative block bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-300 ${
      isFeatured ? "md:col-span-2" : ""
    }`}
  >
    <div
      className={`relative w-full overflow-hidden ${
        isFeatured ? "h-80" : "h-48"
      }`}
    >
      {article.featuredImage && (
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
        <span className="font-semibold text-indigo-400 uppercase">
          {article.category || "Insight"}
        </span>
        <span>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
      </div>
      <h3
        className={`font-bold text-white mb-2 ${
          isFeatured ? "text-2xl" : "text-lg"
        }`}
      >
        {article.title}
      </h3>
      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
        {article.excerpt || article.subtitle}
      </p>
      <div className="flex justify-between items-center text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <FiClock size={14} /> {article.readTime}
        </span>
        <div className="flex items-center text-indigo-400 font-semibold group-hover:gap-2 transition-all">
          Read More{" "}
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  </Link>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-slate-700 text-slate-300 disabled:opacity-50 hover:bg-indigo-600 hover:text-white transition"
      >
        <FiChevronLeft />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            currentPage === page
              ? "bg-indigo-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-indigo-600/50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-slate-700 text-slate-300 disabled:opacity-50 hover:bg-indigo-600 hover:text-white transition"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

// --- Main Page Component ---
export default function MagazinePage() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch articles on page or search change
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
      });
      try {
        const res = await fetch(`/api/magazine?${params}`);
        const data = await res.json();
        setArticles(data.articles || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    const debounceFetch = setTimeout(fetchArticles, 300); // Debounce search
    return () => clearTimeout(debounceFetch);
  }, [currentPage, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const featuredArticle = !loading && articles.length > 0 ? articles[0] : null;
  const regularArticles =
    !loading && articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 py-10 bg-slate-800/20 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse,white,transparent_70%)] opacity-20"></div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 relative">
            The <span className="text-indigo-400">DECx</span> E-Magazine
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto relative">
            Discover the latest articles, insights, and stories from the world
            of digital marketing.
          </p>
        </header>

        <form
          onSubmit={handleSearchSubmit}
          className="max-w-xl mx-auto mb-12 relative"
        >
          <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <>
              <ArticleSkeleton isFeatured={true} />
              <ArticleSkeleton />
              <ArticleSkeleton />
            </>
          ) : articles.length === 0 ? (
            <div className="md:col-span-2 text-center py-16 bg-slate-800/50 rounded-lg">
              <h3 className="text-2xl font-semibold text-slate-300">
                No Articles Found
              </h3>
              <p className="text-slate-500 mt-2">
                Try adjusting your search query.
              </p>
            </div>
          ) : (
            <>
              {featuredArticle && (
                <ArticleCard article={featuredArticle} isFeatured={true} />
              )}
              {regularArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
