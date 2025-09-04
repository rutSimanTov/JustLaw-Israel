export declare enum ContentCategory {
    RESEARCH_PAPERS = "research_papers",
    INDUSTRY_NEWS = "industry_news",
    CASE_STUDIES = "case_studies",
    TOOLKITS_GUIDES = "toolkits_guides",
    WEBINARS = "webinars"
}
export declare enum ContentStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum ContentType {
    ARTICLE = "article",
    LINK = "link",
    DOCUMENT = "document",
    VIDEO = "video",
    WEBINAR = "webinar"
}
export interface ContentItem {
    id: string;
    title: string;
    description: string;
    content?: string;
    categoryid?: number;
    typeid?: number;
    statusid?: number;
    authorid: string;
    publishedat?: Date;
    externalurl?: string;
    downloadurl?: string;
    attachmenturls?: string[];
    thumbnailurl?: string;
    tags: string[];
    metadata: ContentMetadata;
    createdat?: Date;
    updatedat?: Date;
}
export interface ContentMetadata {
    contentid: string;
    readtime?: number;
    filesize?: number;
    filetype?: string;
    videolength?: number;
    webinardate?: Date;
    source?: string;
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
        categories: {
            [key in ContentCategory]: number;
        };
        types: {
            [key in ContentType]: number;
        };
        tags: {
            [tag: string]: number;
        };
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
//# sourceMappingURL=content.type.d.ts.map