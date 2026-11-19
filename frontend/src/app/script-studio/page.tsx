import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button, Textarea } from '@/components/ui/forms';

export default function ScriptStudio() {
  const { projects } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Script Studio</h1>

          {/* Script Editor */}
          <div className="grid max-w-full mb-6">
            <Textarea
              placeholder="Enter your script here..."
              value=""
              onChange={() => {}}
              rows={10}
              className="w-full"
            />
          </div>

          {/* Analyze Button */}
          <div className="grid max-w-md mb-6">
            <Button onClick={() => {}>Analyze Script</Button>
          </div>

          {/* Output Panel */}
          <div className="bg-card rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Analysis Output</h2>
            <p className="text-muted-600">No analysis yet. Click "Analyze Script" to begin.</p>
          </div>
        </main>
      </div>
    </div>
  );
}