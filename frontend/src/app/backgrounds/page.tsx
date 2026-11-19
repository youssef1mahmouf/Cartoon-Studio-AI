import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/forms';

export default function BackgroundManager() {
  const { projects } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Background Manager</h1>

          {/* Background Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {/* Background cards will be populated here */}
            <div
              className="border rounded-xl p-6 text-center hover:bg-card transition-colors"
              style={{ height: '250px' }}
            >
              <div className="w-32 h-20 rounded-md mx-auto mb-3 bg-muted flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-muted-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 2v4l10 8-10 8v-4" />
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-2">Background Name</h3>
              <p className="text-xs text-muted-400">Click Generate</p>
            </div>
          </div>

          {/* Generate Background Button */}
          <div className="grid max-w-md">
            <Button onClick={() => {}>Generate Background</Button>
          </div>
        </main>
      </div>
    </div>
  );
}