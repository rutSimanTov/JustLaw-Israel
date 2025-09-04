export enum ContentCategory {
  RESEARCH_PAPERS = 'research_papers',
  INDUSTRY_NEWS = 'industry_news',
  CASE_STUDIES = 'case_studies',
  TOOLKITS_GUIDES = 'toolkits_guides',
  WEBINARS = 'webinars'
}
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}
export enum ContentType {
  ARTICLE = 'article',
  LINK = 'link',
  DOCUMENT = 'document',
  VIDEO = 'video',
  WEBINAR = 'webinar'
}
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content?: string; // Rich text content for articles
  categoryid?: number;
  typeid?: number;
  statusid?: number;
  authorid: string;
  publishedat?: Date;
  externalurl?: string; // For links and external resources
  downloadurl?: string; // For downloadable documents
  attachmenturls?: string[]; // Support for multiple file attachments (PDFs, docs, etc.)
  thumbnailurl?: string;
  tags: string[];
  metadata: ContentMetadata;
  createdat?: Date;
  updatedat?: Date;
}
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
export interface ContentSearchFilters {
  query?: string;
  category?: ContentCategory;
  type?: ContentType;
  tags?: string[];
  publishedAfter?: Date;
  publishedBefore?: Date;
  authorId?: string;
}
export interface ContentSearchResult {
  items: ContentItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  facets: {
    categories: { [key in ContentCategory]: number };
    types: { [key in ContentType]: number };
    tags: { [tag: string]: number };
  };
}
export interface ContentAnalytics {
  contentid: string;
  views: number;
  downloads: number;
  shares: number;
  lastViewedat?: Date;
  popularityscore: number;
  createdat?: Date;
  updatedat?: Date;
}



