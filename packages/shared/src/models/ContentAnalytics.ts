export interface ContentAnalytics {
  contentid: string;
  views: number;
  downloads: number;
  shares: number;
  lastViewedat?: Date;
  popularityscore: number;
  createdat: Date;
  updatedat?: Date;
}