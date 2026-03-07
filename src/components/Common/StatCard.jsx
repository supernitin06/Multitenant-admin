

export default function StatCard({ label, value, color }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color || "text-gray-900 dark:text-white"}`}>{value}</h2>
    </div>
  );
}
