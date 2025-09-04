import { ContentCategory, ContentType } from "./ContentItem";

export interface ContentSearchFilters {
  query?: string;
  category?: ContentCategory;
  type?: ContentType;
  tags?: string[];
  publishedAfter?: Date;
  publishedBefore?: Date;
  authorId?: string;
}