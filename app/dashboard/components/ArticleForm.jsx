"use client";

import { useState, useEffect } from "react";
import { FiX, FiImage, FiVideo, FiSave, FiTag, FiFolder } from "react-icons/fi";

const ArticleForm = ({ article, onSubmit, onCancel, mode, isSaving }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    featuredImage: "",
    featuredImageFile: null,
    images: [],
    videos: [],
    categories: [],
    tags: [],
    readTime: "",
    featured: true, // Always true
    status: "draft",
  });

  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (mode === "edit" && article) {
      setFormData({
        ...article,
        categories: article.categories || [],
        tags: article.tags || [],
        featuredImageFile: null,
        featured: true, // Always true
      });
    }
  }, [article, mode]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (
        formData.featuredImage &&
        formData.featuredImage.startsWith("blob:")
      ) {
        URL.revokeObjectURL(formData.featuredImage);
      }
    };
  }, [formData.featuredImage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        if (prev.featuredImage.startsWith("blob:")) {
          URL.revokeObjectURL(prev.featuredImage);
        }
        const previewUrl = URL.createObjectURL(file);
        return {
          ...prev,
          featuredImage: previewUrl,
          featuredImageFile: file,
        };
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, featured: true }); // Ensure featured is always true on submit
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700"
    >
      <div className="space-y-8">
        {/* Main Form Content */}
        <div className="space-y-6">
          {/* Title Group */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Read Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Estimated Read Time (minutes)
            </label>
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              min="1"
              placeholder="e.g., 5"
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FiImage className="text-indigo-400" /> Featured Image
            </label>
            <div className="flex items-center gap-2 p-2 border border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 bg-slate-700">
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="hidden"
                id="featuredImageInput"
              />
              <label
                htmlFor="featuredImageInput"
                className="px-4 py-2 bg-slate-600 text-slate-100 rounded-lg hover:bg-slate-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                Choose File
              </label>
              <span className="text-slate-400 text-sm">
                {formData.featuredImageFile
                  ? formData.featuredImageFile.name
                  : "No file selected"}
              </span>
              {formData.featuredImage && (
                <div className="w-16 h-16 rounded-md overflow-hidden border border-slate-600">
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y min-h-[200px] placeholder:text-slate-400"
              required
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
              <FiFolder className="text-indigo-400" /> Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center pl-3 pr-2 py-1 bg-slate-700 rounded-full text-indigo-400 text-sm border border-slate-600"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-2 p-1 hover:bg-slate-600 rounded-full"
                  >
                    <FiX className="w-4 h-4 text-slate-300" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-slate-600 text-slate-100 rounded-lg hover:bg-slate-500 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className=" text-sm font-medium text-slate-300 flex items-center gap-2">
              <FiTag className="text-indigo-400" /> Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center pl-3 pr-2 py-1 bg-slate-700 rounded-full text-slate-300 text-sm border border-slate-600"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 p-1 hover:bg-slate-600 rounded-full"
                  >
                    <FiX className="w-4 h-4 text-slate-300" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-600 text-slate-100 rounded-lg hover:bg-slate-500 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="draft" className="bg-slate-700">
                Draft
              </option>
              <option value="published" className="bg-slate-700">
                Published
              </option>
              <option value="archived" className="bg-slate-700">
                Archived
              </option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-8 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all shadow-indigo-900/30"
          >
            <FiSave className="inline-block mr-2" />
            {isSaving ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
            ) : null}
            {mode === "create" ? "Publish Article" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ArticleForm;
