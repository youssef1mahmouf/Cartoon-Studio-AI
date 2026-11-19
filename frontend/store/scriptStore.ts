"use client";

import create from "zustand";
import type {
  Script,
  CreateScriptInput,
  UpdateScriptInput,
  AnalyzeScriptInput,
  ScriptStatus,
} from "@/types/Script";
import { scriptApi } from "@/lib/api/scriptApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script  (this store — child of Episode)
//           │        ├─ owns ─┬─ Scenes
//           │        ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//           │        ├─ owns ─┬─ Backgrounds         │
//           │        └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface ScriptState {
  scripts: Script[];
  activeScript: Script | null;
  loading: boolean;
  error: string | null;
  fetchScripts: (episodeId: string) => Promise<void>;
  fetchScript: (episodeId: string) => Promise<void>;
  createScript: (data: CreateScriptInput) => Promise<void>;
  updateScript: (episodeId: string, data: UpdateScriptInput) => Promise<void>;
  analyzeScript: (episodeId: string) => Promise<void>;
  deleteScript: (episodeId: string) => Promise<void>;
  setActiveScript: (script: Script | null) => void;
  clearError: () => void;
}

export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: [],
  activeScript: null,
  loading: false,
  error: null,

  fetchScripts: async (episodeId: string) => {
    set({ loading: true, error: null });
    try {
      const scripts = await scriptApi.getScriptsByEpisode(episodeId);
      set({ scripts, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch scripts", loading: false });
    }
  },

  fetchScript: async (episodeId: string) => {
    set({ loading: true, error: null });
    try {
      const script = await scriptApi.getScript(episodeId);
      set({ activeScript: script, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch script", loading: false });
    }
  },

  createScript: async (data: CreateScriptInput) => {
    set({ loading: true, error: null });
    try {
      const script = await scriptApi.createScript(data);
      set((state) => ({
        scripts: [...state.scripts, script],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create script", loading: false });
      throw error;
    }
  },

  updateScript: async (episodeId: string, data: UpdateScriptInput) => {
    set({ loading: true, error: null });
    try {
      const script = await scriptApi.updateScript(episodeId, data);
      set((state) => ({
        scripts: state.scripts.map((s) =>
          s.id === script.id ? script : s,
        ),
        activeScript:
          state.activeScript?.id === script.id ? script : state.activeScript,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update script", loading: false });
      throw error;
    }
  },

  analyzeScript: async (episodeId: string) => {
    set({ loading: true, error: null });
    try {
      await scriptApi.analyzeScript({ episode_id: episodeId });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to analyze script", loading: false });
      throw error;
    }
  },

  deleteScript: async (episodeId: string) => {
    set({ loading: true, error: null });
    try {
      await scriptApi.deleteScript(episodeId);
      set((state) => ({
        scripts: state.scripts.filter((s) => s.episode_id !== episodeId),
        activeScript:
          state.activeScript?.episode_id === episodeId
            ? null
            : state.activeScript,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete script", loading: false });
      throw error;
    }
  },

  setActiveScript: (script) => set({ activeScript: script }),

  clearError: () => set({ error: null }),
}));