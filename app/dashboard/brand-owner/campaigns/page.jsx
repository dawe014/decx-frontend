"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSearch,
  FiTrash2,
  FiEye,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiBriefcase,
  FiPlus,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import NewJobPage from "../../brand-owner/components/NewJobPage";

// --- RESPONSIVE SKELETON LOADER (No changes needed) ---
const JobsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Filters Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex space-x-2">
        <div className="h-8 w-16 bg-slate-700 rounded-lg"></div>
        <div className="h-8 w-20 bg-slate-700 rounded-lg"></div>
        <div className="h-8 w-20 bg-slate-700 rounded-lg"></div>
      </div>
      <div className="h-10 w-full md:w-64 bg-slate-800 border border-slate-700 rounded-lg"></div>
    </div>
    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800 p-4 rounded-lg h-24 border border-slate-700"></div>
      <div className="bg-slate-800 p-4 rounded-lg h-24 border border-slate-700"></div>
      <div className="bg-slate-800 p-4 rounded-lg h-24 border border-slate-700"></div>
    </div>
    {/* Mobile Card Skeleton */}
    <div className="space-y-4 md:hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-slate-700 rounded"></div>
              <div className="h-4 w-32 bg-slate-700 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
          </div>
          <div className="h-10 bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
    {/* Desktop Table Skeleton */}
    <div className="hidden md:block bg-slate-800 rounded-lg border border-slate-700">
      <div className="h-12 bg-slate-700/50"></div>
      <div className="p-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-700/50 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-4">
              <div className="pt-1">
                <FiAlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">
                  Delete Campaign
                </h3>
                <p className="text-slate-400 mt-1">
                  Are you sure you want to permanently delete the "{jobTitle}"
                  campaign? This action cannot be undone.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobsComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/campaigns/brand");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data.campaigns);
      } catch (err) {
        setError(err.message);
        toast.error("Could not load your campaigns.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteClick = (id, title) => {
    setDeleteModal({
      isOpen: true,
      jobId: id,
      jobTitle: title,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      jobId: null,
      jobTitle: "",
    });
  };

  const performDelete = async () => {
    const { jobId } = deleteModal;
    const originalJobs = [...jobs];

    // Optimistically update UI
    setJobs((currentJobs) => currentJobs.filter((job) => job._id !== jobId));
    closeDeleteModal();
    toast.loading("Deleting campaign...");

    try {
      const response = await fetch(`/api/campaigns/${jobId}`, {
        method: "DELETE",
      });
      toast.dismiss(); // Dismiss the loading toast

      if (!response.ok) {
        throw new Error("Failed to delete the campaign on the server.");
      }

      toast.success("Campaign deleted successfully");
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.dismiss(); // Dismiss the loading toast

      // Revert if API call fails
      setJobs(originalJobs);
      toast.error("Failed to delete campaign. Please try again.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      selectedStatus === "all" || job.status === selectedStatus;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.platforms.join(", ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const formatBudget = (budget) => `$${budget.min} - $${budget.max}`;

  const StatusBadge = ({ status }) => (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
        status === "active"
          ? "bg-green-900/50 text-green-400"
          : status === "draft"
          ? "bg-yellow-900/50 text-yellow-400"
          : "bg-slate-700 text-slate-400"
      }`}
    >
      {status}
    </span>
  );

  if (loading) return <JobsSkeleton />;

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>Error loading jobs: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={performDelete}
        jobTitle={deleteModal.jobTitle}
      />

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ADDED flex-wrap for better responsiveness on small screens */}
        <div className="flex space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStatus === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus("active")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStatus === "active"
                ? "bg-green-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedStatus("draft")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStatus === "draft"
                ? "bg-yellow-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setSelectedStatus("completed")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStatus === "completed"
                ? "bg-gray-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Completed
          </button>
        </div>
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            Total Campaigns
          </h3>
          <p className="text-2xl font-bold">{jobs.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            Active Campaigns
          </h3>
          <p className="text-2xl font-bold text-green-400">
            {jobs.filter((job) => job.status === "active").length}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 col-span-1 sm:col-span-2 md:col-span-1">
          <h3 className="text-sm font-medium text-slate-400 mb-1">
            Total Applications
          </h3>
          <p className="text-2xl font-bold">
            {jobs.reduce(
              (sum, job) => sum + (job.applications?.length || 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* --- RESPONSIVE CONTENT AREA --- */}
      {filteredJobs.length > 0 ? (
        <div>
          {/* Mobile Card View - Hidden on md and up */}
          <div className="space-y-4 md:hidden">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <p className="text-sm text-slate-400">
                      {job.platforms.join(", ")}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-1.5 text-indigo-400" />{" "}
                    {formatBudget(job.budget)}
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1.5 text-indigo-400" />{" "}
                    {formatDate(job.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-1.5 text-indigo-400" />{" "}
                    {job.applications?.length || 0} Applications
                  </div>
                </div>
                <div className="flex justify-end space-x-2 border-t border-slate-700 pt-3">
                  <Link
                    href={`/dashboard/brand-owner/campaigns/${job._id}`}
                    className="text-indigo-400 hover:text-indigo-300 p-2 rounded-md hover:bg-slate-700"
                  >
                    <FiEye />
                  </Link>
                  <Link
                    href={`/dashboard/brand-owner/campaigns/${job._id}/edit`}
                    className="text-blue-400 hover:text-blue-300 p-2 rounded-md hover:bg-slate-700"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(job._id, job.title)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-slate-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View - Hidden below md */}
          <div className="hidden md:block bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Job Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Applications
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">
                          {job.title}
                        </div>
                        <div className="text-sm text-slate-400">
                          {job.platforms.join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-slate-400">
                          <FiDollarSign className="mr-1.5 text-indigo-400" />{" "}
                          <span className="mr-4">
                            {formatBudget(job.budget)}
                          </span>
                          <FiClock className="mr-1.5 text-indigo-400" />{" "}
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-white">
                          <FiUsers className="mr-2 text-indigo-400" />
                          {job.applications?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1">
                          <Link
                            href={`/dashboard/brand-owner/campaigns/${job._id}`}
                            className="text-indigo-400 hover:text-indigo-300 p-2 rounded-md hover:bg-slate-700"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            href={`/dashboard/brand-owner/campaigns/${job._id}/edit`}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-md hover:bg-slate-700"
                          >
                            <FiEdit2 />
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteClick(job._id, job.title)
                            }
                            className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-slate-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Empty State for filtered results
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-lg font-medium text-slate-300 mb-1">
            No campaigns found
          </h3>
          <p className="text-slate-500">
            No campaigns matched your search term or filter.
          </p>
        </div>
      )}

      {/* Empty State (for when no jobs exist at all) */}
      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiBriefcase className="mx-auto h-24 w-24 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-1">
            No campaigns posted yet
          </h3>
          <p className="text-slate-500 mb-6">
            Get started by creating your first influencer campaign.
          </p>
          <button
            onClick={() => setShowJobModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="mr-2" /> Create New Campaign
          </button>
        </div>
      )}
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
};

export default JobsComponent;
