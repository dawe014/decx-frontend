"use client";

import { useParams } from "next/navigation";
import { useCampaignForm } from "@/hooks/useCampaignForm";
import CampaignForm from "../../../components/CampaignForm";

// Dummy placeholders for the missing components
// Replace these with your actual implementations or imports
const SectionSkeleton = ({
  children,
  titleWidth = "w-40",
  hasAddButton = false,
}) => (
  <div>
    <div className="flex items-center mb-4">
      <div className={`h-6 ${titleWidth} bg-slate-600 rounded-md`}></div>
      {hasAddButton && (
        <div className="ml-2 h-6 w-6 bg-slate-600 rounded-full"></div>
      )}
    </div>
    {children}
  </div>
);

const FieldSkeleton = ({ height = "h-10" }) => (
  <div className={`${height} bg-slate-700 rounded-md`}></div>
);

// Main loading spinner component
const LoadingSpinner = () => (
  <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center mb-6">
        <div className="h-7 w-7 bg-slate-700 rounded-md mr-4"></div>
        <div className="h-8 w-64 bg-slate-700 rounded-md"></div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
        <div className="space-y-8">
          {/* Basic Information Skeleton */}
          <SectionSkeleton titleWidth="w-56">
            <div className="grid md:grid-cols-2 gap-5">
              <FieldSkeleton />
              <FieldSkeleton />
              <div className="md:col-span-2">
                <FieldSkeleton height="h-32" />
              </div>
            </div>
          </SectionSkeleton>

          {/* Array Fields Skeleton */}
          <SectionSkeleton titleWidth="w-40" hasAddButton>
            <div className="space-y-3">
              <FieldSkeleton />
            </div>
          </SectionSkeleton>

          <SectionSkeleton titleWidth="w-48" hasAddButton>
            <div className="space-y-3">
              <FieldSkeleton />
            </div>
          </SectionSkeleton>

          {/* Budget Skeleton */}
          <SectionSkeleton titleWidth="w-28">
            <div className="grid md:grid-cols-3 gap-5">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </SectionSkeleton>

          {/* Dates Skeleton */}
          <SectionSkeleton titleWidth="w-48">
            <div className="grid md:grid-cols-2 gap-5">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </SectionSkeleton>

          {/* Deliverables Skeleton */}
          <SectionSkeleton titleWidth="w-40" hasAddButton>
            <div className="space-y-5">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <FieldSkeleton height="h-10" />
                  <FieldSkeleton height="h-10" />
                </div>
                <FieldSkeleton height="h-20" />
              </div>
            </div>
          </SectionSkeleton>

          {/* Platforms Skeleton */}
          <SectionSkeleton titleWidth="w-64" hasAddButton>
            <div className="space-y-3">
              <FieldSkeleton />
            </div>
          </SectionSkeleton>

          {/* Influencer Requirements Skeleton */}
          <SectionSkeleton titleWidth="w-64">
            <div className="grid md:grid-cols-2 gap-5">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <div className="flex items-center space-x-3 pt-6">
                <FieldSkeleton />
                <div className="h-4 w-4 bg-slate-600 rounded-full"></div>
                <FieldSkeleton />
              </div>
            </div>
          </SectionSkeleton>

          {/* Form Actions Skeleton */}
          <div className="flex justify-end space-x-4 pt-4">
            <div className="h-12 w-24 bg-slate-700 rounded-lg"></div>
            <div className="h-12 w-44 bg-slate-600 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function EditCampaignPage() {
  const { id } = useParams();
  const formProps = useCampaignForm(id); // Call hook WITH the ID

  if (formProps.isLoading) {
    return <LoadingSpinner />;
  }

  return <CampaignForm formType="edit" {...formProps} />;
}
