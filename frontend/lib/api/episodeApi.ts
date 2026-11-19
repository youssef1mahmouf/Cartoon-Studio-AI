// Cartoon Studio AI — API service: Episode
// Relation: Episode belongs to one Project (project_id) and owns Script,
// Scenes, Characters, Backgrounds, Voices and Render Jobs.

import { apiClient } from "./client";
import type {
  Episode,
  CreateEpisodeInput,
  UpdateEpisodeInput,
} from "@/types/Episode";

export const episodeApi = {
  getEpisodes: async (projectId?: string): Promise<Episode[]> => {
    const response = await apiClient.get<Episode[]>("/episodes", {
      params: projectId ? { project_id: projectId } : undefined,
    });
    return response.data;
  },

  getEpisode: async (id: string): Promise<Episode> => {
    const response = await apiClient.get<Episode>(`/episodes/${id}`);
    return response.data;
  },

  createEpisode: async (data: CreateEpisodeInput): Promise<Episode> => {
    const response = await apiClient.post<Episode>("/episodes", data);
    return response.data;
  },

  updateEpisode: async (
    id: string,
    data: UpdateEpisodeInput,
  ): Promise<Episode> => {
    const response = await apiClient.patch<Episode>(`/episodes/${id}`, data);
    return response.data;
  },

  deleteEpisode: async (id: string): Promise<void> => {
    await apiClient.delete(`/episodes/${id}`);
  },
};