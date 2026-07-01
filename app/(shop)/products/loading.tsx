export default function ProductsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-9 w-44 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Category filter skeleton */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {[80, 64, 96, 72, 88].map((w, i) => (
          <div
            key={i}
            className="h-9 rounded-full bg-gray-200 animate-pulse"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-14 bg-gray-200 rounded" />
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-5 w-14 bg-gray-200 rounded" />
                <div className="h-9 w-28 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
