import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-800 dark:text-white">
        Page Not Found
      </h2>
      <p className="text-slate-500 mb-6 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
