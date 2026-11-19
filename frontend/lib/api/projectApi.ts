// Cartoon Studio AI — API service: Project
// Relation: Project (root) 1:N owns Episodes. All downstream entities trace
// back to a project via project_id.

import { apiClient } from "./client";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/types/Project";

export const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectInput): Promise<Project> => {
    const response = await apiClient.post<Project>("/projects", data);
    return response.data;
  },

  updateProject: async (
    id: string,
    data: UpdateProjectInput,
  ): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};