// Cartoon Studio AI — Shared Domain Model: Render
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs  (this module — renders one episode) ──► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Render Job belongs to exactly one Episode (episode_id). It assembles the
// episode's scenes, backgrounds and voices into the final video.

export type RenderStatus = "pending" | "rendering" | "completed" | "error";

export interface Render {
  id: string;
  episode_id: string;
  path: string;
  status: RenderStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateRenderInput {
  episode_id: string;
  path?: string;
  status?: RenderStatus;
}

export interface UpdateRenderInput {
  path?: string | null;
  status?: RenderStatus;
}