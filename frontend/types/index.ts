// Cartoon Studio AI — Shared TypeScript Models (barrel)
// All domain models live here so the API layer, Zustand stores and UI consume
// a single source of truth.
//
// Full integration diagram (code comment):
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  CARTOON STUDIO AI — RELATIONAL DOMAIN MODEL                        │
// │                                                                       │
// │  Project (aggregate root)                                             │
// │  │                                                                    │
// │  └─ owns 1:N ─ Episodes                                               │
// │             │                                                         │
// │             ├─ owns 1:1 ─ Script                                      │
// │             ├─ owns 1:N ─ Scenes (episode_id)                         │
// │             ├─ owns 1:N ─ Characters (project_id)                     │
// │             │        └─ owns 1:N ─ Voices (character_id)              │
// │             ├─ owns 1:N ─ Backgrounds (project_id)                    │
// │             └─ owns 1:N ─ Render Jobs (episode_id)                    │
// │                          └─ drives ─┬─ Pipeline Jobs (episode_id)    │
// │                                     │                                │
// │                                     └─ steps: Script → Scenes →      │
// │                                         Characters → Backgrounds →   │
// │                                         Voices → Render              │
// │                                                                       │
// │  Navigation flow:                                                     │
// │  Open Project → Open Episode → Edit Script → Generate Assets →        │
// │  Generate Voices → Render Episode                                     │
// │                                                                       │
// │  Modules: Project, Episode, Script, Scene, Character, Background,     │
// │  Voice, Render, Pipeline                                              │
// └─────────────────────────────────────────────────────────────────────┘

export type { ProjectStatus } from "./Project";
export type { Project, CreateProjectInput, UpdateProjectInput, ProjectFilters } from "./Project";

export type { EpisodeStatus } from "./Episode";
export type { Episode, CreateEpisodeInput, UpdateEpisodeInput, EpisodeFilters } from "./Episode";

export type { ScriptStatus } from "./Script";
export type { Script, CreateScriptInput, UpdateScriptInput, AnalyzeScriptInput } from "./Script";

export type { SceneStatus } from "./Scene";
export type { Scene, CreateSceneInput, UpdateSceneInput } from "./Scene";

export type { CharacterStatus } from "./Character";
export type { Character, CreateCharacterInput, UpdateCharacterInput } from "./Character";

export type { BackgroundStatus } from "./Background";
export type { Background, CreateBackgroundInput, UpdateBackgroundInput } from "./Background";

export type { VoiceProvider, VoiceStatus } from "./Voice";
export type { Voice, CreateVoiceInput, UpdateVoiceInput } from "./Voice";

export type { RenderStatus } from "./Render";
export type { Render, CreateRenderInput, UpdateRenderInput } from "./Render";

export type { PipelineJobStatus } from "./Pipeline";
export type {
  PipelineStep,
  PipelineJob,
  CreatePipelineJobInput,
  UpdatePipelineJobInput,
} from "./Pipeline";