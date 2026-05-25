/**
 * Media Processing
 * Image/video resizing, transcoding, and optimization pipeline preparation.
 */

export interface MediaProcessingJob {
  assetId: string;
  tenantId: string;
  operations: string[];
  status: "queued" | "processing" | "done";
}

export class MediaProcessing {
  private jobs: MediaProcessingJob[] = [];

  queue(assetId: string, tenantId: string, operations: string[]): MediaProcessingJob {
    const job: MediaProcessingJob = { assetId, tenantId, operations, status: "queued" };
    this.jobs.push(job);
    return job;
  }
}

export const mediaProcessing = new MediaProcessing();
