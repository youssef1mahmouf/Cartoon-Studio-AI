import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class VoiceRepository {
  private readonly logger = new Logger(VoiceRepository.name);
  private readonly voicesDir: string;
  private readonly metadataDir: string;

  constructor() {
    const baseDir = 'assets/voices';
    this.voicesDir = baseDir;
    this.metadataDir = path.join(baseDir, '.metadata');

    if (!fs.existsSync(this.voicesDir)) {
      fs.mkdirSync(this.voicesDir, { recursive: true });
    }
    if (!fs.existsSync(this.metadataDir)) {
      fs.mkdirSync(this.metadataDir, { recursive: true });
    }
  }

  saveMetadata(metadata: {
    voice_id: string;
    provider: 'kokoro' | 'piper';
    model: string;
    character_name: string;
    script_id: string;
    created_at: string;
    audio_path: string;
  }): void {
    const metadataPath = path.join(this.metadataDir, `${metadata.voice_id}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  }

  getMetadata(voiceId: string): {
    voice_id: string;
    provider: 'kokoro' | 'piper';
    model: string;
    character_name: string;
    script_id: string;
    created_at: string;
    audio_path: string;
  } | null {
    const metadataPath = path.join(this.metadataDir, `${voiceId}.json`);
    try {
      if (fs.existsSync(metadataPath)) {
        return JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      }
      return null;
    } catch (error: any) {
      this.logger.error(`Failed to read metadata for ${voiceId}: ${error.message}`);
      return null;
    }
  }

  deleteVoice(voiceId: string): boolean {
    const metadata = this.getMetadata(voiceId);
    if (!metadata) {
      return false;
    }

    try {
      if (fs.existsSync(metadata.audio_path)) {
        fs.unlinkSync(metadata.audio_path);
      }
    } catch (error: any) {
      this.logger.warn(`Failed to delete audio file: ${error.message}`);
    }

    const metadataPath = path.join(this.metadataDir, `${voiceId}.json`);
    try {
      if (fs.existsSync(metadataPath)) {
        fs.unlinkSync(metadataPath);
      }
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to delete metadata: ${error.message}`);
      return false;
    }
  }

  listVoices(characterName: string): Array<{
    voice_id: string;
    character_name: string;
    audio_path: string;
    created_at: string;
  }> {
    const results: Array<{
      voice_id: string;
      character_name: string;
      audio_path: string;
      created_at: string;
    }> = [];
    const charDir = path.join(this.voicesDir, characterName);

    try {
      if (fs.existsSync(charDir)) {
        const episodes = fs.readdirSync(charDir, { withFileTypes: true });
        for (const episode of episodes) {
          if (episode.isDirectory()) {
            const episodePath = path.join(charDir, episode.name);
            const files = fs.readdirSync(episodePath);
            for (const file of files) {
              const metadataPath = path.join(this.metadataDir, `${file}.json`);
              if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
                if (metadata.character_name === characterName) {
                  results.push({
                    voice_id: metadata.voice_id,
                    character_name: metadata.character_name,
                    audio_path: metadata.audio_path,
                    created_at: metadata.created_at,
                  });
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`Failed to list voices for ${characterName}: ${error.message}`);
    }

    return results;
  }
}