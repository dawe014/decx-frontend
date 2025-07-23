"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCampaignDetails(campaignId) {
  const router = useRouter();

  // Core Data State
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // UI & Loading State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Async Operation State
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      setError("No Campaign ID provided.");
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [jobResponse, appsResponse] = await Promise.all([
          fetch(`/api/campaigns/${campaignId}`),
          fetch(`/api/applications/campaign/${campaignId}`),
        ]);

        if (!jobResponse.ok) {
          const errorData = await jobResponse.json();
          throw new Error(
            errorData.error || "Failed to fetch campaign details"
          );
        }

        const jobData = await jobResponse.json();
        setJob(jobData.campaign);

        if (appsResponse.ok) {
          const appsData = await appsResponse.json();
          setApplicants(appsData.applications || []);
        } else {
          console.warn("Could not fetch applications.");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [campaignId]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const searchMatch =
        applicant.influencer?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === "all" || applicant.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [applicants, searchTerm, statusFilter]);

  const handleStatusUpdate = async (applicationId, newStatus, campaignId) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/applications/campaign/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          applicationId,
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(`Status updated to ${newStatus}`);
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      if (selectedApplicant?._id === applicationId) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleInterview = async (influencer) => {
    if (!influencer?.user) return toast.error("Influencer details missing.");
    setIsCreatingThread(true);
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds: [influencer.user],
          title: `Interview: ${job.title}`,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to start conversation.");

      toast.success("Conversation started!");
      router.push(`/dashboard/brand-owner/messages/?threadId=${data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCreatingThread(false);
    }
  };

  return {
    job,
    loading,
    error,
    activeTab,
    searchTerm,
    statusFilter,
    selectedApplicant,
    isUpdatingStatus,
    isCreatingThread,
    filteredApplicants,
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setSelectedApplicant,
    handleStatusUpdate,
    handleInterview,
  };
}
