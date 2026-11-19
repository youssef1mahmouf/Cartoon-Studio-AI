import { Injectable, Logger } from '@nestjs/common';
import VoiceGenerationService from './VoiceGenerationService';

const Logger = console;

@Injectable()
export class VoiceProviderFactory {
  private readonly logger = new Logger(VoiceProviderFactory.name);

  createService(config?: { provider: 'kokoro' | 'piper';}): VoiceGenerationService {
    const service = new VoiceGenerationService();

    if (config?.provider === 'piper') {
      // Piper-specific configuration
      this.logger.log('Piper TTS provider selected');
    } else {
      // Default Kokoro configuration
      this.logger.log('Kokoro TTS provider selected');
    }

    return service;
  }

  getProviderName(provider: 'kokoro' | 'piper'): string {
    return provider === 'kokoro' ? 'Kokoro' : 'Piper';
  }
}