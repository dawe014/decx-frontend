"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialFormData = {
  title: "",
  description: "",
  niches: [""],
  targetLocations: [""],
  targetLanguages: [""],
  budget: { min: "", max: "", currency: "USD" },
  startDate: "",
  endDate: "",
  deliverables: [{ type: "post", description: "", quantity: 1 }],
  contentRequirements: "",
  platforms: [""],
  influencerCriteria: {
    minFollowers: "",
    minEngagementRate: "",
    gender: "any",
    ageRange: { min: "", max: "" },
  },
  status: "draft",
};

export function useCampaignForm(campaignId = null) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(!!campaignId); // Only true if we are editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      setIsLoading(false);
      return;
    }

    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) throw new Error("Failed to fetch campaign");
        const { campaign: data } = await response.json();

        // Ensure arrays have at least one empty item for the UI
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
        toast.error("Could not load campaign data.");
        router.push("/dashboard/brand-owner"); // Or an error page
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, router]);

  // All your handler functions remain the same, just using setFormData from this hook
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleDeepNestedChange = (parent, child, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: { ...prev[parent][child], [field]: value },
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

  const addArrayField = (field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
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

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        { type: "post", description: "", quantity: 1 },
      ],
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

    const isEditing = !!campaignId;
    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing ? `/api/campaigns/${campaignId}` : "/api/campaigns";
    const successMessage = isEditing
      ? "Campaign updated successfully"
      : "Campaign created successfully";
    const errorMessage = `Failed to ${
      isEditing ? "update" : "create"
    } campaign`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorMessage);
      }

      await response.json();
      toast.success(successMessage);
      router.push("/dashboard/brand-owner");
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleNestedChange,
    handleDeepNestedChange,
    handleArrayChange,
    addArrayField,
    removeArrayField,
    handleDeliverableChange,
    addDeliverable,
    removeDeliverable,
  };
}
