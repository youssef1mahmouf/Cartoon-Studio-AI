import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import path from 'path';

const { v4: uuidv4 } = await import('uuid');

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