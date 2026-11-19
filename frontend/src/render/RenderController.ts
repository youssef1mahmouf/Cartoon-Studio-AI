import { Controller, Post, Get, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { FFmpegService } from './ffmpeg/FFmpegService';
import { SceneBuilderService } from './scene-builder/SceneBuilderService';
import { TimelineService } from './timeline/TimelineService';
import { RenderMetadata } from './ffmpeg/FFmpegService';
import { Scene } from './scene-builder/SceneBuilderService';

@Controller('api/v1/render')
export class RenderController {
  private readonly ffmpegService: FFmpegService;
  private readonly sceneBuilderService: SceneBuilderService;
  private readonly timelineService: TimelineService;

  constructor() {
    this.ffmpegService = new FFmpegService();
    this.sceneBuilderService = new SceneBuilderService();
    this.timelineService = new TimelineService();
  }

  @Post('episode')
  async renderEpisode(
    @Body() body: {
      episodeId: string;
      imageDirectory: string;
      audioFile: string;
      options?: { fps?: number; resolution?: string; videoCodec?: string; audioCodec?: string };
    }
  ): Promise<{ metadata: RenderMetadata; output_path: string }> {
    const { episodeId, imageDirectory, audioFile, options } = body;
    const renderOpts = options || {};

    this.logger.log(`Starting episode render for episode ${episodeId}`);

    const metadata = await this.ffmpegService.renderEpisode(
      episodeId,
      imageDirectory,
      audioFile,
      renderOpts,
    );

    return {
      metadata,
      output_path: metadata.output_path,
    };
  }

  @Post('scene')
  async renderScene(
    @Body() body: {
      sceneId: string;
      episodeId: string;
      imagePath: string;
      audioPath: string;
      options?: RenderOptions;
    }
  ): Promise<{ metadata: RenderMetadata; output_path: string }> {
    const { sceneId, episodeId, imagePath, audioPath, options } = body;

    const metadata = await this.ffmpegService.renderEpisode(
      episodeId,
      imagePath,
      audioPath,
      options,
    );

    return {
      metadata,
      output_path: metadata.output_path,
    };
  }

  @Get(':renderId')
  async getRender(@Param('renderId') renderId: string): Promise<RenderMetadata> {
    const metadata = this.ffmpegService.getRenderMetadata(renderId);
    if (!metadata) {
      throw new BadRequestException(`Render with ID ${renderId} not found`);
    }
    return metadata;
  }

  @Get('status/:renderId')
  async getRenderStatus(@Param('renderId') renderId: string): Promise<{ renderId: string; status: string; output_path?: string }> {
    const metadata = this.ffmpegService.getRenderMetadata(renderId);
    if (!metadata) {
      return { renderId, status: 'not_found' };
    }
    return { renderId, status: metadata.status, output_path: metadata.output_path };
  }

  @Delete(':renderId')
  async deleteRender(@Param('renderId') renderId: string): Promise<{ success: boolean; message: string }> {
    const metadata = this.ffmpegService.getRenderMetadata(renderId);
    if (!metadata) {
      return { success: false, message: `Render ${renderId} not found` };
    }

    try {
      if (fs.existsSync(metadata.output_path)) {
        fs.unlinkSync(metadata.output_path);
      }
      // Also delete metadata file
      const metadataPath = metadata.output_path.replace(/\.mp4$/, '.json');
      if (fs.existsSync(metadataPath)) {
        fs.unlinkSync(metadataPath);
      }
      return { success: true, message: `Render ${renderId} deleted successfully` };
    } catch (error: any) {
      return { success: false, message: `Failed to delete render: ${error.message}` };
    }
  }
}