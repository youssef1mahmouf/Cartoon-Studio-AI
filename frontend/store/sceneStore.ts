"use client";

import create from "zustand";
import type {
  Scene,
  CreateSceneInput,
  UpdateSceneInput,
  SceneStatus,
} from "@/types/Scene";
import { sceneApi } from "@/lib/api/sceneApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script
//           │        ├─ owns ─┬─ Scenes  (this store — child of Episode)
//           │        ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//           │        ├─ owns ─┬─ Backgrounds         │
//           │        └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface SceneState {
  scenes: Scene[];
  activeScene: Scene | null;
  loading: boolean;
  error: string | null;
  fetchScenes: (episodeId: string) => Promise<void>;
  createScene: (data: CreateSceneInput) => Promise<void>;
  updateScene: (id: string, data: UpdateSceneInput) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;
  setActiveScene: (scene: Scene | null) => void;
  clearError: () => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  scenes: [],
  activeScene: null,
  loading: false,
  error: null,

  fetchScenes: async (episodeId: string) => {
    set({ loading: true, error: null });
    try {
      const scenes = await sceneApi.getScenes();
      const filtered = scenes.filter((s) => s.episode_id === episodeId);
      set({ scenes: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch scenes", loading: false });
    }
  },

  createScene: async (data: CreateSceneInput) => {
    set({ loading: true, error: null });
    try {
      const scene = await sceneApi.createScene(data);
      set((state) => ({
        scenes: [...state.scenes, scene],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create scene", loading: false });
      throw error;
    }
  },

  updateScene: async (id: string, data: UpdateSceneInput) => {
    set({ loading: true, error: null });
    try {
      const scene = await sceneApi.updateScene(id, data);
      set((state) => ({
        scenes: state.scenes.map((s) => (s.id === id ? scene : s)),
        activeScene:
          state.activeScene?.id === id ? scene : state.activeScene,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update scene", loading: false });
      throw error;
    }
  },

  deleteScene: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await sceneApi.deleteScene(id);
      set((state) => ({
        scenes: state.scenes.filter((s) => s.id !== id),
        activeScene:
          state.activeScene?.id === id ? null : state.activeScene,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete scene", loading: false });
      throw error;
    }
  },

  setActiveScene: (scene) => set({ activeScene: scene }),

  clearError: () => set({ error: null }),
}));