"use client";
import Image from "next/image";
import Link from "next/link"; // Import the Link component
import { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiRotateCw,
  FiExternalLink,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast } from "sonner";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  isUpdating = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md shadow-xl transform transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
              <FiAlertTriangle
                className="h-6 w-6 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="mt-0 text-left">
              <h3
                className="text-lg leading-6 font-bold text-white"
                id="modal-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-400">{message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-3 rounded-b-xl">
          <button
            disabled={isUpdating}
            type="button"
            className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 sm:w-auto sm:text-sm ${confirmButtonClass}`}
            onClick={onConfirm}
          >
            {isUpdating ? (
              <span className="flex items-center">
                <FiRotateCw className="animate-spin mr-2" />
                Updating...
              </span>
            ) : (
              confirmText
            )}
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-slate-600 bg-transparent px-4 py-2 text-base font-medium text-slate-300 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
// This component represents a single row in the desktop table skeleton
const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        {/* Skeleton for avatar */}
        <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"></div>
        <div className="ml-3 space-y-2">
          {/* Skeleton for name */}
          <div className="h-4 bg-slate-700 rounded w-32"></div>
          {/* Skeleton for "View Profile" link */}
          <div className="h-3 bg-slate-700 rounded w-20"></div>
        </div>
      </div>
    </td>
    {/* Skeleton for email */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-slate-700 rounded w-48"></div>
    </td>
    {/* Skeleton for type badge */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-5 bg-slate-700 rounded-full w-20"></div>
    </td>
    {/* Skeleton for status badge */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-5 bg-slate-700 rounded-full w-20"></div>
    </td>
    {/* Skeleton for joined date */}
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-slate-700 rounded w-24"></div>
    </td>
    {/* Skeleton for actions */}
    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
      <div className="h-6 w-6 bg-slate-700 rounded inline-block"></div>
      <div className="h-6 w-6 bg-slate-700 rounded inline-block"></div>
    </td>
  </tr>
);
// This component represents a single card in the mobile view skeleton
const SkeletonMobileCard = () => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-4 animate-pulse">
    <div className="flex items-center gap-4">
      {/* Skeleton for avatar */}
      <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0"></div>
      <div className="flex-1 min-w-0 space-y-2">
        {/* Skeleton for name */}
        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
        {/* Skeleton for email */}
        <div className="h-4 bg-slate-700 rounded w-full"></div>
      </div>
    </div>
    {/* Skeleton for badges */}
    <div className="flex flex-wrap items-center gap-2">
      <div className="h-5 bg-slate-700 rounded-full w-24"></div>
      <div className="h-5 bg-slate-700 rounded-full w-20"></div>
    </div>
    <div className="flex items-center justify-between border-t border-slate-700 pt-3">
      {/* Skeleton for "View Profile" link */}
      <div className="h-4 bg-slate-700 rounded w-28"></div>
      {/* Skeleton for action icons */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 bg-slate-700 rounded"></div>
        <div className="h-6 w-6 bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
);

// The main skeleton component that assembles the pieces
function UserManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Section Skeleton */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Skeleton for search input */}
          <div className="h-10 bg-slate-700 rounded-lg w-full md:max-w-md"></div>
          {/* Skeleton for filter dropdown */}
          <div className="h-10 bg-slate-700 rounded-lg w-full md:w-40"></div>
        </div>
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {/* Render 5 skeleton rows to give a sense of content loading */}
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonTableRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="md:hidden space-y-4">
        {/* Render 3 skeleton cards for the mobile view */}
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonMobileCard key={index} />
        ))}
      </div>
    </div>
  );
}
// Main Component
export default function UserManagement() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Confirm",
    confirmButtonClass: "",
  });
  // API call to fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          console.error("API Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      user.profile?.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.profile?.companyName?.toLowerCase().includes(searchLower) ||
      user.profile?.agencyName?.toLowerCase().includes(searchLower);
    const matchesFilter = activeFilter === "all" || user.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Handler functions for user actions
  const handleUpdateUserStatus = async (userId, status) => {
    const originalUsers = [...users];
    setUsers(
      users.map((user) => (user._id === userId ? { ...user, status } : user))
    );

    try {
      setUpdateLoading(true);
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      setUpdateLoading(false);
      setModalState({
        isOpen: false,
      });
      toast.success(`User status updated to ${status}`);
    } catch (error) {
      setUpdateLoading(false);

      setModalState({
        isOpen: false,
      });
      toast.error(`Failed to update user status: ${error}`);
      console.error("Error updating user status:", error);
      setUsers(originalUsers);
      alert("Failed to update user status. Please try again.");
    }
  };
  const requestConfirmation = (user, newStatus, actionText, buttonClass) => {
    const userName = getUserName(user) || "this user";
    setModalState({
      isOpen: true,
      title: `${actionText} User`,
      message: `Are you sure you want to ${actionText.toLowerCase()} ${userName}? This action will change their status to "${newStatus}".`,
      onConfirm: () => handleUpdateUserStatus(user._id, newStatus),
      confirmText: actionText,
      confirmButtonClass: buttonClass,
    });
  };

  // Helper functions for UI
  const getUserName = (user) =>
    user.profile?.fullName ||
    user.profile?.companyName ||
    user.profile?.agencyName ||
    "Admin";
  const getUserTypeBadge = (type) => {
    const colors = {
      influencer: "bg-purple-900/30 text-purple-400",
      brand: "bg-blue-900/30 text-blue-400",
      agency: "bg-green-900/30 text-green-400",
      admin: "bg-yellow-900/30 text-yellow-400",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full capitalize ${
          colors[type] || "bg-slate-700"
        }`}
      >
        {type}
      </span>
    );
  };
  const getUserStatusBadge = (status) => {
    const colors = {
      active: "bg-green-900/30 text-green-400",
      pending: "bg-yellow-900/30 text-yellow-400",
      suspended: "bg-red-900/30 text-red-400",
      rejected: "bg-gray-900/30 text-gray-400",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full capitalize ${
          colors[status] || "bg-slate-700"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return <UserManagementSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        confirmButtonClass={modalState.confirmButtonClass}
        isUpdating={updateLoading}
      />
      {/* Filters Section */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FiFilter className="text-slate-400" />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
            >
              <option value="all">All Users</option>
              <option value="influencer">Influencers</option>
              <option value="brand">Brands</option>
              <option value="agency">Agencies</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Display: Table for Desktop */}
      <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden text-slate-300 font-medium mr-3 flex-shrink-0">
                        {user.profile?.profilePhoto || user.profile?.logo ? (
                          <Image
                            src={user.profile.profilePhoto || user.profile.logo}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span>{getUserName(user)?.charAt(0) || "A"}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {getUserName(user)}
                        </p>
                        {/* UPDATED: Changed button to Link for redirection */}
                        <Link
                          href={`/dashboard/admin/users/${user._id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center"
                        >
                          View Profile{" "}
                          <FiExternalLink className="ml-1" size={12} />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUserTypeBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUserStatusBadge(user.status)}
                    {user.role === "influencer" &&
                      user.status === "pending" && (
                        <div className="text-xs mt-1 text-slate-400">
                          {(user.profile?.followers || 0) >= 5000 ? (
                            <span className="text-green-400">Meets reqs</span>
                          ) : (
                            <span className="text-red-400">Under 5k</span>
                          )}
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {user.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            requestConfirmation(
                              user,
                              "active",
                              "Approve",
                              "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                            )
                          }
                          disabled={
                            user.role === "influencer" &&
                            (user.profile?.followers || 0) < 5000
                          }
                          className={`text-green-400 ${
                            user.role === "influencer" &&
                            (user.profile?.followers || 0) < 5000
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-green-300"
                          }`}
                          title="Approve User"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() =>
                            requestConfirmation(
                              user,
                              "rejected",
                              "Reject",
                              "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            )
                          }
                          className="text-red-400 hover:text-red-300"
                          title="Reject User"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    ) : user.status === "suspended" ? (
                      <button
                        onClick={() =>
                          requestConfirmation(
                            user,
                            "active",
                            "Activate",
                            "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                          )
                        }
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        Activate
                      </button>
                    ) : user.status === "active" ? (
                      <button
                        onClick={() =>
                          requestConfirmation(
                            user,
                            "suspended",
                            "Suspend",
                            "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          )
                        }
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Suspend
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Display: Cards for Mobile */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {user.profile?.profilePhoto || user.profile?.logo ? (
                  <Image
                    src={user.profile.profilePhoto || user.profile.logo}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="font-bold text-slate-300">
                    {getUserName(user)?.charAt(0) || "A"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">
                  {getUserName(user)}
                </p>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {getUserTypeBadge(user.role)}
              {getUserStatusBadge(user.status)}
            </div>
            {user.role === "influencer" && user.status === "pending" && (
              <div className="text-xs text-slate-400">
                {(user.profile?.followers || 0) >= 5000 ? (
                  <span className="text-green-400">Meets requirement</span>
                ) : (
                  <span className="text-red-400">Needs 5k+ followers</span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-700 pt-3">
              {/* UPDATED: Changed button to Link for redirection */}
              <Link
                href={`/dashboard/admin/users/${user._id}`}
                className="text-sm text-indigo-400 hover:underline flex items-center gap-1"
              >
                View Profile <FiExternalLink size={12} />
              </Link>
              <div className="flex items-center gap-3">
                {user.status === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        requestConfirmation(
                          user,
                          "active",
                          "Approve",
                          "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        )
                      }
                      disabled={
                        user.role === "influencer" &&
                        (user.profile?.followers || 0) < 5000
                      }
                      className={`text-green-400 ${
                        user.role === "influencer" &&
                        (user.profile?.followers || 0) < 5000
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-green-300"
                      }`}
                      title="Approve User"
                    >
                      <FiCheck size={18} />
                    </button>
                    <button
                      onClick={() =>
                        requestConfirmation(
                          user,
                          "rejected",
                          "Reject",
                          "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                      title="Reject User"
                    >
                      <FiX size={18} />
                    </button>
                  </>
                ) : user.status === "suspended" ? (
                  <button
                    onClick={() =>
                      requestConfirmation(
                        user,
                        "active",
                        "Activate",
                        "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      )
                    }
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    Activate
                  </button>
                ) : user.status === "active" ? (
                  <button
                    onClick={() =>
                      requestConfirmation(
                        user,
                        "suspended",
                        "Suspend",
                        "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      )
                    }
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Suspend
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
