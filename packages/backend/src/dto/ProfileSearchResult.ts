import { Profile } from './UserProfile.class';

export class ProfileSearchResult {
  constructor(
    public profiles: Profile[],
    public total_count: number,
    public page: number,
    public page_size: number
  ) {}
}
