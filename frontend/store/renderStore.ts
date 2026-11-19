"use client";

import create from "zustand";
import type {
  Render,
  CreateRenderInput,
  UpdateRenderInput,
  RenderStatus,
} from "@/types/Render";
import { renderApi } from "@/lib/api/renderApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script
//           │        ├─ owns ─┬─ Scenes
//           │        ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//           │        ├─ owns ─┬─ Backgrounds         │
//           │        └─ owns ─┴─ Render Jobs  (this store — child of Episode)
//           │                          └─ drives ─► Pipeline Jobs (pipelineStore)
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface RenderState {
  renders: Render[];
  activeRender: Render | null;
  loading: boolean;
  error: string | null;
  fetchRenders: (episodeId?: string) => Promise<void>;
  fetchRenderByEpisode: (episodeId: string) => Promise<void>;
  createRender: (data: CreateRenderInput) => Promise<void>;
  updateRender: (id: string, data: UpdateRenderInput) => Promise<void>;
  deleteRender: (id: string) => Promise<void>;
  setActiveRender: (render: Render | null) => void;
  clearError: () => void;
}

export const useRenderStore = create<RenderState>((set, get) => ({
  renders: [],
  activeRender: null,
  loading: false,
  error: null,

  fetchRenders: async (episodeId?: string) => {
    set({ loading: true, error: null });
    try {
      const renders = await renderApi.getRenders(episodeId);
      const filtered = episodeId
        ? renders.filter((r) => r.episode_id === episodeId)
        : renders;
      set({ renders: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch renders", loading: false });
    }
  },

  fetchRenderByEpisode: async (episodeId: string) => {
    set({ loading: true, error: null });
    try {
      const render = await renderApi.getRenderByEpisode(episodeId);
      set({ activeRender: render, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch render for episode", loading: false });
    }
  },

  createRender: async (data: CreateRenderInput) => {
    set({ loading: true, error: null });
    try {
      const render = await renderApi.createRender(data);
      set((state) => ({
        renders: [...state.renders, render],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create render", loading: false });
      throw error;
    }
  },

  updateRender: async (id: string, data: UpdateRenderInput) => {
    set({ loading: true, error: null });
    try {
      const render = await renderApi.updateRender(id, data);
      set((state) => ({
        renders: state.renders.map((r) => (r.id === id ? render : r)),
        activeRender:
          state.activeRender?.id === id ? render : state.activeRender,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update render", loading: false });
      throw error;
    }
  },

  deleteRender: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await renderApi.deleteRender(id);
      set((state) => ({
        renders: state.renders.filter((r) => r.id !== id),
        activeRender:
          state.activeRender?.id === id ? null : state.activeRender,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete render", loading: false });
      throw error;
    }
  },

  setActiveRender: (render) => set({ activeRender: render }),

  clearError: () => set({ error: null }),
}));