// Cartoon Studio AI — Shared Domain Model: Background
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds  (this module — belongs to a project)
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Background belongs to one Project (project_id). Background images are
// referenced by scenes during render assembly.

export type BackgroundStatus = "pending" | "generated" | "error";

export interface Background {
  id: string;
  project_id: string;
  prompt: string | null;
  image_path: string | null;
  status: BackgroundStatus;
  created_at: string;
}

export interface CreateBackgroundInput {
  project_id: string;
  prompt: string;
}

export interface UpdateBackgroundInput {
  prompt?: string | null;
  image_path?: string | null;
  status?: BackgroundStatus;
}