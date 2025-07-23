"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiClock,
  FiArchive,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import Modal from "../../components/Modal";
import ArticleForm from "../../components/ArticleForm";
import { toast } from "sonner";
import Image from "next/image";

// --- Skeleton Component for Loading State ---
const MagazineDashboardSkeleton = () => {
  const SkeletonRow = () => (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center px-4 py-4 lg:px-6 border-t border-slate-700">
      {/* Mobile view placeholder */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-700 rounded-md shrink-0"></div>
          <div className="w-full">
            <div className="h-5 w-3/4 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 bg-slate-700 rounded-full"></div>
          <div className="h-8 w-20 bg-slate-700 rounded"></div>
        </div>
      </div>

      {/* Desktop view placeholder */}
      <div className="hidden lg:flex items-center col-span-2 gap-4">
        <div className="h-10 w-10 bg-slate-700 rounded-md shrink-0"></div>
        <div className="w-full">
          <div className="h-5 w-3/4 bg-slate-700 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="hidden lg:block h-5 w-24 bg-slate-700 rounded-full"></div>
      <div className="hidden lg:block h-4 w-16 bg-slate-700 rounded"></div>
      <div className="hidden lg:block h-4 w-12 bg-slate-700 rounded"></div>
      <div className="hidden lg:flex justify-end gap-2">
        <div className="h-6 w-6 bg-slate-700 rounded-md"></div>
        <div className="h-6 w-6 bg-slate-700 rounded-md"></div>
        <div className="h-6 w-6 bg-slate-700 rounded-md"></div>
      </div>
    </div>
  );

  return (
    <div className="animate-pulse">
      <div className="flex justify-end items-center mb-8">
        <div className="h-11 w-36 bg-slate-700 rounded-lg"></div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-11 flex-1 bg-slate-700 rounded-lg"></div>
          <div className="h-11 w-32 bg-slate-700 rounded-lg"></div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
        {/* Skeleton Header */}
        <div className="hidden lg:grid grid-cols-6 gap-4 items-center px-6 py-3">
          <div className="col-span-2 h-4 w-1/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-700 rounded"></div>
          <div className="flex justify-end">
            <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
          </div>
        </div>
        {/* Skeleton Rows */}
        <div>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <SkeletonRow key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
}) => {
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
                  Delete Article
                </h3>
                <p className="text-slate-400 mt-1">
                  Are you sure you want to permanently delete "{articleTitle}"?
                  This action cannot be undone.
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

// --- Main Dashboard Component ---
export default function MagazineDashboard() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    articleId: null,
    articleTitle: "",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Simulate longer load to see skeleton
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const res = await fetch("/api/magazine/admin");
        if (!res.ok) throw new Error("Failed to fetch articles");

        const data = await res.json();

        // Ensure we have an array and filter for unique articles
        const allArticles = Array.isArray(data.articles) ? data.articles : [];
        const uniqueArticles = allArticles.filter(
          (article, index, self) =>
            index === self.findIndex((a) => a._id === article._id)
        );

        setArticles(uniqueArticles);
        setFilteredArticles(uniqueArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let results = [...articles];

    if (searchTerm) {
      results = results.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((article) => article.status === statusFilter);
    }

    setFilteredArticles(results);
  }, [searchTerm, statusFilter, articles]);

  const handleDeleteClick = (id, title) => {
    setDeleteModal({
      isOpen: true,
      articleId: id,
      articleTitle: title || "Untitled Article",
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      articleId: null,
      articleTitle: "",
    });
  };

  const confirmDelete = async () => {
    const { articleId } = deleteModal;
    try {
      const res = await fetch(`/api/magazine/${articleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles(articles.filter((article) => article._id !== articleId));
        toast.success("Article deleted successfully");
      } else {
        throw new Error("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      closeDeleteModal();
    }
  };

  const openEditModal = (article) => {
    setCurrentArticle(article);
    setFormMode("edit");
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentArticle(null);
    setFormMode("create");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let res;
      let data;
      setIsSaving(true);
      if (formMode === "create") {
        // 1. Create the article
        res = await fetch("/api/magazine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        data = await res.json();

        // 2. Upload the image if exists
        if (res.ok && formData.featuredImageFile) {
          const imageData = new FormData();
          imageData.append("featuredImage", formData.featuredImageFile);

          const imageUploadRes = await fetch(
            `/api/magazine/${data.article._id}/upload`,
            {
              method: "PATCH",
              body: imageData,
            }
          );

          if (!imageUploadRes.ok) {
            console.error("Image upload failed.");
          }
        }
      } else {
        // 3. Edit existing article
        res = await fetch(`/api/magazine/${currentArticle._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        data = await res.json();

        if (res.ok && formData.featuredImageFile) {
          const imageData = new FormData();
          imageData.append("featuredImage", formData.featuredImageFile);

          const imageUploadRes = await fetch(
            `/api/magazine/${currentArticle._id}/upload`,
            {
              method: "PATCH",
              body: imageData,
            }
          );

          if (!imageUploadRes.ok) {
            console.error("Image upload failed.");
          }
        }
      }

      // 4. Handle UI update
      if (res.ok) {
        if (formMode === "create") {
          setArticles([data.article, ...articles]);
        } else {
          setArticles(
            articles.map((article) =>
              article._id === currentArticle._id ? data.article : article
            )
          );
        }
        setIsSaving(false);
        toast.success(
          formMode === "create"
            ? "Article created successfully!"
            : "Article updated successfully!"
        );

        setIsModalOpen(false);
      }
    } catch (error) {
      setIsSaving(false);
      toast.error(
        formMode === "create"
          ? "Failed to create article."
          : "Failed to update article."
      );
      console.error("Error saving article:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="bg-green-800/30 text-green-400 text-xs px-2.5 py-1 rounded-full inline-flex items-center font-medium">
            <FiCheckCircle className="mr-1.5" /> Published
          </span>
        );
      case "draft":
        return (
          <span className="bg-yellow-800/30 text-yellow-400 text-xs px-2.5 py-1 rounded-full inline-flex items-center font-medium">
            <FiClock className="mr-1.5" /> Draft
          </span>
        );
      case "archived":
        return (
          <span className="bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full inline-flex items-center font-medium">
            <FiArchive className="mr-1.5" /> Archived
          </span>
        );
      default:
        return (
          <span className="bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full inline-flex items-center font-medium">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen">
        <MagazineDashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        articleTitle={deleteModal.articleTitle}
      />

      <div className="flex justify-end items-center mb-8">
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center transition-all shadow-lg shadow-indigo-900/30"
        >
          <FiPlus className="mr-2" /> New Article
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-4 mb-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, subtitle, or content..."
              className="pl-10 pr-4 py-2.5 w-full border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full md:w-auto gap-2 px-4 py-2.5 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
            >
              <FiFilter /> Filters
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Articles List (Responsive) */}
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-6 gap-4 items-center px-6 py-4">
          <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Title
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Status
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Categories
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Published
          </div>
          <div className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Actions
          </div>
        </div>

        {/* Article Items */}
        <div className="divide-y divide-slate-700">
          {filteredArticles?.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article._id}
                className="grid grid-cols-1 lg:grid-cols-6 gap-y-3 lg:gap-4 items-center p-4 lg:p-6 hover:bg-slate-700/50 transition-colors"
              >
                {/* --- Main Info: Title, Subtitle, Image --- */}
                <div className="lg:col-span-2 flex items-center gap-4 min-w-0">
                  {article.featuredImage && (
                    <div className="flex-shrink-0 h-12 w-12 hidden sm:block">
                      <Image
                        src={article.featuredImage}
                        width={48} // 12 * 4 = 48px
                        height={48}
                        alt={article.title}
                        className="rounded-md object-cover border border-slate-600"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-semibold text-slate-100 truncate"
                      title={article.title || "Untitled Article"}
                    >
                      {article.title || "Untitled Article"}
                    </div>
                    <div
                      className="text-sm text-slate-400 truncate"
                      title={article.subtitle}
                    >
                      {article.subtitle}
                    </div>
                  </div>
                </div>

                {/* --- Status --- */}
                <div className="flex justify-between items-center lg:block">
                  <span className="lg:hidden text-xs font-medium text-slate-400">
                    Status
                  </span>
                  {getStatusBadge(article.status)}
                </div>

                {/* --- Categories --- */}
                <div className="flex justify-between items-center lg:block">
                  <span className="lg:hidden text-xs font-medium text-slate-400">
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {article.categories?.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                    {article.categories?.length > 2 && (
                      <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                        +{article.categories.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* --- Published Date --- */}
                <div className="flex justify-between items-center lg:block">
                  <span className="lg:hidden text-xs font-medium text-slate-400">
                    Published
                  </span>
                  <span className="text-sm text-slate-300">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                {/* --- Actions --- */}
                <div className="flex justify-end space-x-1 lg:col-start-6">
                  <Link
                    href={`/e-magazine/${article._id}`}
                    target="_blank"
                    className="text-slate-400 hover:text-indigo-400 p-2 rounded-md transition-colors"
                    title="View"
                  >
                    <FiEye size={18} />
                  </Link>
                  <button
                    onClick={() => openEditModal(article)}
                    className="text-slate-400 hover:text-yellow-400 p-2 rounded-md transition-colors"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(article._id, article.title)
                    }
                    className="text-slate-400 hover:text-red-400 p-2 rounded-md transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-6">
              <h3 className="text-lg font-semibold text-slate-300">
                No Articles Found
              </h3>
              <p className="text-slate-400 mt-2">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Article Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${formMode === "create" ? "Create New" : "Edit"} Article`}
      >
        <ArticleForm
          article={currentArticle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
          mode={formMode}
        />
      </Modal>
    </div>
  );
}
