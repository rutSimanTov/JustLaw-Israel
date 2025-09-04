export interface Item {
    id: string;
    name: string;
    type: string;
    amount: number;
  }
  
  export interface CreateItemRequest {
    name: string;
    type: string;
    amount: number;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  // User and Profile related types

export enum UserRole {
  ADMIN = 'admin',
  CONTENT_CREATOR = 'content_creator',
  ACCELERATOR_STAFF = 'accelerator_staff',
  USER = 'user'
}

export interface User {
  id: string;
  email: string;
  googleId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  other?: string;
}

export enum ConnectionType {
  MENTORSHIP = 'mentorship',
  PARTNERSHIP = 'partnership',
  INVESTMENT = 'investment',
  COLLABORATION = 'collaboration',
  NETWORKING = 'networking',
  KNOWLEDGE_SHARING = 'knowledge_sharing'
}

export enum EngagementType {
  VIRTUAL_MEETINGS = 'virtual_meetings',
  IN_PERSON_MEETINGS = 'in_person_meetings',
  EMAIL_CORRESPONDENCE = 'email_correspondence',
  PROJECT_COLLABORATION = 'project_collaboration',
  ADVISORY_ROLE = 'advisory_role',
  SPEAKING_ENGAGEMENTS = 'speaking_engagements'
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  roleDescription: string;
  countryRegion: string;
  valueSentence: string;
  keywords: string[]; // 1-3 keywords
  currentChallenge: string;
  connectionTypes: ConnectionType[];
  engagementTypes: EngagementType[];
  contactInfo?: ContactInfo;
  projectLink?: string;
  otherConnectionText?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileSearchFilters {
  keyword?: string;
  countryRegion?: string;
  connectionTypes?: ConnectionType[];
  engagementTypes?: EngagementType[];
  keywords?: string[];
}

export interface ProfileSearchResult {
  profiles: Profile[];
  totalCount: number;
  page: number;
  pageSize: number;
}
  export type UserProfileResponse = ApiResponse<Profile>;
  
  export type ItemsResponse = ApiResponse<Item[]>;
  export type ItemResponse = ApiResponse<Item>;