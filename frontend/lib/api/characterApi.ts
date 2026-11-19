// Cartoon Studio AI — API service: Character
// Relation: Character belongs to one Project (project_id) and owns Voices
// (character_id). Characters can appear in many episodes.

import { apiClient } from "./client";
import type {
  Character,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "@/types/Character";

export const characterApi = {
  getCharacters: async (projectId?: string): Promise<Character[]> => {
    const response = await apiClient.get<Character[]>("/characters", {
      params: projectId ? { project_id: projectId } : undefined,
    });
    return response.data;
  },

  getCharacter: async (id: string): Promise<Character> => {
    const response = await apiClient.get<Character>(`/characters/${id}`);
    return response.data;
  },

  createCharacter: async (data: CreateCharacterInput): Promise<Character> => {
    const response = await apiClient.post<Character>("/characters", data);
    return response.data;
  },

  updateCharacter: async (
    id: string,
    data: UpdateCharacterInput,
  ): Promise<Character> => {
    const response = await apiClient.patch<Character>(`/characters/${id}`, data);
    return response.data;
  },

  deleteCharacter: async (id: string): Promise<void> => {
    await apiClient.delete(`/characters/${id}`);
  },
};