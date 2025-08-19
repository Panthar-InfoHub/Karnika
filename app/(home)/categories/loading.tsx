export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
