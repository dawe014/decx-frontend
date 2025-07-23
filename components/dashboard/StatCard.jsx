export default function StatCard({ icon: Icon, title, value, colorClass }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-slate-700/50 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-slate-100">{value}</p>
      </div>
    </div>
  );
}
