"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiUser,
  FiGlobe,
  FiMapPin,
  FiPhone,
  FiDollarSign,
  FiAward,
  FiTrendingUp,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiLinkedin,
  FiFacebook,
  FiExternalLink,
  FiMessageSquare,
  FiUsers,
  FiEdit,
  FiRotateCw,
  FiX,
  FiAlertTriangle,
  FiCheck,
  FiSave,
} from "react-icons/fi";
import { toast } from "sonner";

const SkeletonCard = ({ children, hasHeader = true }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl">
    {hasHeader && (
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-700 rounded-md"></div>
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
      </div>
    )}
    <div className="p-4 md:p-6">{children}</div>
  </div>
);

function UserProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button Skeleton */}
        <div className="h-6 w-40 bg-slate-700 rounded-md"></div>

        {/* Profile Header Skeleton */}
        <header className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-slate-700 flex-shrink-0"></div>
          <div className="flex-1 w-full space-y-3">
            <div className="h-8 bg-slate-700 rounded w-3/4 mx-auto md:mx-0"></div>
            <div className="h-5 bg-slate-700 rounded w-1/2 mx-auto md:mx-0"></div>
            <div className="flex justify-center md:justify-start gap-3 pt-2">
              <div className="h-10 w-32 bg-slate-700 rounded-lg"></div>
              <div className="h-10 w-32 bg-slate-700 rounded-lg"></div>
              <div className="h-10 w-32 bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        </header>

        {/* Main Content Grid Skeleton */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <SkeletonCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700"></div>
                <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700"></div>
                <div className="h-32 bg-slate-800/50 rounded-lg border border-slate-700"></div>
              </div>
            </SkeletonCard>
            <SkeletonCard>
              <div className="space-y-4">
                <div className="h-5 w-1/4 bg-slate-700 rounded"></div>
                <div className="h-5 w-3/4 bg-slate-700 rounded"></div>
                <div className="h-5 w-2/3 bg-slate-700 rounded"></div>
              </div>
            </SkeletonCard>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-8">
            <SkeletonCard>
              <div className="space-y-4">
                <div className="h-5 w-full bg-slate-700 rounded"></div>
                <div className="h-5 w-full bg-slate-700 rounded"></div>
                <div className="h-5 w-2/3 bg-slate-700 rounded"></div>
              </div>
            </SkeletonCard>
            <SkeletonCard>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
                <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
                <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
              </div>
            </SkeletonCard>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Helper Functions & Sub-components ---

const getPlatformIcon = (platform) => {
  const props = { className: "text-slate-400", size: 20 };
  switch (platform?.toLowerCase()) {
    case "instagram":
      return <FiInstagram {...props} />;
    case "youtube":
      return <FiYoutube {...props} />;
    case "twitter":
      return <FiTwitter {...props} />;
    case "linkedin":
      return <FiLinkedin {...props} />;
    case "facebook":
      return <FiFacebook {...props} />;
    case "tiktok":
      return <FiMessageSquare {...props} />; // Placeholder for TikTok
    default:
      return <FiGlobe {...props} />;
  }
};

const getUserStatusBadge = (status) => {
  const colors = {
    active: "bg-green-900/50 text-green-400 border-green-500/30",
    pending: "bg-yellow-900/50 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-900/50 text-red-400 border-red-500/30",
    rejected: "bg-gray-900/50 text-gray-400 border-gray-500/30",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full capitalize border ${
        colors[status] || "bg-slate-700"
      }`}
    >
      {status}
    </span>
  );
};

const getUserTypeBadge = (type) => {
  const colors = {
    influencer: "bg-purple-900/50 text-purple-400 border-purple-500/30",
    brand: "bg-blue-900/50 text-blue-400 border-blue-500/30",
    agency: "bg-green-900/50 text-green-400 border-green-500/30",
    admin: "bg-yellow-900/50 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full capitalize border ${
        colors[type] || "bg-slate-700"
      }`}
    >
      {type}
    </span>
  );
};

const StatCard = ({ icon, label, value, className = "" }) => (
  <div
    className={`bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 ${className}`}
  >
    <div className="bg-slate-700 p-3 rounded-md text-indigo-400">{icon}</div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  </div>
);

const DetailItem = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="text-slate-500 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <div className="text-white font-medium">{children}</div>
    </div>
  </div>
);

