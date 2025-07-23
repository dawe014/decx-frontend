import {
  FaAward,
  FaCheckCircle,
  FaCircle,
  FaSpinner,
  FaStar,
} from "react-icons/fa";

export const getSafeValue = (obj, path, defaultValue = "Not specified") => {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  return result ?? defaultValue;
};

export const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-400";
    case "shortlisted":
      return "bg-blue-500/10 text-blue-400";
    case "rejected":
      return "bg-red-500/10 text-red-400";
    case "hired":
      return "bg-green-500/10 text-green-400";
    case "completed":
      return "bg-purple-500/10 text-purple-400";
    default:
      return "bg-slate-700 text-slate-400";
  }
};

export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return <FaSpinner className="mr-1.5" size={14} />;
    case "shortlisted":
      return <FaStar className="mr-1.5" size={14} />;
    case "rejected":
      return <FaCircle className="mr-1.5" size={14} />;
    case "hired":
      return <FaCheckCircle className="mr-1.5" size={14} />;
    case "completed":
      return <FaAward className="mr-1.5" size={14} />;
    default:
      return null;
  }
};
