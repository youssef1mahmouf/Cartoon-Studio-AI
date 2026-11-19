import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/forms';

export default function VoiceManager() {
  const { projects, jobs } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Voice Manager</h1>

          {/* Voice List */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Voice cards */}
            <div
              className="border rounded-xl p-4 text-center hover:bg-card transition-colors"
              style={{ height: '120px' }}
            >
              <div className="w-12 h-12 rounded-md mx-auto mb-2 bg-muted flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-muted-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </div>
              <h3 className="text-xs font-medium mb-1">Character Name</h3>
              <p className="text-xs text-muted-400">Click Generate</p>
            </div>
          </div>

          {/* Generate Voice Button */}
          <div className="grid max-w-md mb-6">
            <Button onClick={() => {}>Generate Voice</Button>
          </div>

          {/* Audio Preview Section */}
          <div className="bg-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Voices</h2>
            {jobs.length === 0 ? (
              <p className="text-muted-600">No voices yet</p>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm text-foreground">{job.name || job.id}</span>
                    <span className="text-sm text-muted-400">{job.progress}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}