// Cartoon Studio AI — API service: Voice
// Relation: Voice belongs to one Character (character_id). Voices are
// generated from character prompts and consumed by the episode render job.

import { apiClient } from "./client";
import type { Voice, CreateVoiceInput, UpdateVoiceInput } from "@/types/Voice";

export const voiceApi = {
  getVoices: async (characterId?: string): Promise<Voice[]> => {
    const response = await apiClient.get<Voice[]>("/voices", {
      params: characterId ? { character_id: characterId } : undefined,
    });
    return response.data;
  },

  getVoice: async (id: string): Promise<Voice> => {
    const response = await apiClient.get<Voice>(`/voices/${id}`);
    return response.data;
  },

  createVoice: async (data: CreateVoiceInput): Promise<Voice> => {
    const response = await apiClient.post<Voice>("/voices", data);
    return response.data;
  },

  updateVoice: async (id: string, data: UpdateVoiceInput): Promise<Voice> => {
    const response = await apiClient.patch<Voice>(`/voices/${id}`, data);
    return response.data;
  },

  deleteVoice: async (id: string): Promise<void> => {
    await apiClient.delete(`/voices/${id}`);
  },
};