export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
  meta: {
    page: number
    limit: number
    total: number
  }
}

export interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Episode {
  id: string
  project_id: string
  title: string
  script: string
  status: "pending" | "analyzing" | "scenes_extracted" | "characters_extracted" | "prompts_generated" | "images_generated" | "voices_generated" | "rendering" | "completed" | "error"
  created_at: string
  updated_at: string
}

export interface Scene {
  id: string
  episode_id: string
  scene_number: number
  description: string
  image_path: string | null
  created_at: string
}

export interface Character {
  id: string
  name: string
  project_id: string
  prompt: string
  image_path: string | null
  created_at: string
}

export interface Background {
  id: string
  project_id: string
  prompt: string
  image_path: string | null
  created_at: string
}

export interface Voice {
  id: string
  character_id: string
  voice_provider: "kokoro" | "piper"
  audio_path: string
  created_at: string
}

export interface Asset {
  id: string
  type: "character" | "background" | "voice" | "effect" | "music"
  path: string
  created_at: string
}

export interface Render {
  id: string
  episode_id: string
  path: string
  status: "pending" | "rendering" | "completed" | "error"
  created_at: string
  updated_at: string
}

export type ProviderName = "openrouter" | "pollinations" | "huggingface" | "kokoro" | "piper"

export type ModelName =
  | "deepseek-v3"
  | "deepseek-r1"
  | "qwen"
  | "llama"
  | "gemma"
  | "flux"
  | "sdxl"

export interface ProviderConfig {
  name: ProviderName
  apiKey: string
  baseUrl: string
  models: ModelName[]
}