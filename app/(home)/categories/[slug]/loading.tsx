export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Category Header Skeleton */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="aspect-square mb-4 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
