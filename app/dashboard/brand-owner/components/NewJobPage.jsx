"use client";

import { useCampaignForm } from "@/hooks/useCampaignForm";
import CampaignForm from "./CampaignForm";

export default function CreateCampaignPage() {
  const formProps = useCampaignForm(); // Call hook without an ID

  return <CampaignForm formType="create" {...formProps} />;
}
