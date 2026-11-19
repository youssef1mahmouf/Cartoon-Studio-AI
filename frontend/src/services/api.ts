import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = {
  // Projects
  projects: {
    list: () => api.get('/projects'),
    create: (data: { name: string }) => api.post('/projects', data),
    update: (id: string, data: { name: string }) => api.put(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
  },

  // Episodes
  episodes: {
    list: (projectId?: string) => api.get(`/episodes${projectId ? `?projectId=${projectId}` : ''}`),
    create: (data: { name: string; project_id: string }) => api.post('/episodes', data),
    get: (id: string) => api.get(`/episodes/${id}`),
  },

  // Scripts
  scripts: {
    analyze: (scriptId: string) => api.post(`/scripts/${scriptId}/analyze`),
  },

  // Voices
  voices: {
    generate: (data: { character: string; text: string; config?: any }) => api.post('/voice/generate', data),
    list: (character?: string) => api.get(`/voices${character ? `?character=${character}` : ''}`),
    delete: (id: string) => api.delete(`/voices/${id}`),
  },

  // Rendering
  render: {
    episode: (data: { episode_id: string; image_dir: string; audio_file: string; options?: any }) => api.post('/render/episode', data),
    status: (renderId: string) => api.get(`/render/status/${renderId}`),
    result: (renderId: string) => api.get(`/render/result/${renderId}`),
    cancel: (renderId: string) => api.post(`/render/cancel/${renderId}`),
  },

  // Pipeline
  pipeline: {
    status: (jobId: string) => api.get(`/pipeline/status/${jobId}`),
    result: (jobId: string) => api.get(`/pipeline/result/${jobId}`),
  },

  // Settings
  settings: {
    get: () => api.get('/settings'),
    update: (data: { openrouter_key?: string; huggingface_key?: string; selected_provider?: string }) => api.put('/settings', data),
  },
};

export default api;