"use client";

import create from "zustand";
import type {
  Character,
  CreateCharacterInput,
  UpdateCharacterInput,
  CharacterStatus,
} from "@/types/Character";
import { characterApi } from "@/lib/api/characterApi";

// Relational integration diagram (code comment):
//
// Project ──┐
//           ├─ owns ─┬─ Episodes
//           │        ├─ owns ─┬─ Script
//           │        ├─ owns ─┬─ Scenes
//           │        ├─ owns ─┬─ Characters  (this store — child of Project)
//           │        │         └─ owns ─┬─ Voices (voiceStore)
//           │        ├─ owns ─┬─ Backgrounds
//           │        └─ owns ─┴─ Render Jobs ────────┴─► Pipeline Jobs
//
// Navigation: Open Project → Open Episode → Edit Script → Generate Assets → Generate Voices → Render Episode

interface CharacterState {
  characters: Character[];
  activeCharacter: Character | null;
  loading: boolean;
  error: string | null;
  fetchCharacters: (projectId?: string) => Promise<void>;
  createCharacter: (data: CreateCharacterInput) => Promise<void>;
  updateCharacter: (id: string, data: UpdateCharacterInput) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  setActiveCharacter: (character: Character | null) => void;
  clearError: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  activeCharacter: null,
  loading: false,
  error: null,

  fetchCharacters: async (projectId?: string) => {
    set({ loading: true, error: null });
    try {
      const characters = await characterApi.getCharacters(projectId);
      const filtered = projectId
        ? characters.filter((c) => c.project_id === projectId)
        : characters;
      set({ characters: filtered, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch characters", loading: false });
    }
  },

  createCharacter: async (data: CreateCharacterInput) => {
    set({ loading: true, error: null });
    try {
      const character = await characterApi.createCharacter(data);
      set((state) => ({
        characters: [...state.characters, character],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create character", loading: false });
      throw error;
    }
  },

  updateCharacter: async (id: string, data: UpdateCharacterInput) => {
    set({ loading: true, error: null });
    try {
      const character = await characterApi.updateCharacter(id, data);
      set((state) => ({
        characters: state.characters.map((c) => (c.id === id ? character : c)),
        activeCharacter:
          state.activeCharacter?.id === id ? character : state.activeCharacter,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update character", loading: false });
      throw error;
    }
  },

  deleteCharacter: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await characterApi.deleteCharacter(id);
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        activeCharacter:
          state.activeCharacter?.id === id ? null : state.activeCharacter,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete character", loading: false });
      throw error;
    }
  },

  setActiveCharacter: (character) => set({ activeCharacter: character }),

  clearError: () => set({ error: null }),
}));