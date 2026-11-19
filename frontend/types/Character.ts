// Cartoon Studio AI — Shared Domain Model: Character
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters  (this module — belongs to a project, owns voices)
//          │         └─ owns ─┬─ Voices
//          ├─ owns ─┬─ Backgrounds
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Character belongs to one Project (project_id) and can appear in many
// episodes. Each Character owns its Voice records (character_id).

export type CharacterStatus = "pending" | "generated" | "error";

export interface Character {
  id: string;
  project_id: string;
  name: string;
  prompt: string | null;
  image_path: string | null;
  status: CharacterStatus;
  created_at: string;
}

export interface CreateCharacterInput {
  project_id: string;
  name: string;
  prompt?: string | null;
}

export interface UpdateCharacterInput {
  name?: string;
  prompt?: string | null;
  image_path?: string | null;
  status?: CharacterStatus;
}