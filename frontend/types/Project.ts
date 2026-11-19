// Cartoon Studio AI — Shared Domain Model: Project
// Relational integration diagram (code comment):
//
// Project  (ROOT — owns everything)
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Project is the top-level aggregate root. Every episode, script, scene,
// character, background, voice, render job and pipeline job transitively
// belongs to exactly one project.

export type ProjectStatus = "active" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
}