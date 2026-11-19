// Cartoon Studio AI — API service: Script
// Relation: Script belongs to one Episode (episode_id). It is the source of
// truth for scene extraction and asset generation.

import { apiClient } from "./client";
import type {
  Script,
  CreateScriptInput,
  UpdateScriptInput,
  AnalyzeScriptInput,
} from "@/types/Script";

export const scriptApi = {
  getScript: async (episodeId: string): Promise<Script> => {
    const response = await apiClient.get<Script>(`/scripts/${episodeId}`);
    return response.data;
  },

  getScriptsByEpisode: async (episodeId: string): Promise<Script[]> => {
    const response = await apiClient.get<Script[]>("/scripts", {
      params: { episode_id: episodeId },
    });
    return response.data;
  },

  createScript: async (data: CreateScriptInput): Promise<Script> => {
    const response = await apiClient.post<Script>("/scripts", data);
    return response.data;
  },

  updateScript: async (
    episodeId: string,
    data: UpdateScriptInput,
  ): Promise<Script> => {
    const response = await apiClient.patch<Script>(
      `/scripts/${episodeId}`,
      data,
    );
    return response.data;
  },

  analyzeScript: async (data: AnalyzeScriptInput): Promise<{ ok: boolean }> => {
    const response = await apiClient.post<{ ok: boolean }>(
      `/scripts/${data.episode_id}/analyze`,
      {},
    );
    return response.data;
  },

  deleteScript: async (episodeId: string): Promise<void> => {
    await apiClient.delete(`/scripts/${episodeId}`);
  },
};