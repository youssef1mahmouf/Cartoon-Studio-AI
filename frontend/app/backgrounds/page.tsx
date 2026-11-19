export default function BackgroundsPage() {
  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Backgrounds
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and manage background images
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Backgrounds will be rendered here */}
          <div className="group bg-gray-200 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">New Background</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Generate with AI</p>
          </div>
        </section>
      </div>
    </div>
  )
}