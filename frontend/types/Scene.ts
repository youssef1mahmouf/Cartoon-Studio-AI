// Cartoon Studio AI — Shared Domain Model: Scene
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes  (this module — one scene belongs to one episode)
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Scene belongs to exactly one Episode (episode_id). Scenes are extracted
// from the episode script and reference generated background images.

export type SceneStatus = "pending" | "generated" | "error";

export interface Scene {
  id: string;
  episode_id: string;
  scene_number: number;
  description: string | null;
  image_path: string | null;
  status: SceneStatus;
  created_at: string;
}

export interface CreateSceneInput {
  episode_id: string;
  scene_number: number;
  description?: string | null;
}

export interface UpdateSceneInput {
  scene_number?: number;
  description?: string | null;
  image_path?: string | null;
  status?: SceneStatus;
}