"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiX,
  FiBarChart2,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";

export default function CampaignForm() {
  const router = useRouter();
  const { jobsId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    niches: [""],
    targetLocations: [""],
    targetLanguages: [""],
    budget: {
      min: "",
      max: "",
      currency: "USD",
    },
    startDate: "",
    endDate: "",
    deliverables: [
      {
        type: "post",
        description: "",
        quantity: 1,
      },
    ],
    contentRequirements: "",
    platforms: [""],
    influencerCriteria: {
      minFollowers: "",
      minEngagementRate: "",
      gender: "any",
      ageRange: {
        min: "",
        max: "",
      },
    },
    status: "draft",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch campaign data when component mounts
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${jobsId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch campaign");
        }
        const { campaign: data } = await response.json();

        // Ensure arrays have at least one item
        const formattedData = {
          ...data,
          niches: data.niches?.length ? data.niches : [""],
          targetLocations: data.targetLocations?.length
            ? data.targetLocations
            : [""],
          targetLanguages: data.targetLanguages?.length
            ? data.targetLanguages
            : [""],
          platforms: data.platforms?.length ? data.platforms : [""],
          deliverables: data.deliverables?.length
            ? data.deliverables
            : [{ type: "post", description: "", quantity: 1 }],
        };

        setFormData(formattedData);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (jobsId) {
      fetchCampaign();
    } else {
      setIsLoading(false);
    }
  }, [jobsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleDeepNestedChange = (parent, child, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: {
          ...prev[parent][child],
          [field]: value,
        },
      },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleDeliverableChange = (index, field, value) => {
    setFormData((prev) => {
      const newDeliverables = [...prev.deliverables];
      newDeliverables[index] = {
        ...newDeliverables[index],
        [field]: field === "quantity" ? parseInt(value) || 0 : value,
      };
      return { ...prev, deliverables: newDeliverables };
    });
  };

  const addArrayField = (field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        { type: "post", description: "", quantity: 1 },
      ],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const removeDeliverable = (index) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = jobsId ? "PATCH" : "POST";
      const url = jobsId ? `/api/campaigns/${jobsId}` : "/api/campaigns";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${jobsId ? "update" : "create"} campaign`);
      }

      const data = await response.json();
      toast.success("The campaign is update successfully");
      router.push(`/dashboard/brand-owner`);
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-400 hover:text-indigo-300 flex items-center mr-4"
          >
            <FiArrowLeft className="mr-1" />
          </button>
          <h1 className="text-2xl font-bold">
            {jobsId ? "Edit Campaign" : "Create New Campaign"}
          </h1>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Campaign Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Summer Product Launch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Describe the campaign goals, requirements, and any other important details..."
                    />
                  </div>
                </div>
              </div>

              {/* Niches */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">
                    Target Niches
                  </h3>
                  <button
                    type="button"
                    onClick={() => addArrayField("niches")}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Niche
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.niches.map((niche, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) =>
                          handleArrayChange("niches", index, e.target.value)
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Fashion, Fitness, Tech"
                      />
                      {formData.niches.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("niches", index)}
                          className="ml-2 text-slate-400 hover:text-red-400 p-2"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Locations */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">
                    Target Locations
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayField("targetLocations", "Worldwide")
                    }
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Location
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.targetLocations.map((location, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) =>
                          handleArrayChange(
                            "targetLocations",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. United States, Europe"
                      />
                      {formData.targetLocations.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField("targetLocations", index)
                          }
                          className="ml-2 text-slate-400 hover:text-red-400 p-2"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Languages */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">
                    Target Languages
                  </h3>
                  <button
                    type="button"
                    onClick={() => addArrayField("targetLanguages", "English")}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Language
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.targetLanguages.map((language, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={language}
                        onChange={(e) =>
                          handleArrayChange(
                            "targetLanguages",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. English, Spanish"
                      />
                      {formData.targetLanguages.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField("targetLanguages", index)
                          }
                          className="ml-2 text-slate-400 hover:text-red-400 p-2"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">
                  Budget
                </h3>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Min Budget ($)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={formData.budget.min}
                        onChange={(e) =>
                          handleNestedChange("budget", "min", e.target.value)
                        }
                        required
                        min="0"
                        className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Budget ($)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={formData.budget.max}
                        onChange={(e) =>
                          handleNestedChange("budget", "max", e.target.value)
                        }
                        required
                        min="0"
                        className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.budget.currency}
                      onChange={(e) =>
                        handleNestedChange("budget", "currency", e.target.value)
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">
                  Campaign Dates
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Date*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-slate-400" />
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Date*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-slate-400" />
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">
                    Deliverables
                  </h3>
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Deliverable
                  </button>
                </div>
                <div className="space-y-5">
                  {formData.deliverables.map((deliverable, index) => (
                    <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Type*
                          </label>
                          <select
                            value={deliverable.type}
                            onChange={(e) =>
                              handleDeliverableChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="post">Post</option>
                            <option value="story">Story</option>
                            <option value="video">Video</option>
                            <option value="mention">Mention</option>
                            <option value="review">Review</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Quantity*
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={deliverable.quantity}
                            onChange={(e) =>
                              handleDeliverableChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          {formData.deliverables.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDeliverable(index)}
                              className="text-slate-400 hover:text-red-400 p-2"
                            >
                              <FiX size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={deliverable.description}
                          onChange={(e) =>
                            handleDeliverableChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Details about this deliverable..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Requirements */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">
                  Content Requirements
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Detailed Requirements
                  </label>
                  <textarea
                    name="contentRequirements"
                    value={formData.contentRequirements}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Specify any content requirements (e.g. must show product, include hashtags, etc.)"
                  />
                </div>
              </div>

              {/* Platforms */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">
                    Social Media Platforms
                  </h3>
                  <button
                    type="button"
                    onClick={() => addArrayField("platforms")}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Platform
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.platforms.map((platform, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={platform}
                        onChange={(e) =>
                          handleArrayChange("platforms", index, e.target.value)
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Instagram, TikTok, YouTube"
                      />
                      {formData.platforms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("platforms", index)}
                          className="ml-2 text-slate-400 hover:text-red-400 p-2"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Influencer Criteria */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">
                  Influencer Requirements
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Minimum Followers
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.influencerCriteria.minFollowers || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "influencerCriteria",
                          "minFollowers",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. 10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Minimum Engagement Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={
                        formData.influencerCriteria.minEngagementRate || ""
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "influencerCriteria",
                          "minEngagementRate",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. 3.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.influencerCriteria.gender}
                      onChange={(e) =>
                        handleNestedChange(
                          "influencerCriteria",
                          "gender",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="any">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Age Range
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="13"
                        max="100"
                        value={formData.influencerCriteria.ageRange.min || ""}
                        onChange={(e) =>
                          handleDeepNestedChange(
                            "influencerCriteria",
                            "ageRange",
                            "min",
                            e.target.value
                          )
                        }
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Min"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="number"
                        min="13"
                        max="100"
                        value={formData.influencerCriteria.ageRange.max || ""}
                        onChange={(e) =>
                          handleDeepNestedChange(
                            "influencerCriteria",
                            "ageRange",
                            "max",
                            e.target.value
                          )
                        }
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href="/brand/jobs"
                  className="px-6 py-3 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {jobsId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      {jobsId ? "Update Campaign" : "Create Campaign"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
