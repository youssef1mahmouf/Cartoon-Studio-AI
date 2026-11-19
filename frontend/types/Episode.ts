// Cartoon Studio AI — Shared Domain Model: Episode
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes  (this module — child of Project, parent of all assets)
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// An Episode belongs to one Project (project_id) and owns every downstream
// production asset: its script, scenes, characters, backgrounds, voices and
// render jobs.

export type EpisodeStatus =
  | "pending"
  | "analyzing"
  | "scenes_extracted"
  | "characters_extracted"
  | "prompts_generated"
  | "images_generated"
  | "voices_generated"
  | "rendering"
  | "completed"
  | "error";

export interface Episode {
  id: string;
  project_id: string;
  title: string;
  script: string | null;
  status: EpisodeStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateEpisodeInput {
  project_id: string;
  title: string;
  script?: string | null;
}

export interface UpdateEpisodeInput {
  title?: string;
  script?: string | null;
  status?: EpisodeStatus;
}

export interface EpisodeFilters {
  project_id?: string;
  status?: EpisodeStatus;
}