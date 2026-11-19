// Cartoon Studio AI — Shared Domain Model: Voice
// Relational integration diagram (code comment):
//
// Project
// └─ owns ─┬─ Episodes
//          ├─ owns ─┬─ Script
//          ├─ owns ─┬─ Scenes
//          ├─ owns ─┬─ Characters ── owns ─┬─ Voices  (this module)
//          ├─ owns ─┬─ Backgrounds         │
//          └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode
//
// A Voice belongs to exactly one Character (character_id). Voices are
// generated from character prompts and consumed by the episode render job.

export type VoiceProvider = "kokoro" | "piper";
export type VoiceStatus = "pending" | "generated" | "error";

export interface Voice {
  id: string;
  character_id: string;
  voice_provider: VoiceProvider;
  audio_path: string;
  status: VoiceStatus;
  created_at: string;
}

export interface CreateVoiceInput {
  character_id: string;
  voice_provider: VoiceProvider;
}

export interface UpdateVoiceInput {
  voice_provider?: VoiceProvider;
  audio_path?: string | null;
  status?: VoiceStatus;
}