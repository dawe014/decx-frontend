import { FiAlertTriangle } from "react-icons/fi";

export default function ErrorDisplay({ message }) {
  return (
    <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center justify-center">
      <FiAlertTriangle className="mr-3 h-6 w-6" />
      <p>{message || "An unexpected error occurred."}</p>
    </div>
  );
}
