"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Layout,
  Film,
  FileText,
  Scissors,
  User,
  Image,
  Mic,
  Play,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/ui/layout/Sidebar";
import Topbar from "@/components/ui/layout/Topbar";

import { useProjectStore } from "@/store/projectStore";
import { useEpisodeStore } from "@/store/episodeStore";
import { useScriptStore } from "@/store/scriptStore";
import { useSceneStore } from "@/store/sceneStore";
import { useCharacterStore } from "@/store/characterStore";
import { useBackgroundStore } from "@/store/backgroundStore";
import { useVoiceStore } from "@/store/voiceStore";
import { useRenderStore } from "@/store/renderStore";
import { usePipelineStore } from "@/store/pipelineStore";

// Relational integration diagram (code comment):
//
// ProjectStore  ──►  EpisodeStore  ──►  ScriptStore
//      │              ├────────────►  SceneStore
//      │              ├────────────►  CharacterStore ─────► VoiceStore
//      │              ├────────────►  BackgroundStore
//      │              └────────────►  RenderStore ───────► PipelineStore
//
// Dashboard reads every card from these stores — no hardcoded values.

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color:
    | "indigo"
    | "blue"
    | "green"
    | "purple"
    | "amber"
    | "rose"
    | "cyan"
    | "orange"
    | "emerald";
}) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  // Project tier
  const {
    projects,
    activeProject,
    fetchProjects,
    createNewProject,
    loading: projectsLoading,
  } = useProjectStore();
  // Episode tier (child of Project)
  const { episodes, fetchEpisodes, createEpisode } = useEpisodeStore();
  // Script tier (child of Episode — script lives on the episode in this domain)
  const { scripts, fetchScripts, activeScript } = useScriptStore();
  // Scene tier (child of Episode)
  const { scenes, fetchScenes } = useSceneStore();
  // Character tier (child of Project)
  const { characters, fetchCharacters, createCharacter } = useCharacterStore();
  // Background tier (child of Project)
  const { backgrounds, fetchBackgrounds } = useBackgroundStore();
  // Voice tier (child of Character)
  const { voices, fetchVoices, createVoice } = useVoiceStore();
  // Render tier (child of Episode)
  const { renders, fetchRenders } = useRenderStore();
  // Pipeline tier (child of Episode)
  const { jobs, fetchJobs } = usePipelineStore();

  const [refreshing, setRefreshing] = useState(false);

  // Load the full domain graph on mount — real data, no hardcoded values.
  useEffect(() => {
    const loadStudio = async () => {
      await fetchProjects();
      await fetchEpisodes();
      // Scripts are stored on episodes; scenes load per-episode when opened.
      await fetchCharacters();
      await fetchBackgrounds();
      await fetchVoices();
      await fetchRenders();
      await fetchJobs();
    };
    void loadStudio();
  }, [fetchProjects, fetchEpisodes, fetchScripts, fetchScenes, fetchCharacters, fetchBackgrounds, fetchVoices, fetchRenders, fetchJobs]);

  const handleNewProject = () => {
    const name = window.prompt("Project name");
    if (!name) return;
    void createNewProject({ name, description: "" }).then(() => {
      void fetchProjects();
    });
  };

  const handleNewEpisode = async () => {
    if (!activeProject) {
      window.alert("Open a project first");
      return;
    }
    const title = window.prompt("Episode title");
    if (!title) return;
    await createEpisode({ project_id: activeProject.id, title });
    await fetchEpisodes();
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProjects(),
      fetchEpisodes(),
      fetchCharacters(),
      fetchBackgrounds(),
      fetchVoices(),
      fetchRenders(),
      fetchJobs(),
    ]);
    setRefreshing(false);
  };

  // Scripts live on episodes in this domain model: count episodes that have a script.
  const scriptCount = episodes.filter((episode) => Boolean(episode.script)).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto pl-64">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time overview of your cartoon production studio. Every card
              reads from its Zustand store.
            </p>
          </div>

          {/* Dashboard Cards — all values come from stores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Projects"
              value={projects.length}
              icon={Layout}
              color="indigo"
            />
            <StatCard
              label="Total Episodes"
              value={episodes.length}
              icon={Film}
              color="blue"
            />
            <StatCard
              label="Total Scripts"
              value={scriptCount}
              icon={FileText}
              color="green"
            />
            <StatCard
              label="Total Scenes"
              value={scenes.length}
              icon={Scissors}
              color="purple"
            />
            <StatCard
              label="Total Characters"
              value={characters.length}
              icon={User}
              color="amber"
            />
            <StatCard
              label="Total Backgrounds"
              value={backgrounds.length}
              icon={Image}
              color="rose"
            />
            <StatCard
              label="Total Voices"
              value={voices.length}
              icon={Mic}
              color="cyan"
            />
            <StatCard
              label="Total Renders"
              value={renders.length}
              icon={Play}
              color="orange"
            />
            <StatCard
              label="Pipeline Jobs"
              value={jobs.length}
              icon={Zap}
              color="emerald"
            />
          </div>

          {/* Quick Actions — wired to real store actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Relational flow:{" "}
              <span className="font-mono text-xs">
                Open Project &rarr; Open Episode &rarr; Edit Script &rarr;
                Generate Assets &rarr; Generate Voices &rarr; Render Episode
              </span>
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleNewProject} disabled={projectsLoading}>
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
              <Button
                onClick={handleNewEpisode}
                disabled={!activeProject || projectsLoading}
              >
                <Film className="w-4 h-4 mr-2" /> New Episode
              </Button>
              <Button onClick={handleRefreshAll} disabled={refreshing}>
                <Zap className="w-4 h-4 mr-2" /> Refresh All
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
