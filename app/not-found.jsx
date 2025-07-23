import Link from "next/link";
import { FiHome, FiBriefcase, FiStar } from "react-icons/fi";
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-center p-6">
      <div className="relative">
        {/* Optional: A subtle background glow effect */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/10 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

        <div className="relative z-10">
          {/* Main 404 text with gradient */}
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
            404
          </h1>

          {/* Headline */}
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
            Page Not Found
          </h2>

          {/* Branded sub-message */}
          <p className="mt-4 max-w-md mx-auto text-lg text-slate-400">
            Looks like this content isn't part of the campaign. The link might
            be broken or the page may have been moved.
          </p>

          {/* Primary action button */}
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <FiHome />
              Return to Home
            </Link>
          </div>

          {/* Secondary navigation links */}
          <div className="mt-8 flex justify-center items-center gap-8 text-slate-300">
            <Link
              href="/for-brands"
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
            >
              <FiBriefcase />
              <span>For Brands</span>
            </Link>

            <div className="h-6 w-px bg-slate-700"></div>

            <Link
              href="/for-creators"
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
            >
              <FiStar />
              <span>For Creators</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
