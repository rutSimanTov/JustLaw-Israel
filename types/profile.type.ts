export interface ProfileSearchFilters {
  keyword?: string;
  country_region?: string;
  connection_types?: string[];
  engagement_types?: string[];
  keywords?: string[];
}

export interface ProfileSearchResult {
  profiles: UserProfile[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface UserProfile {
  id: string; // UUID
  user_id: string;
  full_name: string;
  role_description: string;
  country_region: string;
  value_sentence: string;
  keywords: string[];
  current_challenge: string;
  connection_types: string[]; 
  engagement_types: string[];
  contact_info?: any; 
  project_link?: string;
  other_connection_text?: string;
  is_visible: boolean;
  created_at: string; 
  updated_at: string;
}