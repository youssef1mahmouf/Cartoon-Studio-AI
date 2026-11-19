import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const fs = await import('fs');
const pathMod = await import('path');
const { v4: uuidv4 } = await import('uuid');

@Injectable()
export class VoiceGenerationService {
  private readonly logger = new Logger(VoiceGenerationService.name);
  private readonly voicesDir: string;
  private readonly metadataDir: string;

  constructor(private readonly configService: ConfigService) {
    const baseDir = this.configService.get<string>('voice.baseDir') || 'assets/voices';
    this.voicesDir = baseDir;
    this.metadataDir = pathMod.path.join(baseDir, '.metadata');

    // Ensure directories exist
    if (!fs.default.existsSync(this.voicesDir)) {
      fs.default.mkdirSync(this.voicesDir, { recursive: true });
    }
    if (!fs.default.existsSync(this.metadataDir)) {
      fs.default.mkdirSync(this.metadataDir, { recursive: true });
    }
export interface VoiceMetadata {
  voice_id: string;
  provider: 'kokoro' | 'piper';
  model: string;
  character_name: string;
  script_id: string;
  created_at: string;
  audio_path: string;
}

export interface VoiceGenerationConfig {
  speed?: number;
  pitch?: number;
  voice_profile?: string;
  provider?: 'kokoro' | 'piper';
}

export interface GenerationRequest {
  text: string;
  character_name: string;
  episode_name: string;
  config?: VoiceGenerationConfig;
}

export interface GenerationResponse {
  voice_id: string;
  audio_path: string;
  duration: number;
  provider: 'kokoro' | 'piper';
  model: string;
}
  }