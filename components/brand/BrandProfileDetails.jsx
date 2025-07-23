const BrandSubscriptionInfo = ({ brandData }) => {
  if (!brandData.subscription) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Subscription</h2>
        <p className="text-slate-300">No subscription information available</p>
      </div>
    );
  }

  const getSubscriptionColor = () => {
    switch (brandData.subscription.type) {
      case "free":
        return "bg-blue-600";
      case "basic":
        return "bg-green-600";
      case "premium":
        return "bg-purple-600";
      case "enterprise":
        return "bg-amber-600";
      default:
        return "bg-slate-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Subscription</h2>

      <div className="flex flex-wrap gap-4">
        <div
          className={`${getSubscriptionColor()} rounded-lg p-4 flex-1 min-w-[200px]`}
        >
          <p className="text-slate-200 text-sm">Plan</p>
          <p className="text-white font-bold capitalize">
            {brandData.subscription.type}
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 flex-1 min-w-[200px]">
          <p className="text-slate-200 text-sm">Status</p>
          <p className="text-white font-bold capitalize">
            {brandData.subscription.status}
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 flex-1 min-w-[200px]">
          <p className="text-slate-200 text-sm">Start Date</p>
          <p className="text-white font-bold">
            {formatDate(brandData.subscription.startDate)}
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 flex-1 min-w-[200px]">
          <p className="text-slate-200 text-sm">End Date</p>
          <p className="text-white font-bold">
            {formatDate(brandData.subscription.endDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandSubscriptionInfo;
