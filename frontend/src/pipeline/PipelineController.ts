import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { PipelineService } from './PipelineService';

@Injectable()
export class PipelineController {
  private readonly pipelineService: PipelineService;

  constructor() {
    this.pipelineService = new PipelineService();
  }

  @Post('run')
  async runPipeline(
    @Body() body: { script: { title: string; characters: Array<{ name: string; lines: string[] }>; scenes: Array<{ scene_number: number; description: string; characters: string[]; background?: string }> } }
  ): Promise<{ job_id: string; state: { state: string }; status: { status: string; progress: number } }> {
    // In a full implementation, we'd extract the script properly
    const jobId = `episode-${Date.now()}`;
    
    return {
      job_id: jobId,
      state: { state: 'Processing' },
      status: { status: 'ScriptReceived', progress: 0 },
    };
  }

  @Post('run/:episode_id')
  async runPipelineById(
    @Param('episode_id') episodeId: string,
    @Body() body?: any
  ): Promise<{ job_id: string; state: { state: string }; status: { status: string; progress: number } }> {
    return {
      job_id: episodeId,
      state: { state: 'Processing' },
      status: { status: 'ScriptReceived', progress: 0 },
    };
  }

  @Get('status/:job_id')
  async getPipelineStatus(@Param('job_id') jobId: string): Promise<{ state: { state: string }; status: { status: string; progress: number; error?: string } }> {
    // In production, fetch from database
    return {
      state: { state: 'Processing' },
      status: { status: 'Processing', progress: 50 },
    };
  }

  @Get('result/:job_id')
  async getPipelineResult(@Param('job_id') jobId: string): Promise<{ success: boolean; output_path?: string; error?: string }> {
    // In production, fetch render result from database
    return {
      success: false,
      error: 'Result not yet available',
    };
  }

  @Post('cancel/:job_id')
  async cancelPipeline(@Param('job_id') jobId: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Pipeline ${jobId} cancelled` };
  }
}