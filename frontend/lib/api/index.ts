// Cartoon Studio AI — Shared API Services (barrel)
// Integration diagram (code comment):
//
// Project ─────► Episodes ─────► Script
//   │             ├────────────► Scenes
//   │             ├────────────► Characters ─────► Voices
//   │             ├────────────► Backgrounds
//   │             └────────────► Render Jobs ───► Pipeline Jobs
//
// One service module per domain entity, all sharing apiClient and the
// types from @/types.

export { apiClient, API_BASE_URL } from "./client";
export { projectApi } from "./projectApi";
export { episodeApi } from "./episodeApi";
export { scriptApi } from "./scriptApi";
export { characterApi } from "./characterApi";
export { backgroundApi } from "./backgroundApi";
export { voiceApi } from "./voiceApi";
export { sceneApi } from "./sceneApi";
export { renderApi } from "./renderApi";
export { pipelineApi } from "./pipelineApi";