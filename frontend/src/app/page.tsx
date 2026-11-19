import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';

export default function Dashboard() {
  const {
    projects,
    episodes,
    activeRender,
    renders,
    jobs,
    activeJob,
    assets,
    settings,
  } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="group bg-card rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary group-hover:text-foreground transition-colors mb-2">{projects.length}</div>
              <div className="font-medium text-muted-600">Total Projects</div>
            </div>

            <div className="group bg-card rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary group-hover:text-foreground transition-colors mb-2">{episodes.length}</div>
              <div className="font-medium text-muted-600">Total Episodes</div>
            </div>

            <div className="group bg-card rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary group-hover:text-foreground transition-colors mb-2">{assets.length}</div>
              <div className="font-medium text-muted-600">Assets</div>
            </div>

            <div className="group bg-card rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary group-hover:text-foreground transition-colors mb-2">{renders.length}</div>
              <div className="font-medium text-muted-600">Current Renders</div>
            </div>
          </div>

          {/* Pipeline Jobs Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Active Pipeline Jobs</h2>
              {jobs.length === 0 ? (
                <p className="text-muted-600">No active jobs</p>
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

            <div className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-foreground">OpenRouter:</span>
                  <span className="text-muted-400">{settings.openrouter_key ? '••••••••••••••••••••' : 'Not set'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground">HuggingFace:</span>
                  <span className="text-muted-400">{settings.huggingface_key ? '••••••••••' : 'Not set'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground">Provider:</span>
                  <span className="text-muted-400">{settings.selected_provider}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}