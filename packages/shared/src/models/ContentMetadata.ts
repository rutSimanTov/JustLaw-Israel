export interface ContentMetadata {
  contentid:string;
  readtime?: number; // Estimated read time in minutes
  filesize?: number; // For downloadable content
  filetype?: string; // PDF, DOCX, etc.
  videolength?: number; // For video content in seconds
  webinardate?: Date; // For webinar content
  source?: string; // Original source if aggregated content
  language: string;
}
