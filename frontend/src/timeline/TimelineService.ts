import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

const { v4: uuidv4 } = await import('uuid');

export interface TimelineEvent {
  event_id: string;
  scene_id: string;
  event_type: 'scene_start' | 'scene_end' | 'voice_start' | 'voice_end' | 'music_start' | 'music_end';
  timestamp: number; // in seconds
  metadata: Record<string, any>;
}

export interface EpisodeTimeline {
  episode_id: string;
  timeline: TimelineEvent[];
  total_duration: number;
  created_at: string;
}

@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);
  private readonly exportsDir: string;

  constructor() {
    this.exportsDir = 'exports';
    if (!fs.existsSync(this.exportsDir)) {
      fs.mkdirSync(this.exportsDir, { recursive: true });
    }
  }

  /**
   * Generate timeline metadata for an episode
   */
  generateTimeline(episodeId: string, scenes: Array<{ scene_id: string; duration: number }>): EpisodeTimeline {
    const timeline: TimelineEvent[] = [];
    let currentTime = 0;
    const now = new Date().toISOString();

    scenes.forEach((scene, index) => {
      // Scene start event
      timeline.push({
        event_id: uuidv4(),
        scene_id: scene.scene_id,
        event_type: 'scene_start',
        timestamp: currentTime,
        metadata: { scene_number: index + 1 },
      });

      // Scene end event
      timeline.push({
        event_id: uuidv4(),
        scene_id: scene.scene_id,
        event_type: 'scene_end',
        timestamp: currentTime + scene.duration,
        metadata: { scene_number: index + 1, duration: scene.duration },
      });

      currentTime += scene.duration;
    });

    const episodeTimeline: EpisodeTimeline = {
      episode_id: episodeId,
      timeline,
      total_duration: currentTime,
      created_at: now,
    };

    // Save timeline to file
    const timelinePath = path.join(this.exportsDir, 'timelines', `${episodeId}.json`);
    const timelineDir = path.dirname(timelinePath);
    if (!fs.existsSync(timelineDir)) {
      fs.mkdirSync(timelineDir, { recursive: true });
    }
    fs.writeFileSync(timelinePath, JSON.stringify(episodeTimeline, null, 2));

    this.logger.log(`Timeline generated for episode ${episodeId} with ${timeline.length} events, total duration: ${currentTime}s`);

    return episodeTimeline;
  }

  /**
   * Get timeline by episode ID
   */
  getTimeline(episodeId: string): EpisodeTimeline | null {
    const timelinePath = path.join(this.exportsDir, 'timelines', `${episodeId}.json`);
    try {
      if (fs.existsSync(timelinePath)) {
        return JSON.parse(fs.readFileSync(timelinePath, 'utf-8'));
      }
      return null;
    } catch (error: any) {
      this.logger.error(`Failed to read timeline for episode ${episodeId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Add a timeline event
   */
  addEvent(episodeId: string, event: Omit<TimelineEvent, 'event_id' | 'timestamp'>): TimelineEvent {
    const timeline = this.getTimeline(episodeId);
    const eventId = uuidv4();
    const nowTimestamp = Date.now();

    const completeEvent: TimelineEvent = {
      event_id: eventId,
      ...event,
      timestamp: nowTimestamp,
    };

    // If timeline doesn't exist, create it
    if (!timeline) {
      const initialTimeline: EpisodeTimeline = {
        episode_id: episodeId,
        timeline: [completeEvent],
        total_duration: event.timestamp || 0,
        created_at: new Date().toISOString(),
      };
      this.saveTimeline(initialTimeline);
      return completeEvent;
    }

    // Add event to existing timeline
    timeline.timeline.push(completeEvent);
    // Recalculate total duration
    const maxTimestamp = Math.max(
      ...timeline.timeline.map(t => t.timestamp),
      ...(timeline.timeline.filter(t => t.event_type === 'scene_end').map(t => t.timestamp))
    );
    timeline.total_duration = maxTimestamp || 0;
    this.saveTimeline(timeline);

    return completeEvent;
  }

  private saveTimeline(timeline: EpisodeTimeline): void {
    const timelinePath = path.join(this.exportsDir, 'timelines', `${timeline.episode_id}.json`);
    fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2));
  }
}