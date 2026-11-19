"use client";

import create from "zustand";
import type {
  Episode,
  CreateEpisodeInput,
  UpdateEpisodeInput,
  EpisodeStatus,
} from "@/types/Episode";
import { episodeApi } from "@/lib/api/episodeApi";

// Relational integration diagram (code comment):
//
// Project ──┬─ owns ─┬─ Episodes (this store — child of Project)
//           │        ├─ owns ─┬─ Script     (scriptStore)
//           │        ├─ owns ─┬─ Scenes     (sceneStore)
//           │        ├─ owns ─┬─ Characters (characterStore) ── owns ─┬─ Voices (voiceStore)
//           │        ├─ owns ─┬─ Backgrounds (backgroundStore)        │
//           │        └─ owns ─┴─ Render Jobs (renderStore) ───────────┴─► Pipeline Jobs (pipelineStore)
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface EpisodeState {
  episodes: Episode[];
  activeEpisode: Episode | null;
  currentEpisode: Episode | null;
  loading: boolean;
  error: string | null;
  fetchEpisodes: (projectId?: string) => Promise<void>;
  fetchEpisode: (id: string) => Promise<void>;
  createEpisode: (data: CreateEpisodeInput) => Promise<void>;
  updateEpisode: (id: string, data: UpdateEpisodeInput) => Promise<void>;
  deleteEpisode: (id: string) => Promise<void>;
  setEpisodes: (episodes: Episode[]) => void;
  setCurrentEpisode: (episode: Episode | null) => void;
  setActiveEpisode: (episode: Episode | null) => void;
  addEpisode: (episode: Episode) => void;
  updateEpisodeStatus: (episodeId: string, status: EpisodeStatus) => void;
  clearError: () => void;
}

export const useEpisodeStore = create<EpisodeState>((set, get) => ({
  episodes: [],
  activeEpisode: null,
  currentEpisode: null,
  loading: false,
  error: null,

  fetchEpisodes: async (projectId?: string) => {
    set({ loading: true, error: null });
    try {
      const episodes = await episodeApi.getEpisodes(projectId);
      const filtered = projectId
        ? episodes.filter((e) => e.project_id === projectId)
        : episodes;
      set({ episodes: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch episodes", loading: false });
    }
  },

  fetchEpisode: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const episode = await episodeApi.getEpisode(id);
      set({ activeEpisode: episode, currentEpisode: episode, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch episode", loading: false });
    }
  },

  createEpisode: async (data: CreateEpisodeInput) => {
    set({ loading: true, error: null });
    try {
      const episode = await episodeApi.createEpisode(data);
      set((state) => ({
        episodes: [...state.episodes, episode],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create episode", loading: false });
      throw error;
    }
  },

  updateEpisode: async (id: string, data: UpdateEpisodeInput) => {
    set({ loading: true, error: null });
    try {
      const episode = await episodeApi.updateEpisode(id, data);
      set((state) => ({
        episodes: state.episodes.map((e) => (e.id === id ? episode : e)),
        activeEpisode:
          state.activeEpisode?.id === id ? episode : state.activeEpisode,
        currentEpisode:
          state.currentEpisode?.id === id ? episode : state.currentEpisode,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update episode", loading: false });
      throw error;
    }
  },

  deleteEpisode: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await episodeApi.deleteEpisode(id);
      set((state) => ({
        episodes: state.episodes.filter((e) => e.id !== id),
        activeEpisode:
          state.activeEpisode?.id === id ? null : state.activeEpisode,
        currentEpisode:
          state.currentEpisode?.id === id ? null : state.currentEpisode,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete episode", loading: false });
      throw error;
    }
  },

  setEpisodes: (episodes) => set({ episodes }),

  setCurrentEpisode: (episode) => set({ currentEpisode: episode }),

  setActiveEpisode: (episode) => set({ activeEpisode: episode }),

  addEpisode: (episode) =>
    set((state) => ({
      episodes: [...state.episodes, episode],
    })),

  updateEpisodeStatus: (episodeId, status) =>
    set((state) => ({
      episodes: state.episodes.map((episode) =>
        episode.id === episodeId ? { ...episode, status } : episode,
      ),
    })),

  clearError: () => set({ error: null }),
}));