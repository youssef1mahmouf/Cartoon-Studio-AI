import { Controller, Post, Get, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { VoiceGenerationService } from './voice/VoiceGenerationService';
import { VoiceRepository } from './voice/VoiceRepository';
import { VoiceMetadata } from './voice/voice-types';
import { GenerationRequest, GenerationResponse } from './voice/voice-types';

@Controller('api/v1/voice')
export class VoiceController {
  private readonly service: VoiceGenerationService;
  private readonly repository: VoiceRepository;

  constructor() {
    this.service = new VoiceGenerationService();
    this.repository = new VoiceRepository();
  }

  @Post('generate')
  async generate(@Body() body: { text: string; character_name: string; episode_name: string; config?: any; script_id?: string }): Promise<GenerationResponse> {
    const request: any = {
      text: body.text,
      character_name: body.character_name,
      episode_name: body.episode_name,
      config: body.config,
      script_id: body.script_id,
    };

    return this.service.generate(request);
  }

  @Post('generate-batch')
  async generateBatch(@Body() body: { requests: Array<{ text: string; character_name: string; episode_name: string; config?: any; script_id?: string }> }): Promise<GenerationResponse[]> {
    const results: GenerationResponse[] = [];
    for (const request of body.requests) {
      const result = await this.service.generate({
        text: request.text,
        character_name: request.character_name,
        episode_name: request.episode_name,
        config: request.config,
        script_id: request.script_id,
      });
      results.push(result);
    }
    return results;
  }

  @Get(':voice_id')
  async getVoice(@Param('voice_id') voice_id: string): Promise<{ metadata: VoiceMetadata; audio_url: string }> {
    const metadata = this.repository.getMetadata(voice_id);
    if (!metadata) {
      throw new BadRequestException(`Voice with ID ${voice_id} not found`);
    }

    const audioPath = metadata.audio_path;
    const audioUrl = `/api/v1/voice/audio/${voice_id}`;

    return {
      metadata,
      audio_url: audioUrl,
    };
  }

  @Delete(':voice_id')
  async deleteVoice(@Param('voice_id') voice_id: string): Promise<{ success: boolean; message: string }> {
    const success = this.repository.deleteVoice(voice_id);

    if (success) {
      return {
        success: true,
        message: `Voice ${voice_id} deleted successfully`,
      };
    } else {
      return {
        success: false,
        message: `Voice ${voice_id} not found`,
      };
    }
  }
}