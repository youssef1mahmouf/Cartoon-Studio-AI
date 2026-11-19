import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  created_at: string;
}

interface Episode {
  id: string;
  name: string;
  project_id: string;
  status: 'ScriptReceived' | 'AnalysisCompleted' | 'ImagesGenerated' | 'VoicesGenerated' | 'ScenesBuilt' | 'Rendering' | 'Finished';
  progress: number;
}

interface Asset {
  id: string;
  name: string;
  type: 'character' | 'background' | 'voice';
  project_id: string;
}

interface RenderJob {
  id: string;
  episode_id: string;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  progress: number;
  output_path?: string;
}

interface Settings {
  openrouter_key: string | null;
  huggingface_key: string | null;
  selected_provider: 'kokoro' | 'piper';
}

interface UIState {
  notifications: Notification[];
}

interface Store {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;

  episodes: Episode[];
  setEpisodes: (episodes: Episode[]) => void;
  addEpisode: (episode: Episode) => void;
  updateEpisode: (id: string, updates: Partial<Episode>) => void;
  deleteEpisode: (id: string) => void;
  activeEpisode: Episode | null;
  setActiveEpisode: (episode: Episode | null) => void;

  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;

  renders: RenderJob[];
  setRenders: (renders: RenderJob[]) => void;
  updateRenderProgress: (id: string, progress: number) => void;
  activeRender: RenderJob | null;
  setActiveRender: (render: RenderJob | null) => void;

  jobs: PipelineJob[];
  setJobs: (jobs: PipelineJob[]) => void;
  addJob: (job: PipelineJob) => void;
  removeJob: (id: string) => void;
  activeJob: PipelineJob | null;
  setActiveJob: (job: PipelineJob | null) => void;

  settings: Settings;
  setSettings: (settings: Settings) => void;

  ui: UIState;
  setUI: (ui: UIState) => void;
}

export useStore = create()
  .devtools()
  .persist(
    (set) => ({
      projects: [],
      activeProject: null,
      episodes: [],
      activeEpisode: null,
      assets: [],
      renders: [],
      activeRender: null,
      jobs: [],
      activeJob: null,
      settings: {
        openrouter_key: null,
        huggingface_key: null,
        selected_provider: 'kokoro',
      },
      ui: { notifications: [] },
    }),
    { name: 'cartoon-studio-storage' }
  );