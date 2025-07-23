import React from "react";
import ArticleForm from "../../components/ArticleForm";
import { toast } from "sonner";
import { useState } from "react";
export default function NewArticle() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formMode, setFormMode] = useState("create");

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
        if (!data.success) {
          setIsSaving(false);
          toast.error(data.message);
          throw new Error(data.message || "Request failed");
        }

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
        if (!res.ok) {
          setIsSaving(false);
          throw new Error(data.error || "Failed to update article.");
        }
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
    }
  };
  return (
    <div>
      <ArticleForm
        formMode="create"
        onSubmit={handleFormSubmit}
        isModalOpen={true}
        isSaving={isSaving}
      />
    </div>
  );
}