const Card = ({ title, children, icon }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl">
    <div className="p-4 border-b border-slate-700 flex items-center gap-3">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="p-4 md:p-6 space-y-4">{children}</div>
  </div>
);

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  isSaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
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
                <p className="text-sm text-slate-400">{children}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-3">
          <button
            type="button"
            disabled={isSaving}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 sm:w-auto sm:text-sm disabled:opacity-50"
            onClick={onConfirm}
          >
            {isSaving ? <FiRotateCw className="animate-spin mr-2" /> : null}
            {isSaving ? "Confirming..." : confirmText}
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
// --- Main Page Component ---

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          throw new Error(data.message || "Could not retrieve user data.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // --- NEW HANDLER FUNCTIONS ---

  const handleStartChat = async () => {
    if (!user) return;
    setIsCreatingThread(true);
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds: [user._id],
          title: `Chat with Admin`,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to start conversation.");

      toast.success("Conversation started!");
      router.push(`/dashboard/admin/messages/?threadId=${data._id}`);
    } catch (err) {
      console.error("Error creating chat thread:", err);
      toast.error(`Error starting chat: ${err.message}`);
      setIsCreatingThread(false);
    }
    // No finally block for setIsCreatingThread, as we navigate away on success
  };

  const handleUpdateStatus = async () => {
    if (!user || !newStatus || newStatus === user.status) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/users/${user._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setUser((prevUser) => ({ ...prevUser, status: newStatus }));
      setShowConfirmationModal(false);
      setIsEditingStatus(false);
      toast.success("User status updated successfully!");
    } catch (err) {
      toast.error(`Error updating status: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const openStatusEditor = () => {
    setNewStatus(user.status);
    setIsEditingStatus(true);
  };

  const cancelStatusEditor = () => {
    setIsEditingStatus(false);
    setNewStatus("");
  };

  // --- Loading and Error States ---
  if (loading) {
    return <UserProfilePageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400">
        <FiXCircle size={40} className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        User not found.
      </div>
    );
  }

  const profile = user.profile || {};
  const userName = profile.fullName || profile.companyName || "Admin User";
  const profilePhoto = profile.profilePhoto || profile.logo;
  // --- Render Profile ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/dashboard/admin/users" // Adjust this to your user list page
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft /> Back to All Users
          </Link>
        </div>

        {/* Profile Header */}
        <header className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32 rounded-full bg-slate-700 flex-shrink-0">
            {profilePhoto ? (
              <Image
                src={profilePhoto}
                alt={userName}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{userName}</h1>
              {/* Button to open the full profile edit modal */}
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-4 mb-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                {getUserTypeBadge(user.role)}
                {getUserStatusBadge(user.status)}
                {user.role === "influencer" && profile.isFeatured && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">
                    Featured Influencer
                  </span>
                )}
              </div>
              <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                <FiMail size={14} /> {user.email}
              </p>
            </div>

            {/* --- NEW STATUS UPDATE UI & ACTION BUTTONS --- */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center gap-3">
              {!isEditingStatus ? (
                <button
                  onClick={openStatusEditor}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  <FiEdit size={16} /> Update Status
                </button>
              ) : (
                <div className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-slate-800 border border-slate-600 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="rejected">Rejected</option>
                    {user.role === "influencer" && (
                      <option value="isFeatured">Feature</option>
                    )}
                  </select>
                  <button
                    onClick={() => setShowConfirmationModal(true)}
                    disabled={newStatus === user.status || isSaving}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:bg-indigo-900/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button
                    onClick={cancelStatusEditor}
                    className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}

              {/* CHAT BUTTON (unchanged) */}
              <button
                onClick={handleStartChat}
                disabled={isCreatingThread}
                className={`flex items-center justify-center px-4 py-2 border border-slate-600 rounded-lg transition-colors text-sm ${
                  isCreatingThread
                    ? "bg-blue-600/40 text-slate-300 cursor-wait"
                    : "hover:border-blue-400 text-slate-300 hover:text-white bg-blue-600/20 hover:bg-blue-600/40"
                }`}
              >
                {isCreatingThread ? (
                  <>
                    <FiRotateCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Starting...
                  </>
                ) : (
                  <>
                    <FiMessageSquare className="mr-2" />
                    Chat with User
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Details) */}
          <div className="lg:col-span-2 space-y-8">
            {user.role === "influencer" && (
              <>
                <Card title="Social Media Presence" icon={<FiTrendingUp />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.socialMedia?.map((social, index) => (
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className="bg-slate-800/50 p-4 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700"
                      >
                        <div className="flex justify-between items-center mb-2">
                          {getPlatformIcon(social.platform)}
                          <p className="text-xs text-indigo-400 flex items-center gap-1">
                            View <FiExternalLink size={12} />
                          </p>
                        </div>
                        <p className="text-white font-semibold">
                          {social.handle || social.platform}
                        </p>
                        <p className="text-2xl font-bold text-green-400">
                          {(social.followers || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">Followers</p>
                      </a>
                    ))}
                  </div>
                </Card>
                <Card title="Rates & Services" icon={<FiDollarSign />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-300">
                        Offered Services
                      </h4>
                      {profile.services?.length > 0 ? (
                        profile.services.map((service, i) => (
                          <div key={i} className="text-white font-medium">
                            {service.name} - ${service.fee.toLocaleString()}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400">No services listed.</p>
                      )}
                    </div>
                  </div>
                </Card>
              </>
            )}

            {user.role === "brand" && (
              <>
                <Card title="Company Details" icon={<FiBriefcase />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem icon={<FiAward size={14} />} label="Industry">
                      {profile.industry || "N/A"}
                    </DetailItem>
                    <DetailItem
                      icon={<FiUsers size={14} />}
                      label="Company Size"
                    >
                      {profile.companySize || "N/A"}
                    </DetailItem>
                    <DetailItem icon={<FiGlobe size={14} />} label="Website">
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        {profile.website || "N/A"}
                      </a>
                    </DetailItem>
                    <DetailItem
                      icon={<FiUser size={14} />}
                      label="Contact Person"
                    >
                      {profile.contactPerson?.name || "N/A"} (
                      {profile.contactPerson?.phone || "N/A"})
                    </DetailItem>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-xs text-slate-400 mb-1">Description</h4>
                    <p className="text-slate-300">
                      {profile.description || "No description provided."}
                    </p>
                  </div>
                </Card>
                <Card title="Subscription Plan" icon={<FiTrendingUp />}>
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300 capitalize">
                      Plan: {profile.subscription?.planId?.name || "N/A"}
                    </h4>
                    <DetailItem
                      icon={<FiCalendar size={14} />}
                      label="Subscription Status"
                    >
                      {profile.subscription?.status || "N/A"}
                    </DetailItem>
                    <DetailItem
                      icon={<FiCalendar size={14} />}
                      label="Subscription Expires"
                    >
                      {profile.subscription?.expiresAt
                        ? new Date(
                            profile.subscription.expiresAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </DetailItem>
                  </div>
                </Card>
              </>
            )}

            {user.role === "admin" && (
              <Card title="Admin Information" icon={<FiUser />}>
                <p>
                  This is an administrator account with full system privileges.
                </p>
              </Card>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8 ">
            <Card title="Overview" icon={<FiUser />}>
              <div className="space-y-4">
                <DetailItem icon={<FiCalendar size={14} />} label="Joined Date">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </DetailItem>
                <DetailItem
                  icon={<FiCheckCircle size={14} />}
                  label="Email Verified"
                >
                  <span
                    className={
                      user.isVerified ? "text-green-400" : "text-red-400"
                    }
                  >
                    {user.isVerified ? "Yes" : "No"}
                  </span>
                </DetailItem>
                {user.role === "influencer" && (
                  <>
                    <DetailItem icon={<FiMapPin size={14} />} label="Location">
                      {profile.location?.city || "N/A"},{" "}
                      {profile.location?.country || "N/A"}
                    </DetailItem>
                    <DetailItem icon={<FiPhone size={14} />} label="Phone">
                      {profile.phone || "N/A"}
                    </DetailItem>
                  </>
                )}
                <DetailItem icon={<FiMessageSquare size={14} />} label="Bio">
                  <p className="text-slate-300 text-sm italic ">
                    {profile.bio || "No bio provided."}
                  </p>
                </DetailItem>
              </div>
            </Card>

            {user.role === "influencer" && profile.niches?.length > 0 && (
              <Card title="Niches" icon={<FiAward />}>
                <div className="flex flex-wrap gap-2">
                  {profile.niches.map((niche) => (
                    <span
                      key={niche}
                      className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleUpdateStatus}
          title="Update User Status"
          isSaving={isSaving}
        >
          Are you sure you want to change this user's status from{" "}
          <strong className="font-bold text-slate-300">{user.status}</strong> to{" "}
          <strong className="font-bold text-slate-300">
            {newStatus === "isFeatured"
              ? "Active Featured Influencer"
              : newStatus}
          </strong>
          ? This action may affect their access and permissions.
        </ConfirmationModal>
      </div>
    </div>
  );
}
