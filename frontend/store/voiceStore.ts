"use client";

import create from "zustand";
import type {
  Voice,
  CreateVoiceInput,
  UpdateVoiceInput,
  VoiceStatus,
} from "@/types/Voice";
import { voiceApi } from "@/lib/api/voiceApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script
//           │        ├─ owns ─┬─ Scenes
//           │        ├─ owns ─┬─ Characters ── owns ─┬─ Voices  (this store — child of Character)
//           │        ├─ owns ─┬─ Backgrounds         │
//           │        └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface VoiceState {
  voices: Voice[];
  activeVoice: Voice | null;
  loading: boolean;
  error: string | null;
  fetchVoices: (characterId?: string) => Promise<void>;
  createVoice: (data: CreateVoiceInput) => Promise<void>;
  updateVoice: (id: string, data: UpdateVoiceInput) => Promise<void>;
  deleteVoice: (id: string) => Promise<void>;
  setActiveVoice: (voice: Voice | null) => void;
  clearError: () => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voices: [],
  activeVoice: null,
  loading: false,
  error: null,

  fetchVoices: async (characterId?: string) => {
    set({ loading: true, error: null });
    try {
      const voices = await voiceApi.getVoices(characterId);
      const filtered = characterId
        ? voices.filter((v) => v.character_id === characterId)
        : voices;
      set({ voices: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch voices", loading: false });
    }
  },

  createVoice: async (data: CreateVoiceInput) => {
    set({ loading: true, error: null });
    try {
      const voice = await voiceApi.createVoice(data);
      set((state) => ({
        voices: [...state.voices, voice],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create voice", loading: false });
      throw error;
    }
  },

  updateVoice: async (id: string, data: UpdateVoiceInput) => {
    set({ loading: true, error: null });
    try {
      const voice = await voiceApi.updateVoice(id, data);
      set((state) => ({
        voices: state.voices.map((v) => (v.id === id ? voice : v)),
        activeVoice:
          state.activeVoice?.id === id ? voice : state.activeVoice,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update voice", loading: false });
      throw error;
    }
  },

  deleteVoice: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await voiceApi.deleteVoice(id);
      set((state) => ({
        voices: state.voices.filter((v) => v.id !== id),
        activeVoice:
          state.activeVoice?.id === id ? null : state.activeVoice,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete voice", loading: false });
      throw error;
    }
  },

  setActiveVoice: (voice) => set({ activeVoice: voice }),

  clearError: () => set({ error: null }),
}));