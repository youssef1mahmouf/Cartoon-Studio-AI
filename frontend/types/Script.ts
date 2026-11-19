// Cartoon Studio AI — Shared Domain Model: Script
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script  (this module — text content of one episode)
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Script belongs to exactly one Episode (episode_id). It is the source of
// truth for scene extraction, character and background generation.

export type ScriptStatus = "pending" | "analyzing" | "completed" | "error";

export interface Script {
  id: string;
  episode_id: string;
  content: string;
  version: number;
  status: ScriptStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateScriptInput {
  episode_id: string;
  content: string;
}

export interface UpdateScriptInput {
  content?: string;
  status?: ScriptStatus;
}

export interface AnalyzeScriptInput {
  episode_id: string;
}