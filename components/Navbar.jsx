"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { MdClose, MdMenu } from "react-icons/md";
import { useUser } from "@/context/UserContext";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { formatDistanceToNow } from "date-fns";
import {
  FiLogOut,
  FiGrid,
  FiUser,
  FiMessageSquare,
  FiFileText,
  FiSettings,
  FiBell,
  FiMail,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// --- Data & Configuration ---

// SWR Fetcher
export const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = { message: res.statusText };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// Main Navigation Links
const defaultLinks = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/find-influencer", name: "Find Influencer" },
  { href: "/jobs", name: "Find Jobs" },
  { href: "/pricing", name: "Pricing" },
  { href: "/services", name: "Services" },
  { href: "/e-magazine", name: "E-Magazine" },
  { href: "/contact-us", name: "Contact Us" },
];

const influencerLinks = [
  { href: "/find-influencer", name: "Find Influencer" },
  { href: "/jobs", name: "Jobs" },
  { href: "/services", name: "Services" },
  { href: "/e-magazine", name: "E-Magazine" },
  { href: "/contact-us", name: "Contact Us" },
];

const brandLinks = [
  { href: "/find-influencer", name: "Find Influencer" },
  { href: "/pricing", name: "Pricing" },
  { href: "/services", name: "Services" },
  { href: "/e-magazine", name: "E-Magazine" },
  { href: "/contact-us", name: "Contact Us" },
];

const adminLinks = defaultLinks;

// Shared function to get user-specific action links
const getProfileLinks = (role, logoutHandler) => {
  const baseLinks = [
    { name: "Logout", icon: FiLogOut, onClick: logoutHandler, isButton: true },
  ];
  switch (role) {
    case "influencer":
      return [
        { name: "Profile", href: "/profile", icon: FiUser },
        { name: "Messages", href: "/messages", icon: FiMessageSquare },
        { name: "My Proposals", href: "/my-proposals", icon: FiFileText },
        { name: "Settings", href: "/settings", icon: FiSettings },
        ...baseLinks,
      ];
    case "brand":
      return [
        { name: "Dashboard", href: "/dashboard/brand-owner", icon: FiGrid },
        ...baseLinks,
      ];
    case "admin":
      return [
        { name: "Dashboard", href: "/dashboard/admin", icon: FiGrid },
        ...baseLinks,
      ];
    default:
      return baseLinks;
  }
};

// --- Sub-Components ---

/**
 * Desktop Profile Dropdown Component
 */
function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const dropdownLinks = getProfileLinks(user.role, handleLogout);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center transition-transform duration-300 hover:scale-105 focus:outline-none"
      >
        <Image
          src={user.profilePictureUrl || "/default-profile.png"}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover ring-2 ring-offset-2 ring-offset-background ring-primary"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="p-2">
              {dropdownLinks.map((item) =>
                item.isButton ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile Slide-out Navigation Panel
 */
function MobileNav({ isOpen, closeMenu, navLinks, user, isLoading }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    closeMenu();
    await signOut({ callbackUrl: "/" });
  };

  const profileLinks = user ? getProfileLinks(user.role, handleLogout) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-background shadow-2xl z-50 lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <Link href="/" onClick={closeMenu}>
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={96}
                  height={48}
                  className="w-24 h-12"
                />
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 text-textPrimary hover:text-primary transition-colors"
                aria-label="Close menu"
              >
                <MdClose size={28} />
              </button>
            </div>

            <nav className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-textPrimary hover:bg-gray-500/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              {isLoading ? (
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.profilePictureUrl || "/default-profile.png"}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-textPrimary">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 -mx-6"></div>
                  {profileLinks.map((item) =>
                    item.isButton ? (
                      <button
                        key={item.name}
                        onClick={item.onClick}
                        className="flex items-center gap-3 text-red-500 font-medium p-3 -mx-3 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-textPrimary font-medium p-3 -mx-3 rounded-lg hover:bg-gray-500/10 transition-colors"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    router.push("/signup");
                    closeMenu();
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Join Us Now
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Main Navbar Component ---

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Use the custom hook for notifications
  const { notifications, unreadMessageCount, markAllAsRead } =
    useRealtimeNotifications();
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const notificationRef = useRef(null);

  const { user, loading: isLoading } = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavLinks = () => {
    if (!isLoggedIn) return defaultLinks;
    switch (user.role) {
      case "influencer":
        return influencerLinks;
      case "brand":
        return brandLinks;
      case "admin":
        return adminLinks;
      default:
        return defaultLinks;
    }
  };

  const navLinks = getNavLinks();

  if (pathname.startsWith("/dashboard")) return null;

  const NavLink = ({ href, name }) => (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
        pathname === href
          ? "text-primary"
          : "text-textPrimary hover:text-primary"
      }`}
    >
      {name}
      {pathname === href && (
        <motion.span
          layoutId="underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
    </Link>
  );

  return (
    <>
      <header className="w-full fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            {/* Left Side: Logo & Desktop Links */}
            <div className="flex items-center">
              <Link className="flex-shrink-0" href="/">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={96}
                  height={48}
                  className="w-24 h-12"
                />
              </Link>
              <div className="hidden lg:ml-8 lg:flex lg:space-x-2">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
              </div>
            </div>

            {/* Right Side: User Actions & Mobile Menu Button */}
            <div className="flex items-center">
              <div className="hidden lg:flex items-center gap-4 lg:ml-4">
                {isLoading ? (
                  <div className="w-28 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ) : isLoggedIn ? (
                  <>
                    {/* Notification Bell */}
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
                            className="absolute -right-28 md:right-0 mt-2 w-60 max-w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-30"
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
                                    href={notif.href || "#"}
                                    onClick={() => setNotificationOpen(false)}
                                    className="block p-3 border-b border-slate-700/50 hover:bg-slate-700"
                                  >
                                    <p className="text-sm text-white whitespace-pre-wrap">
                                      {notif.message}
                                    </p>
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

                    {/* Message Icon */}

                    <Link
                      href={
                        user.role === "influencer"
                          ? "/messages"
                          : user.role === "brand"
                          ? "/dashboard/brand-owner/messages"
                          : "/dashboard/admin/messages"
                      }
                      className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
                    >
                      <FiMail size={20} />
                      {unreadMessageCount > 0 && (
                        <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {unreadMessageCount}
                        </span>
                      )}
                    </Link>

                    {/* Profile Dropdown */}
                    <ProfileDropdown user={user} />
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/signup")}
                    className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Join
                  </button>
                )}
              </div>

              <div className="ml-4 flex items-center lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-textPrimary hover:text-primary hover:bg-gray-500/10 focus:outline-none"
                  aria-label="Open main menu"
                >
                  <MdMenu size={28} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <MobileNav
        isOpen={isMobileMenuOpen}
        closeMenu={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        user={user}
        isLoading={isLoading}
      />
    </>
  );
}
