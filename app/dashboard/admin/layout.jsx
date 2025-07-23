"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiBriefcase,
  FiMessageSquare,
  FiHome,
  FiLogOut,
  FiSearch,
  FiBell,
  FiMail,
  FiPlus,
  FiX,
  FiMenu,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { MdArticle } from "react-icons/md";
import NewArticle from "./components/NewArticle";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { formatDistanceToNow } from "date-fns";

// --- Data for Navigation ---
const navItems = [
  { href: "/dashboard/admin", icon: FiHome, label: "Overview" },
  { href: "/dashboard/admin/users", icon: FiUsers, label: "User Management" },
  { href: "/dashboard/admin/campaigns", icon: FiBriefcase, label: "Campaigns" },
  {
    href: "/dashboard/admin/messages",
    icon: FiMessageSquare,
    label: "Messages",
  },
  { href: "/dashboard/admin/e-magazine", icon: MdArticle, label: "E-Magazine" },
  { href: "/dashboard/admin/settings", icon: FiSettings, label: "Settings" },
];

// --- Custom Hook for handling clicks outside an element ---
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// --- Reusable Components ---
function NavItem({ item, isCollapsed }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-slate-400 hover:bg-slate-700 hover:text-white"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: "auto", marginLeft: "0.75rem" }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
      {isCollapsed && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-slate-900 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
          {item.label}
        </span>
      )}
    </div>
  );
}

function Sidebar({ isCollapsed, setCollapsed, isMobile = false }) {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col h-full bg-slate-800 border-r border-slate-700 text-slate-100">
      <div
        className={`p-4 border-b border-slate-700 flex items-center h-[73px] ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-removebg.png"
            alt="Logo"
            width={100}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <div className="p-4 border-b border-slate-700">
        <div
          className={`flex items-center space-x-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium flex-shrink-0">
            <Image
              src={"/default-profile.png"}
              alt="Admin"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          )}
        </div>
      </div>
      <nav
        className={`flex-1 p-2 space-y-1 ${
          isCollapsed ? "" : "overflow-y-auto"
        }`}
      >
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <div className="p-2 border-t border-slate-700">
        <button
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-900/20"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <FiLogOut className="flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Log Out</span>}
        </button>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="w-full flex items-center p-3 my-1 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            {isCollapsed ? (
              <FiChevronsRight className="w-5 h-5 flex-shrink-0 mx-auto" />
            ) : (
              <>
                <FiChevronsLeft className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3">Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Header({
  onMenuClick,
  onSelectCreate,
  notifications,
  unreadMessageCount,
  onMarkAllAsRead,
}) {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  useClickOutside(notificationRef, () => setNotificationOpen(false));

  return (
    <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between flex-shrink-0 z-60">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-white"
        >
          <FiMenu size={24} />
        </button>
        <div className="relative hidden md:block">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
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
                className="absolute -right-32 md:right-0 mt-2 w-60 max-w-80 overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-30"
              >
                <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                  <h4 className="font-semibold text-white">Notifications</h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
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
                        <p className="text-xs text-slate-400 mt-1">
                          {notif?.createdAt || notif?.timestamp
                            ? formatDistanceToNow(
                                new Date(notif.createdAt || notif.timestamp),
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
        <Link
          href="/dashboard/admin/messages"
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
          onClick={onSelectCreate}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <FiPlus size={18} />
          <span>Create New</span>
        </button>
      </div>
    </header>
  );
}

function CreateModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Create New Article
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <NewArticle />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Main Layout Component ---
export default function AdminDashboardLayout({ children }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Use the custom hook to get real-time notification and message data
  const { notifications, unreadMessageCount, markAllAsRead } =
    useRealtimeNotifications();

  const handleSelectCreate = () => {
    setShowCreateModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <motion.div
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-shrink-0 flex-col h-full"
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </motion.div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-800 z-50 md:hidden"
            >
              <Sidebar
                isCollapsed={false}
                setCollapsed={() => {}}
                isMobile={true}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onSelectCreate={handleSelectCreate}
          notifications={notifications}
          unreadMessageCount={unreadMessageCount}
          onMarkAllAsRead={markAllAsRead}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {children}
        </main>
      </div>

      <CreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
