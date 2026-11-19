import Sidebar from '@/components/ui/layout/Sidebar';
import Topbar from '@/components/ui/layout/Topbar';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/forms';

export default function Projects() {
  const { projects, setProjects, addProject, deleteProject } = useStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Projects</h1>

          {/* Project Form */}
          <div className="grid max-w-md mb-6">
            <input
              type="text"
              placeholder="Project name"
              className="w-full px-3 py-2 rounded-lg bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              ref={ref => /* TODO: handle submit */ }
            />
            <Button onClick={() => {}}>Create Project</Button>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-card rounded-xl p-4 flex items-center justify-between">
                <span className="font-medium text-foreground">{project.name}</span>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}