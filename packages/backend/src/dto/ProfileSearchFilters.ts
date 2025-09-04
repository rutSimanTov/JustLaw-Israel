export class ProfileSearchFilters {
  constructor(
    public keyword?: string,
    public country_region?: string,
    public connection_types?: string[],
    public engagement_types?: string[],
    public keywords?: string[]
  ) {}
}
