import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/forms';

export default function CharacterManager() {
  const { projects } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Character Manager</h1>

          {/* Character Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {/* Character cards will be populated here */}
            <div
              className="border rounded-xl p-6 text-center hover:bg-card transition-colors"
              style={{ height: '200px' }}
            >
              <div className="w-16 h-16 rounded-md mx-auto mb-3 bg-muted flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-2">Character Name</h3>
              <p className="text-xs text-muted-400">Click Generate</p>
            </div>
          </div>

          {/* Generate Character Button */}
          <div className="grid max-w-md">
            <Button onClick={() => {}>Generate Character</Button>
          </div>
        </main>
      </div>
    </div>
  );
}