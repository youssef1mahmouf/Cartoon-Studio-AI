// Cartoon Studio AI — API service: Background
// Relation: Background belongs to one Project (project_id). Background images
// are referenced by scenes during render assembly.

import { apiClient } from "./client";
import type {
  Background,
  CreateBackgroundInput,
  UpdateBackgroundInput,
} from "@/types/Background";

export const backgroundApi = {
  getBackgrounds: async (projectId?: string): Promise<Background[]> => {
    const response = await apiClient.get<Background[]>("/backgrounds", {
      params: projectId ? { project_id: projectId } : undefined,
    });
    return response.data;
  },

  getBackground: async (id: string): Promise<Background> => {
    const response = await apiClient.get<Background>(`/backgrounds/${id}`);
    return response.data;
  },

  createBackground: async (
    data: CreateBackgroundInput,
  ): Promise<Background> => {
    const response = await apiClient.post<Background>("/backgrounds", data);
    return response.data;
  },

  updateBackground: async (
    id: string,
    data: UpdateBackgroundInput,
  ): Promise<Background> => {
    const response = await apiClient.patch<Background>(
      `/backgrounds/${id}`,
      data,
    );
    return response.data;
  },

  deleteBackground: async (id: string): Promise<void> => {
    await apiClient.delete(`/backgrounds/${id}`);
  },
};