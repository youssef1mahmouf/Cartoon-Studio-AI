// Cartoon Studio AI — API service: Pipeline
// Relation: Pipeline Job belongs to one Episode (episode_id) and tracks the
// full run: Script → Scenes → Characters → Backgrounds → Voices → Render.

import { apiClient } from "./client";
import type {
  PipelineJob,
  CreatePipelineJobInput,
  UpdatePipelineJobInput,
} from "@/types/Pipeline";

export const pipelineApi = {
  getJobs: async (episodeId?: string): Promise<PipelineJob[]> => {
    const response = await apiClient.get<PipelineJob[]>("/pipeline/jobs", {
      params: episodeId ? { episode_id: episodeId } : undefined,
    });
    return response.data;
  },

  getJob: async (id: string): Promise<PipelineJob> => {
    const response = await apiClient.get<PipelineJob>(`/pipeline/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: CreatePipelineJobInput): Promise<PipelineJob> => {
    const response = await apiClient.post<PipelineJob>("/pipeline/jobs", data);
    return response.data;
  },

  updateJob: async (
    id: string,
    data: UpdatePipelineJobInput,
  ): Promise<PipelineJob> => {
    const response = await apiClient.patch<PipelineJob>(
      `/pipeline/jobs/${id}`,
      data,
    );
    return response.data;
  },

  getStatus: async (jobId: string): Promise<PipelineJob> => {
    const response = await apiClient.get<PipelineJob>(
      `/pipeline/status/${jobId}`,
    );
    return response.data;
  },

  cancelJob: async (jobId: string): Promise<void> => {
    await apiClient.post(`/pipeline/cancel/${jobId}`);
  },
};