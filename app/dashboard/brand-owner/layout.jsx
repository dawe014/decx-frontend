"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiBriefcase,
  FiDollarSign,
  FiSettings,
  FiMessageSquare,
  FiLogOut,
  FiX,
  FiUser,
  FiMenu,
  FiBell,
  FiMail,
} from "react-icons/fi";
import NewJobPage from "./components/NewJobPage";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

// --- SKELETON COMPONENT ---
function BrandDashboardSkeleton() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-64 bg-slate-800 border-r border-slate-700 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex flex-col">
          <Link href="/dashboard/brand-owner" className="flex items-start">
            <Image
              src="/logo-removebg.png"
              alt="Logo"
              width={500}
              height={500}
              className="w-24 h-12"
            />
          </Link>
          <p className="text-xs text-slate-400">Brand Dashboard</p>
        </div>

        {/* User Profile Skeleton */}
        <div className="p-4 border-b border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <nav className="flex-1 p-4 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <div className="w-6 h-6 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/5 bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </nav>

        {/* Footer Skeleton */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 p-3">
            <div className="w-6 h-6 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-1/3 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar Skeleton */}
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="h-10 w-10 bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-28 bg-indigo-900/50 rounded-lg animate-pulse"></div>
        </header>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            <div className="h-8 w-1/3 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse"></div>
            <div className="mt-8 h-64 w-full bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function BrandDashboardLayout({ children }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState();
  const [showJobModal, setShowJobModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef(null);

  // Use the custom hook for notifications
  const { notifications, unreadMessageCount, markAllAsRead } =
    useRealtimeNotifications();
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Set the active tab based on the current URL
    if (pathname.includes("campaigns")) {
      setActiveTab("jobs");
    } else if (pathname.includes("messages")) {
      setActiveTab("messages");
    } else if (pathname.includes("billing")) {
      setActiveTab("billing");
    } else if (pathname.includes("settings")) {
      setActiveTab("settings");
    } else if (pathname.includes("profile")) {
      setActiveTab("profile");
    }
  }, [pathname]);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setBrand(data);
        } else {
          console.error("Failed to fetch brand data");
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  if (loading) {
    return <BrandDashboardSkeleton />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out
        ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex flex-col">
          <Link href="/" className="flex items-start">
            <Image
              src="/logo-removebg.png"
              alt="Logo"
              width={500}
              height={500}
              className="w-24 h-12"
            />
          </Link>
          <p className="text-xs text-slate-400">Brand Dashboard</p>
        </div>

        {/* User Profile */}
        <Link href={`/dashboard/brand-owner`}>
          <div className="p-4 border-b border-slate-700 flex items-center space-x-3">
            <div className="w-10 h-10 relative rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium">
              <Image
                src={brand?.profilePictureUrl || "/default-profile.png"}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-medium text-white">{brand?.companyName}</p>
              <p className="text-xs text-slate-400 capitalize">
                {brand?.planName}
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            {
              name: "My Campaigns",
              icon: FiBriefcase,
              route: "campaigns",
              id: "jobs",
            },
            {
              name: "Messages",
              icon: FiMessageSquare,
              route: "messages",
              id: "messages",
            },
            {
              name: "Billing",
              icon: FiDollarSign,
              route: "billing",
              id: "billing",
            },
            {
              name: "Settings",
              icon: FiSettings,
              route: "settings",
              id: "settings",
            },
            {
              name: "Profile",
              icon: FiUser,
              route: "profile",
              id: "profile",
            },
          ].map(({ name, icon: Icon, route, id, badge }) => (
            <Link href={`/dashboard/brand-owner/${route}`} key={id}>
              <button
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                  activeTab === id
                    ? "bg-indigo-900/30 text-indigo-400"
                    : "hover:bg-slate-700/50"
                }`}
              >
                <Icon className="flex-shrink-0" />
                <span>{name}</span>
                {id === "messages" && unreadMessageCount > 0 && (
                  <span className="ml-auto bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessageCount}
                  </span>
                )}
              </button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 ">
          <button
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <FiLogOut className="flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <FiMenu size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen((o) => !o)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
              >
                <FiBell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -right-28  md:right-0  mt-2 w-60 max-w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-30"
                  >
                    <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                      <h4 className="font-semibold text-white">
                        Notifications
                      </h4>
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-indigo-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <Link
                            key={notif._id}
                            href={`${notif.href}` || "#"}
                            onClick={() => setNotificationOpen(false)}
                            className="block p-3 border-b border-slate-700/50 hover:bg-slate-700"
                          >
                            <p className="text-sm text-white whitespace-pre-wrap">
                              {notif.message}
                            </p>
                            {notif.timestamp && (
                              <p className="text-xs text-slate-400 mt-1">
                                {notif?.createdAt || notif?.timestamp
                                  ? formatDistanceToNow(
                                      new Date(
                                        notif.createdAt || notif.timestamp
                                      ),
                                      {
                                        addSuffix: true,
                                      }
                                    )
                                  : "Unknown time"}
                              </p>
                            )}
                          </Link>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-400">
                          No new notifications.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/dashboard/brand-owner/messages"
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
            >
              <FiMail size={20} />
              {unreadMessageCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadMessageCount}
                </span>
              )}
            </Link>
            <div className="w-px h-6 bg-slate-700 hidden sm:block"></div>
            <button
              onClick={() => setShowJobModal(true)}
              className="ml-2 sm:ml-0 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiPlus size={18} />
              <span className="inline">New Job</span>{" "}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
          {children}
        </main>
      </div>

      {/* Job Post Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="py-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-full p-2"
                >
                  <FiX size={24} />
                </button>
              </div>
              <NewJobPage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
