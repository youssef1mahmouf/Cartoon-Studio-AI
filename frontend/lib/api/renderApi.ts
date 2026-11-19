// Cartoon Studio AI — API service: Render
// Relation: Render Job belongs to one Episode (episode_id). It assembles the
// episode's scenes, backgrounds and voices into the final video.

import { apiClient } from "./client";
import type { Render, CreateRenderInput, UpdateRenderInput } from "@/types/Render";

export const renderApi = {
  getRenders: async (episodeId?: string): Promise<Render[]> => {
    const response = await apiClient.get<Render[]>("/renders", {
      params: episodeId ? { episode_id: episodeId } : undefined,
    });
    return response.data;
  },

  getRender: async (id: string): Promise<Render> => {
    const response = await apiClient.get<Render>(`/renders/${id}`);
    return response.data;
  },

  getRenderByEpisode: async (episodeId: string): Promise<Render> => {
    const response = await apiClient.get<Render>(`/renders/${episodeId}`);
    return response.data;
  },

  createRender: async (data: CreateRenderInput): Promise<Render> => {
    const response = await apiClient.post<Render>("/renders", data);
    return response.data;
  },

  updateRender: async (
    id: string,
    data: UpdateRenderInput,
  ): Promise<Render> => {
    const response = await apiClient.patch<Render>(`/renders/${id}`, data);
    return response.data;
  },

  deleteRender: async (id: string): Promise<void> => {
    await apiClient.delete(`/renders/${id}`);
  },
};