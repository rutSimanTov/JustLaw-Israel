import { ContentMetadata } from "./ContentMetadata";

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
  createdat: Date;
  updatedat?: Date;
}