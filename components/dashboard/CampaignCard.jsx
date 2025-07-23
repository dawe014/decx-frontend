import Link from "next/link";
import {
  FiCalendar,
  FiDollarSign,
  FiEdit,
  FiTarget,
  FiTrash2,
} from "react-icons/fi";

// A small helper component for status badges
const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    paused: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    completed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  const style = statusStyles[status] || "bg-slate-600 text-slate-300";

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style} capitalize`}
    >
      {status}
    </span>
  );
};

// Formats dates for better readability
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CampaignCard({ campaign, onDelete }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-900/50">
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-slate-100 pr-4">
            {campaign.title}
          </h3>
          <StatusBadge status={campaign.status} />
        </div>

        {/* Card Body with Details */}
        <p className="text-slate-400 text-sm mb-5 line-clamp-2">
          {campaign.description}
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center text-slate-300">
            <FiDollarSign className="mr-3 text-indigo-400" />
            <span>
              Budget: {campaign.budget.min} - {campaign.budget.max}{" "}
              {campaign.budget.currency}
            </span>
          </div>
          <div className="flex items-center text-slate-300">
            <FiCalendar className="mr-3 text-indigo-400" />
            <span>
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </span>
          </div>
          <div className="flex items-start text-slate-300">
            <FiTarget className="mr-3 mt-1 text-indigo-400 flex-shrink-0" />
            <span className="line-clamp-1">
              Niches: {campaign.niches.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer with Actions */}
      <div className="border-t border-slate-700 mt-5 pt-4 flex justify-end space-x-3">
        <Link
          href={`/dashboard/brand-owner/campaigns/edit/${campaign._id}`}
          className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-slate-700"
          aria-label="Edit Campaign"
        >
          <FiEdit size={18} />
        </Link>
        <button
          onClick={() => onDelete(campaign._id)}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-slate-700"
          aria-label="Delete Campaign"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}
