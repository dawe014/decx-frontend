"use client";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiUpload,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import Image from "next/image";
import ConfirmationModal from "./ConfirmationModal";

/**
 * A comprehensive component for managing an influencer's portfolio.
 * It handles displaying, adding, uploading, and deleting portfolio items.
 * @param {Object[]} existingItems - An array of portfolio items from the database.
 * @param {function} onDataChange - A callback function to notify the parent component to re-fetch data.
 */
const PortfolioManager = ({ existingItems = [], onDataChange }) => {
  // State for new items being staged for upload
  const [newItems, setNewItems] = useState([]);

  // State for the main view, allowing for optimistic updates on delete
  const [displayedItems, setDisplayedItems] = useState(existingItems);

  // States for UI feedback (loading, errors)
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // States for the delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Effect to sync the local display state when the parent's data changes
  useEffect(() => {
    setDisplayedItems(existingItems);
  }, [existingItems]);

  // Adds a new, blank form for an item to the staging list
  const handleAddNewItem = () => {
    setNewItems([
      ...newItems,
      { id: Date.now(), file: null, title: "", description: "" },
    ]);
  };

  // Removes an item from the "new items" staging list
  const handleRemoveNewItem = (id) => {
    setNewItems(newItems.filter((item) => item.id !== id));
  };

  // Updates the state (file, title, or description) for a specific new item
  const handleNewItemChange = (id, field, value) => {
    setNewItems(
      newItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Handles the batch upload of all staged new items
  const handleUpload = async () => {
    setError("");
    const itemsToUpload = newItems.filter(
      (item) => item.file && item.title && item.description
    );
    if (itemsToUpload.length === 0) {
      setError(
        "Please add a file, title, and description for at least one item before uploading."
      );
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    itemsToUpload.forEach((item, index) => {
      formData.append(`portfolioItem-${index}-file`, item.file);
      formData.append(`portfolioItem-${index}-title`, item.title);
      formData.append(`portfolioItem-${index}-description`, item.description);
    });

    try {
      const response = await fetch("/api/portfolio/upload", {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Upload failed. Please try again.");
      }
      setNewItems([]); // Clear the form on success
      onDataChange(); // Notify parent to re-fetch all data
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Opens the delete confirmation modal and sets which item to delete
  const openDeleteConfirmation = (itemId) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  // Called when the user confirms the deletion in the modal
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/portfolio/${itemToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete.");
      }
      setIsModalOpen(false);
      setItemToDelete(null);
      onDataChange(); // Notify parent to re-fetch data to reflect the deletion
    } catch (err) {
      console.error(err);
      setError(`Deletion failed: ${err.message}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* --- Section to Display Existing Items --- */}
      <h3 className="text-xl font-bold mb-4 text-slate-200">
        Your Current Portfolio
      </h3>
      {displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {displayedItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-800 rounded-lg overflow-hidden flex flex-col group relative"
            >
              <button
                type="button"
                onClick={() => openDeleteConfirmation(item._id)}
                className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Delete item"
              >
                <FiTrash2 size={16} />
              </button>

              <div className="relative h-40 w-full">
                {item.mediaType === "image" ? (
                  <Image
                    src={item.mediaUrl}
                    alt={item.description}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                    muted
                  />
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h4 className="font-semibold text-white mb-1">
                  {item.title || "Untitled Project"}
                </h4>
                <p className="text-sm text-slate-300 truncate">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 mb-8">
          You haven't added any portfolio items yet.
        </p>
      )}

      {/* --- Section to Add New Items --- */}
      <h3 className="text-xl font-bold mb-4 text-slate-200">Add New Items</h3>
      <div className="space-y-4">
        {newItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  handleNewItemChange(item.id, "title", e.target.value)
                }
                placeholder="e.g., Winter Fashion Showcase"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Media File (Image or Video)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  handleNewItemChange(item.id, "file", e.target.files[0])
                }
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  handleNewItemChange(item.id, "description", e.target.value)
                }
                placeholder="e.g., A collaboration with Brand X..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveNewItem(item.id)}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-full self-end"
              aria-label="Remove item"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      {error && (
        <div className="flex items-center text-sm text-red-400 mt-4 p-3 bg-red-500/10 rounded-lg">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleAddNewItem}
          className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium"
        >
          <FiPlus className="mr-2" /> Add Another Item
        </button>
        {newItems.length > 0 && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg flex items-center transition-all duration-300"
          >
            {isUploading ? (
              <FiLoader className="animate-spin mr-2" />
            ) : (
              <FiUpload className="mr-2" />
            )}{" "}
            {isUploading
              ? "Uploading..."
              : `Upload ${newItems.filter((i) => i.file).length} New Item(s)`}
          </button>
        )}
      </div>

      {/* --- Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Portfolio Item"
        message="Are you sure you want to permanently delete this item? This action cannot be undone."
        confirmText="Yes, Delete It"
        isLoading={isDeleting}
      />
    </div>
  );
};
export default PortfolioManager;
