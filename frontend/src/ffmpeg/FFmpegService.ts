import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const { v4: uuidv4 } = await import('uuid');

export interface RenderOptions {
  fps?: number;
  resolution?: string;
  videoCodec?: string;
  audioCodec?: string;
}

export interface RenderMetadata {
  render_id: string;
  episode_id: string;
  duration: number;
  fps: number;
  resolution: string;
  output_path: string;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

const DEFAULT_RENDER_OPTS: RenderOptions = {
  fps: 30,
  resolution: '1920x1080',
  videoCodec: 'libx264',
  audioCodec: 'aac',
};

@Injectable()
export class FFmpegService {
  private readonly logger = new Logger(FFmpegService.name);
  private readonly rendersDir: string;

  constructor() {
    this.rendersDir = 'renders';
    if (!fs.existsSync(this.rendersDir)) {
      fs.mkdirSync(this.rendersDir, { recursive: true });
    }
  }

  generateRenderCommand(
    renderId: string,
    episodeId: string,
    imagePattern: string,
    audioFile: string,
    options: RenderOptions = {}
  ): string {
    const renderOpts = { ...DEFAULT_RENDER_OPTS, ...options };
    const outputPath = path.join(this.rendersDir, `${renderId}.mp4`);

    const filterComplex = this.buildFilterComplex(imagePattern, audioFile, renderOpts);

    const command = `
      ffmpeg
        -framerate ${renderOpts.fps}
        -i ${imagePattern}
        -i ${audioFile}
        ${filterComplex}
        -c:v ${renderOpts.videoCodec}
        -c:a ${renderOpts.audioCodec}
        -pix_fmt yuv420p
        -shortest
        -y
        ${outputPath}
    `.trim();

    return command;
  }

  private buildFilterComplex(
    imagePattern: string,
    audioFile: string,
    opts: RenderOptions
  ): string {
    return `-filter_complex "[0:v]setpts=PTS=${opts.fps}/TB[scaled]; [1:a]atempo=rate=1[audio]" -map "[scaled]" -map "[audio]"`;
  }

  async renderEpisode(
    episodeId: string,
    imageDirectory: string,
    audioFile: string,
    options: RenderOptions = {}
  ): Promise<RenderMetadata> {
    const renderId = uuidv4();
    const renderOpts = { ...DEFAULT_RENDER_OPTS, ...options };
    const outputPath = path.join(this.rendersDir, `${renderId}.mp4`);

    if (!fs.existsSync(imageDirectory)) {
      throw new Error(`Image directory not found: ${imageDirectory}`);
    }
    if (!fs.existsSync(audioFile)) {
      throw new Error(`Audio file not found: ${audioFile}`);
    }

    const imagePattern = path.join(imageDirectory, 'frame-%06d.png');
    const command = this.generateRenderCommand(renderId, episodeId, imagePattern, audioFile, renderOpts);

    this.logger.log(`Starting render ${renderId} for episode ${episodeId}`);

    return new Promise<RenderMetadata>((resolve, reject) => {
      exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
          this.logger.error(`FFmpeg render failed: ${stderr}`);
          const metadata: RenderMetadata = {
            render_id: renderId,
            episode_id: episodeId,
            duration: 0,
            fps: renderOpts.fps,
            resolution: renderOpts.resolution,
            output_path: '',
            status: 'failed',
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            error_message: stderr || err.message,
          };
          reject(metadata);
          return;
        }

        if (fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath);
          const metadata: RenderMetadata = {
            render_id: renderId,
            episode_id: episodeId,
            duration: Math.round(stats.size / 1024 / 1024 * 60),
            fps: renderOpts.fps,
            resolution: renderOpts.resolution,
            output_path: outputPath,
            status: 'completed',
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          };
          resolve(metadata);
        } else {
          const metadata: RenderMetadata = {
            render_id: renderId,
            episode_id: episodeId,
            duration: 0,
            fps: renderOpts.fps,
            resolution: renderOpts.resolution,
            output_path: '',
            status: 'failed',
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            error_message: 'Output file not generated',
          };
          reject(metadata);
        }
      });
    });
  }
getRenderMetadata(renderId: string): RenderMetadata | null {
    const rendersDir = this.rendersDir;
    try {
      const files = fs.readdirSync(rendersDir);
      for (const file of files) {
        const filePath = path.join(rendersDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && file.endsWith('.mp4')) {
          const metadataPath = filePath.replace(/\.mp4$/, '.json');
          if (fs.existsSync(metadataPath)) {
            try {
              const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
              if (metadata.render_id === renderId) {
                return metadata;
              }
            } catch {
              continue;
            }
          }
        }
      }
      return null;
    } catch (error: any) {
      this.logger.error(`Failed to search for render ${renderId}: ${error.message}`);
      return null;
    }
  }

  listRends(): Array<{ render_id: string; episode_id: string; status: string; output_path: string }> {
    const results: Array<{ render_id: string; episode_id: string; status: string; output_path: string }> = [];
    const rendersDir = this.rendersDir;

    try {
      const files = fs.readdirSync(rendersDir);
      for (const file of files) {
        const filePath = path.join(rendersDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && file.endsWith('.mp4')) {
          const renderId = file.replace('.mp4', '');
          results.push({
            render_id: renderId,
            episode_id: 'unknown',
            status: 'unknown',
            output_path: filePath,
          });
        }
      }
    } catch (error: any) {
      this.logger.error(`Failed to list renders: ${error.message}`);
    }

    return results;
  }
}