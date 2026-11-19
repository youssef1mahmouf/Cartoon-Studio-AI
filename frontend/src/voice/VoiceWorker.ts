import { Injectable, Logger } from '@nestjs/common';
import VoiceGenerationService from './VoiceGenerationService';
import VoiceProviderFactory from './VoiceProviderFactory';

@Injectable()
export class VoiceWorker {
  private readonly logger = new Logger(VoiceWorker.name);
  private readonly service: VoiceGenerationService;
  private readonly factory: VoiceProviderFactory;

  constructor() {
    this.factory = new VoiceProviderFactory();
    this.service = this.factory.createService();
  }

  async processGeneration(request: {
    text: string;
    character_name: string;
    episode_name: string;
    config?: { speed?: number; pitch?: number; provider?: 'kokoro' | 'piper' };
  }): Promise<{
    voice_id: string;
    audio_path: string;
    duration: number;
    provider: 'kokoro' | 'piper';
    model: string;
  }> {
    this.logger.log(`Processing voice generation for: ${request.character_name}`);

    try {
      const result = await this.service.generate({
        text: request.text,
        character_name: request.character_name,
        episode_name: request.episode_name,
        config: request.config,
      });

      this.logger.log(`Voice generation completed: ${result.voice_id}`);

      return {
        voice_id: result.voice_id,
        audio_path: result.audio_path,
        duration: result.duration,
        provider: result.provider,
        model: result.model,
      };
    } catch (error: any) {
      this.logger.error(`Voice generation failed: ${error.message}`);
      throw new Error(`Voice generation failed: ${error.message}`);
    }
  }

  async processBatch(generationRequests: Array<{
    text: string;
    character_name: string;
    episode_name: string;
    config?: { speed?: number; pitch?: number; provider?: 'kokoro' | 'piper' };
  }>): Promise<Array<{
    voice_id: string;
    audio_path: string;
    duration: number;
    provider: 'kokoro' | 'piper';
    model: string;
  }>> {
    this.logger.log(`Processing batch voice generation: ${generationRequests.length} requests`);

    const results: Array<{
      voice_id: string;
      audio_path: string;
      duration: number;
      provider: 'kokoro' | 'piper';
      model: string;
    }> = [];

    for (const request of generationRequests) {
      try {
        const result = await this.processGeneration(request);
        results.push(result);
      } catch (error: any) {
        this.logger.error(`Failed to process request for ${request.character_name}: ${error.message}`);
        // Push error result
        results.push({
          voice_id: '',
          audio_path: '',
          duration: 0,
          provider: 'kokoro',
          model: 'error',
          // Note: The interface doesn't have an error field, so we'll just push what we can
        });
      }
    }

    this.logger.log(`Batch generation completed: ${results.length} results`);

    return results;
  }
}