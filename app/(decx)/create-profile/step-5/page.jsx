"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useState } from "react";
import { FiPlus, FiX, FiUpload, FiArrowRight } from "react-icons/fi";
import { toast } from "sonner";

export default function StepFour() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);

  const addPortfolioItem = () => {
    setPortfolio([...portfolio, { file: null, description: "" }]);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const updatedPortfolio = [...portfolio];
    updatedPortfolio[index].file = file;

    if (file.type.startsWith("image/")) {
      updatedPortfolio[index].previewUrl = URL.createObjectURL(file);
    }

    setPortfolio(updatedPortfolio);
  };

  const handleDescriptionChange = (index, value) => {
    const updatedPortfolio = [...portfolio];
    updatedPortfolio[index].description = value;
    setPortfolio(updatedPortfolio);
  };

  const removePortfolioItem = (index) => {
    const item = portfolio[index];
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }

    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      portfolio.length === 0 ||
      portfolio.some((item) => !item.file || !item.description)
    ) {
      toast.error(
        "Please add at least one portfolio item with both a file and description."
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    portfolio.forEach((item, index) => {
      if (item.file) {
        formData.append(`portfolioItem-${index}-file`, item.file);
      }
      formData.append(`portfolioItem-${index}-description`, item.description);
    });

    const toastId = toast.loading("Uploading portfolio items...");

    try {
      const response = await fetch("/api/portfolio/upload", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload portfolio items.");
      }

      toast.success("Portfolio uploaded successfully!", { id: toastId });
      router.push("/create-profile/step-6");
    } catch (error) {
      toast.error(error.message || "Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileLayout step={4}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Your Portfolio</h2>
          <p className="text-slate-400">
            Showcase your best work with images/videos and descriptions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {portfolio.map((item, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Work
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                      id={`portfolio-file-${index}`}
                      required
                    />
                    <label
                      htmlFor={`portfolio-file-${index}`}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <FiUpload className="mr-2" />
                      {item.file ? item.file.name : "Choose file"}
                    </label>
                  </div>

                  {item.previewUrl && (
                    <div className="mt-3">
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="max-h-40 w-auto rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe this work and your role in it..."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    value={item.description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  title="Remove"
                  type="button"
                  onClick={() => removePortfolioItem(index)}
                  className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPortfolioItem}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <FiPlus className="mr-2" /> Add Portfolio Item
          </button>

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Next Step"}
            <FiArrowRight className="ml-2" />
          </button>
        </form>
      </div>
    </ProfileLayout>
  );
}
