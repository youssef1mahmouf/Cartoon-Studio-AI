import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/forms';

export default function RenderCenter() {
  const { activeRender, renders } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Render Center</h1>

          {/* Render Button */}
          <div className="grid max-w-md mb-6">
            <Button onClick={() => {}>Render Episode</Button>
          </div>

          {/* Render Progress */}
          {activeRender ? (
            <div className="mb-6">
              <div className="flex items-between mb-2">
                <span className="text-foreground">{activeRender.episode_name || 'Episode'}</span>
                <span className="text-primary font-medium">{activeRender.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 bg-primary rounded-full transition-width"
                  style={{ width: `${activeRender.progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-muted-600">No active render</p>
          )}

          {/* Export Section */}
          <div className="mt-8 bg-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Export MP4</h2>
            <p className="text-muted-600">
              Render completed. Download your MP4 file from the renders list.
            </p>
            {renders.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Recent Renders</h3>
                {renders.map((render) => (
                  <div
                    key={render.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-sm text-foreground">
                      {render.id}
                    </span>
                    <span className="text-xs text-muted-400">
                      {render.progress}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-600 no-renders-yet">No renders yet</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}