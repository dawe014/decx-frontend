const BrandProfileHeader = ({
  brandData,
  isEditing,
  formData,
  setFormData,
  toast,
}) => {
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading logo...");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, logo: url }));
      toast.success("Logo uploaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo", { id: toastId });
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      {/* ... rest of the component remains the same ... */}
      <input
        type="file"
        onChange={handleLogoUpload}
        className="text-sm text-slate-300"
      />
      {/* ... rest of the component ... */}
    </div>
  );
};

export default BrandProfileHeader;
