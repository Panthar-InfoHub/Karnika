import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🛍️</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          The product you're looking for doesn't exist or may have been removed.
        </p>
        <div className="space-x-4">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
