"use client";

import create from "zustand";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/types/Project";
import { projectApi } from "@/lib/api/projectApi";

// Relational integration diagram (code comment):
//
// Project (this store — aggregate root)
// └─ owns ─┬─ Episodes  (episodeStore)
//          ├─ owns ─┬─ Script     (scriptStore)
//          ├─ owns ─┬─ Scenes     (sceneStore)
//          ├─ owns ─┬─ Characters (characterStore) ── owns ─┬─ Voices (voiceStore)
//          ├─ owns ─┬─ Backgrounds (backgroundStore)        │
//          └─ owns ─┴─ Render Jobs (renderStore) ───────────┴─► Pipeline Jobs (pipelineStore)
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<Project | void>;
  createNewProject: (data: CreateProjectInput) => Promise<Project | void>;
  updateProject: (id: string, data: UpdateProjectInput) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  setActiveProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectApi.getProjects();
      set({ projects, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch projects", loading: false });
    }
  },

  fetchProject: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const project = await projectApi.getProject(id);
      set({ activeProject: project, loading: false });
      return project;
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch project", loading: false });
    }
  },

  createNewProject: async (data: CreateProjectInput) => {
    set({ loading: true, error: null });
    try {
      const project = await projectApi.createProject(data);
      set((state) => ({
        projects: [...state.projects, project],
        loading: false,
      }));
      return project;
    } catch (error: any) {
      set({ error: error.message || "Failed to create project", loading: false });
      throw error;
    }
  },

  updateProject: async (id: string, data: UpdateProjectInput) => {
    set({ loading: true, error: null });
    try {
      const project = await projectApi.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? project : p)),
        activeProject:
          state.activeProject?.id === id ? project : state.activeProject,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update project", loading: false });
      throw error;
    }
  },

  removeProject: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await projectApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        activeProject:
          state.activeProject?.id === id ? null : state.activeProject,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete project", loading: false });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
  setActiveProject: (project: Project | null) => {
    set({ activeProject: project });
  },

  clearError: () => {
    set({ error: null });
  },
}));