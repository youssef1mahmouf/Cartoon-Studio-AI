"use client";

import create from "zustand";
import type {
  Background,
  CreateBackgroundInput,
  UpdateBackgroundInput,
  BackgroundStatus,
} from "@/types/Background";
import { backgroundApi } from "@/lib/api/backgroundApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script
//           │        ├─ owns ─┬─ Scenes
//           │        ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//           │        ├─ owns ─┬─ Backgrounds  (this store — child of Project)
//           │        └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface BackgroundState {
  backgrounds: Background[];
  activeBackground: Background | null;
  loading: boolean;
  error: string | null;
  fetchBackgrounds: (projectId?: string) => Promise<void>;
  createBackground: (data: CreateBackgroundInput) => Promise<void>;
  updateBackground: (id: string, data: UpdateBackgroundInput) => Promise<void>;
  deleteBackground: (id: string) => Promise<void>;
  setActiveBackground: (background: Background | null) => void;
  clearError: () => void;
}

export const useBackgroundStore = create<BackgroundState>((set, get) => ({
  backgrounds: [],
  activeBackground: null,
  loading: false,
  error: null,

  fetchBackgrounds: async (projectId?: string) => {
    set({ loading: true, error: null });
    try {
      const backgrounds = await backgroundApi.getBackgrounds(projectId);
      const filtered = projectId
        ? backgrounds.filter((b) => b.project_id === projectId)
        : backgrounds;
      set({ backgrounds: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch backgrounds", loading: false });
    }
  },

  createBackground: async (data: CreateBackgroundInput) => {
    set({ loading: true, error: null });
    try {
      const background = await backgroundApi.createBackground(data);
      set((state) => ({
        backgrounds: [...state.backgrounds, background],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create background", loading: false });
      throw error;
    }
  },

  updateBackground: async (id: string, data: UpdateBackgroundInput) => {
    set({ loading: true, error: null });
    try {
      const background = await backgroundApi.updateBackground(id, data);
      set((state) => ({
        backgrounds: state.backgrounds.map((b) =>
          b.id === id ? background : b,
        ),
        activeBackground:
          state.activeBackground?.id === id
            ? background
            : state.activeBackground,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update background", loading: false });
      throw error;
    }
  },

  deleteBackground: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await backgroundApi.deleteBackground(id);
      set((state) => ({
        backgrounds: state.backgrounds.filter((b) => b.id !== id),
        activeBackground:
          state.activeBackground?.id === id ? null : state.activeBackground,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete background", loading: false });
      throw error;
    }
  },

  setActiveBackground: (background) => set({ activeBackground: background }),

  clearError: () => set({ error: null }),
}));