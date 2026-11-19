// Cartoon Studio AI — Shared Domain Model: Pipeline
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs  (this module)
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Pipeline Job belongs to one Episode (episode_id) and tracks the full
// production run: script analysis → scenes → characters → backgrounds →
// voices → render.

export type PipelineJobStatus = "pending" | "running" | "completed" | "failed";

export interface PipelineStep {
  id: string;
  name: string;
  status: PipelineJobStatus;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
}

export interface PipelineJob {
  id: string;
  episode_id: string;
  status: PipelineJobStatus;
  current_step: string | null;
  steps: PipelineStep[];
  progress: number; // 0-100
  created_at: string;
  updated_at: string;
}

export interface CreatePipelineJobInput {
  episode_id: string;
}

export interface UpdatePipelineJobInput {
  status?: PipelineJobStatus;
  current_step?: string | null;
  steps?: PipelineStep[];
  progress?: number;
}