import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);
  private readonly projectsDir: string;
  private readonly assetsDir: string;
  private readonly rendersDir: string;
  private readonly exportsDir: string;

  constructor() {
    this.projectsDir = 'projects';
    this.assetsDir = 'assets';
    this.rendersDir = 'renders';
    this.exportsDir = 'exports';

    [this.projectsDir, this.assetsDir, this.rendersDir, this.exportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
}