"use client";

import { FiArrowLeft, FiClock, FiBookmark, FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";

export default function ArticlePage({ params: paramsPromise }) {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = use(paramsPromise);
  const { id: slug } = params;

  const handleShare = async () => {
    // Make sure article data exists
    if (!article) return;

    const shareData = {
      title: article.title,
      text: `Check out this article: ${article.title}`,
      url: window.location.href, // Gets the current page URL
    };

    try {
      // Use the Web Share API if the browser supports it
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop browsers: copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // Provide simple feedback since no toast library is imported
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Could not copy link.");
    }
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/magazine/${slug}`, {
          next: { revalidate: 60 },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch article data");
        }
        const articleData = await response.json();
        setArticle(articleData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <article className="py-12 max-w-3xl mx-auto animate-pulse">
        <div className="h-6 w-32 bg-slate-700 rounded mb-4"></div>
        <div className="h-10 w-full bg-slate-700 rounded mb-6"></div>
        <div className="h-4 w-1/3 bg-slate-700 rounded mb-4"></div>
        <div className="h-80 w-full bg-slate-800 rounded-xl mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-slate-700 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
        </div>
      </article>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (!article) {
    return <div className="text-center">Article not found</div>;
  }

  return (
    <article className="py-12 max-w-3xl mx-auto">
      <Link
        href="/e-magazine"
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8"
      >
        <FiArrowLeft className="mr-2" /> Back to Magazine
      </Link>

      <header className="mb-10">
        <span className="inline-block px-3 py-1 bg-indigo-600 text-xs rounded-full mb-4">
          {article.categories}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
          {article.title}
        </h1>
        <div className="flex items-center text-sm text-slate-400">
          <span className="flex items-center">
            <FiClock className="mr-1" /> {article.readTime || "8"} min read
          </span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none mb-12">
        <img
          src={article.featuredImage}
          alt="Article cover"
          className="w-full rounded-xl mb-8"
        />

        {article.content && (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>

      <div className="border-t border-slate-700 pt-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={handleShare}
              className="text-slate-400 hover:text-indigo-400 flex items-center"
            >
              <FiShare2 className="mr-2" /> Share
            </button>
          </div>
          <Link
            href="/e-magazine"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Magazine
          </Link>
        </div>
      </div>
    </article>
  );
}
