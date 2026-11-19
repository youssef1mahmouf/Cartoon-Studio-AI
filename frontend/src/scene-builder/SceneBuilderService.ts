import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import VoiceGenerationService from './voice/VoiceGenerationService';
import VoiceRepository from './voice/VoiceRepository';

const { v4: uuidv4 } = await import('uuid');

export interface SceneMetadata {
  scene_id: string;
  episode_id: string;
  scene_number: number;
  title: string;
  description: string;
  created_at: string;
}

export interface SceneLayer {
  type: 'background' | 'character' | 'voice' | 'music' | 'effects';
  name: string;
  asset_path: string;
  z_index: number;
}

export interface Scene {
  scene_id: string;
  episode_id: string;
  scene_number: number;
  title: string;
  layers: SceneLayer[];
  voice_ids: string[];
  duration: number;
  created_at: string;
}

@Injectable()
export class SceneBuilderService {
  private readonly logger = new Logger(SceneBuilderService.name);
  private readonly exportsDir: string;

  constructor() {
    this.exportsDir = 'exports';
    if (!fs.existsSync(this.exportsDir)) {
      fs.mkdirSync(this.exportsDir, { recursive: true });
    }
  }

  /**
   * Build a scene from components
   */
  buildScene(episodeId: string, sceneNumber: number, options: {
    title: string;
    backgroundAsset?: string;
    characterAssets?: Array<{ characterName: string; voiceId: string }>;
    musicAsset?: string;
    sfxAssets?: Array<string>;
    duration?: number;
  }): Scene {
    const sceneId = uuidv4();
    const now = new Date().toISOString();

    this.logger.log(`Building scene ${sceneNumber} for episode ${episodeId}`);

    // Create scene directory structure
    const sceneDir = path.join(this.exportsDir, 'scenes', episodeId, sceneId);
    if (!fs.existsSync(sceneDir)) {
      fs.mkdirSync(sceneDir, { recursive: true });
    }

    // Build layers
    const layers: SceneLayer[] = [];

    // Background layer
    if (options.backgroundAsset && fs.existsSync(options.backgroundAsset)) {
      layers.push({
        type: 'background',
        name: 'Background',
        asset_path: options.backgroundAsset,
        z_index: 0,
      });
    }

    // Character layers
    if (options.characterAssets) {
      options.characterAssets.forEach((charAsset, index) => {
        if (fs.existsSync(charAsset.voiceId?.replace('.json', '') || charAsset.characterName)) {
          layers.push({
            type: 'character',
            name: `Character ${index + 1}`,
            asset_path: charAsset.characterName,
            z_index: index + 1,
          });
        }
      });
    }

    // Music layer
    if (options.musicAsset && fs.existsSync(options.musicAsset)) {
      layers.push({
        type: 'music',
        name: 'Music',
        asset_path: options.musicAsset,
        z_index: 100,
      });
    }

    // SFX layer
    if (options.sfxAssets) {
      options.sfxAssets.forEach((sfx, index) => {
        if (fs.existsSync(sfx)) {
          layers.push({
            type: 'effects',
            name: `SFX ${index + 1}`,
            asset_path: sfx,
            z_index: 200 + index,
          });
        }
      });
    }

    // Calculate duration
    const duration = options.duration || 30; // Default 30 seconds

    const scene: Scene = {
      scene_id: sceneId,
      episode_id: episodeId,
      scene_number: sceneNumber,
      title: options.title,
      layers,
      voice_ids: options.characterAssets?.map(c => c.voiceId) || [],
      duration,
      created_at: now,
    };

    this.logger.log(`Scene ${sceneId} built successfully with ${layers.length} layers`);

    return scene;
  }

  /**
   * Get scene by ID
   */
  getScene(episodeId: string, sceneId: string): Scene | null {
    const scenePath = path.join(this.exportsDir, 'scenes', episodeId, `${sceneId}.json`);
    try {
      if (fs.existsSync(scenePath)) {
        return JSON.parse(fs.readFileSync(scenePath, 'utf-8'));
      }
      return null;
    } catch (error: any) {
      this.logger.error(`Failed to read scene ${sceneId}: ${error.message}`);
      return null;
    }
  }

  /**
   * List scenes for an episode
   */
  listScenes(episodeId: string): Scene[] {
    const scenes: Scene[] = [];
    const scenesDir = path.join(this.exportsDir, 'scenes', episodeId);

    try {
      if (fs.existsSync(scenesDir)) {
        const sceneDirs = fs.readdirSync(scenesDir);
        for (const sceneDir of sceneDirs) {
          const scene = this.getScene(episodeId, sceneDir);
          if (scene) {
            scenes.push(scene);
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`Failed to list scenes for episode ${episodeId}: ${error.message}`);
    }

    return scenes.sort((a, b) => a.scene_number - b.scene_number);
  }
}