// Cartoon Studio AI — Shared Zustand Stores (barrel)
// Integration diagram (code comment):
//
// ProjectStore  ──►  EpisodeStore  ──►  ScriptStore
//      │              ├────────────►  SceneStore
//      │              ├────────────►  CharacterStore ─────► VoiceStore
//      │              ├────────────►  BackgroundStore
//      │              └────────────►  RenderStore ───────► PipelineStore
//
// Every store owns the real domain relationship of its entity (foreign-key
// navigation via project_id / episode_id / character_id) and talks to its
// matching service in @/lib/api. No hardcoded state — all data flows from the
// API through the stores to the UI.

export { useProjectStore } from "./projectStore";
export { useEpisodeStore } from "./episodeStore";
export { useScriptStore } from "./scriptStore";
export { useSceneStore } from "./sceneStore";
export { useCharacterStore } from "./characterStore";
export { useBackgroundStore } from "./backgroundStore";
export { useVoiceStore } from "./voiceStore";
export { useRenderStore } from "./renderStore";
export { usePipelineStore } from "./pipelineStore";