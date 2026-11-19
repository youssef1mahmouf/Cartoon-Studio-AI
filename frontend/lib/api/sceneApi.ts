// Cartoon Studio AI — API service: Scene
// Relation: Scene belongs to one Episode (episode_id). Scenes are extracted
// from the episode script and reference generated background images.

import { apiClient } from "./client";
import type { Scene, CreateSceneInput, UpdateSceneInput } from "@/types/Scene";

export const sceneApi = {
  getScenes: async (): Promise<Scene[]> => {
    const response = await apiClient.get<Scene[]>("/scenes");
    return response.data;
  },

  getScene: async (id: string): Promise<Scene> => {
    const response = await apiClient.get<Scene>(`/scenes/${id}`);
    return response.data;
  },

  createScene: async (data: CreateSceneInput): Promise<Scene> => {
    const response = await apiClient.post<Scene>("/scenes", data);
    return response.data;
  },

  updateScene: async (id: string, data: UpdateSceneInput): Promise<Scene> => {
    const response = await apiClient.patch<Scene>(`/scenes/${id}`, data);
    return response.data;
  },

  deleteScene: async (id: string): Promise<void> => {
    await apiClient.delete(`/scenes/${id}`);
  },
};