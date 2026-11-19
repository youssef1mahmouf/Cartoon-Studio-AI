"use client";

import create from "zustand";
import type {
  PipelineJob,
  CreatePipelineJobInput,
  UpdatePipelineJobInput,
  PipelineJobStatus,
} from "@/types/Pipeline";
import { pipelineApi } from "@/lib/api/pipelineApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script
//           │        ├─ owns ─┬─ Scenes
//           │        ├─ owns ─┬─ Characters ── owns ─┬─ Voices
//           │        ├─ owns ─┬─ Backgrounds         │
//           │        └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs  (this store — child of Episode)
//           │                                                        │
//           │                                                        └─ steps:
//           │                                                            Script → Scenes → Characters →
//           │                                                            Backgrounds → Voices → Render
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface PipelineState {
  jobs: PipelineJob[];
  activeJob: PipelineJob | null;
  loading: boolean;
  error: string | null;
  fetchJobs: (episodeId?: string) => Promise<void>;
  fetchJob: (id: string) => Promise<void>;
  createJob: (data: CreatePipelineJobInput) => Promise<void>;
  updateJob: (id: string, data: UpdatePipelineJobInput) => Promise<void>;
  getStatus: (jobId: string) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  setActiveJob: (job: PipelineJob | null) => void;
  clearError: () => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  jobs: [],
  activeJob: null,
  loading: false,
  error: null,

  fetchJobs: async (episodeId?: string) => {
    set({ loading: true, error: null });
    try {
      const jobs = await pipelineApi.getJobs(episodeId);
      const filtered = episodeId
        ? jobs.filter((j) => j.episode_id === episodeId)
        : jobs;
      set({ jobs: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch pipeline jobs", loading: false });
    }
  },

  fetchJob: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const job = await pipelineApi.getJob(id);
      set({ activeJob: job, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch pipeline job", loading: false });
    }
  },

  createJob: async (data: CreatePipelineJobInput) => {
    set({ loading: true, error: null });
    try {
      const job = await pipelineApi.createJob(data);
      set((state) => ({
        jobs: [...state.jobs, job],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create pipeline job", loading: false });
      throw error;
    }
  },

  updateJob: async (id: string, data: UpdatePipelineJobInput) => {
    set({ loading: true, error: null });
    try {
      const job = await pipelineApi.updateJob(id, data);
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? job : j)),
        activeJob: state.activeJob?.id === id ? job : state.activeJob,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update pipeline job", loading: false });
      throw error;
    }
  },

  getStatus: async (jobId: string) => {
    set({ loading: true, error: null });
    try {
      const job = await pipelineApi.getStatus(jobId);
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === jobId ? job : j)),
        activeJob:
          state.activeJob?.id === jobId ? job : state.activeJob,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch pipeline job status", loading: false });
    }
  },

  cancelJob: async (jobId: string) => {
    set({ loading: true, error: null });
    try {
      await pipelineApi.cancelJob(jobId);
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === jobId ? { ...j, status: "failed" as PipelineJobStatus } : j,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to cancel pipeline job", loading: false });
      throw error;
    }
  },

  setActiveJob: (job) => set({ activeJob: job }),

  clearError: () => set({ error: null }),
}));
