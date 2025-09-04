import { ContentCategory, ContentItem, ContentType } from "./ContentItem";

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