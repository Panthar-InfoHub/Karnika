export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center text-sm mb-6">
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
          <span className="mx-2">›</span>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <span className="mx-2">›</span>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Product Images Skeleton */}
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-8">
            <div className="space-y-4">
              <div className="aspect-square w-full max-w-md mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Title and basic info */}
              <div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="flex items-center mb-4">
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 ml-2 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>

              {/* Description */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>

              {/* Purchase options */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
                  ))}
                </div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
