import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/forms';

export default function PipelineMonitor() {
  const { jobs, setJobs } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Pipeline Monitor</h1>

          {/* Current Jobs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-xl p-4 flex-col h-full"
              >
                <div className="text-sm font-medium mb-2">{job.name || job.id}</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 bg-primary rounded-full transition-width"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-400 mb-2">{job.progress}%</span>
                </div>
                <div className="text-xs text-muted-400">{job.status}</div>
              </div>
            ))}
          </div>

          {/* Logs Section */}
          <div className="bg-card rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Logs</h2>
            <div className="height-96 overflow-y-auto space-y-2 text-xs text-muted-400">
              {/* Logs will be populated here */}
              <div>No logs yet. Pipeline jobs will appear here as they process.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}