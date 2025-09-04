// API Request and Response types

import { 
  User, Profile, ProfileSearchFilters, ProfileSearchResult,
  AcceleratorApplication, ApplicationFormData, Cohort, CohortEvent, EventRegistration,
  ContentItem, ContentSearchFilters, ContentSearchResult,
  Partner, PastEvent, Donation,
  PaginationParams, PaginatedResponse, ApiResponse
} from './index';

// Authentication API Types
export interface LoginRequest {
  googleIdToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Profile API Types
export interface CreateProfileRequest {
  fullName: string;
  roleDescription: string;
  countryRegion: string;
  valueSentence: string;
  keywords: string[];
  currentChallenge: string;
  connectionTypes: string[];
  engagementTypes: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
    other?: string;
  };
  projectLink?: string;
  otherConnectionText?: string;
}

export interface UpdateProfileRequest extends Partial<CreateProfileRequest> {
  isVisible?: boolean;
}

export interface SearchProfilesRequest extends ProfileSearchFilters, PaginationParams {}

export interface ImportLinkedInRequest {
  linkedInAccessToken: string;
}

// Accelerator API Types
export interface CreateApplicationRequest {
  cohortId: string;
  applicationData: ApplicationFormData;
}

export interface UpdateApplicationRequest {
  applicationData?: Partial<ApplicationFormData>;
  status?: string;
  interviewNotes?: string;
  rejectionReason?: string;
}

export interface ScheduleInterviewRequest {
  applicationId: string;
  scheduledAt: Date;
  interviewerUserId: string;
}

export interface CreateCohortRequest {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  googleCalendarId: string;
}

export interface RegisterForEventRequest {
  eventId: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  isRequired?: boolean;
}

// Content API Types
export interface CreateContentRequest {
  title: string;
  description: string;
  content?: string;
  category: string;
  type: string;
  externalUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  metadata?: {
    readTime?: number;
    fileSize?: number;
    fileType?: string;
    videoLength?: number;
    webinarDate?: Date;
    source?: string;
    language: string;
  };
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  status?: string;
}

export interface SearchContentRequest extends ContentSearchFilters, PaginationParams {}

export interface PublishContentRequest {
  contentId: string;
  publishedAt?: Date;
}

// Admin API Types
export interface UpdateUserRoleRequest {
  userId: string;
  role: string;
}

export interface DeleteUserRequest {
  userId: string;
  reason?: string;
}

export interface CreatePartnerRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  partnershipType: string;
  displayOrder?: number;
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {
  isActive?: boolean;
}

export interface CreatePastEventRequest {
  title: string;
  description: string;
  eventDate: Date;
  location?: string;
  imageUrl?: string;
  attendeeCount?: number;
  highlightText?: string;
}

// Donation API Types
export interface CreateDonationRequest {
  amount: number;
  currency: 'USD' | 'EUR' | 'ILS';
  donorEmail?: string;
  donorName?: string;
  isAnonymous: boolean;
  paymentMethodId: string;
}

export interface ProcessDonationRequest {
  donationId: string;
  paymentIntentId: string;
}

// Calendar Integration Types
export interface SyncCalendarRequest {
  cohortId: string;
  forceSync?: boolean;
}

export interface CreateCalendarEventRequest {
  cohortId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isRequired?: boolean;
  zoomMeetingId?: string;
}

// Zoom Integration Types
export interface CreateZoomMeetingRequest {
  topic: string;
  startTime: Date;
  duration: number;
  settings?: {
    hostVideo?: boolean;
    participantVideo?: boolean;
    joinBeforeHost?: boolean;
    muteUponEntry?: boolean;
    waitingRoom?: boolean;
  };
}

// Response Types
export type ProfileResponse = ApiResponse<Profile>;
export type ProfilesResponse = ApiResponse<ProfileSearchResult>;
export type ApplicationResponse = ApiResponse<AcceleratorApplication>;
export type ApplicationsResponse = ApiResponse<PaginatedResponse<AcceleratorApplication>>;
export type CohortResponse = ApiResponse<Cohort>;
export type CohortsResponse = ApiResponse<PaginatedResponse<Cohort>>;
export type EventResponse = ApiResponse<CohortEvent>;
export type EventsResponse = ApiResponse<PaginatedResponse<CohortEvent>>;
export type ContentResponse = ApiResponse<ContentItem>;
export type ContentsResponse = ApiResponse<ContentSearchResult>;
export type PartnersResponse = ApiResponse<PaginatedResponse<Partner>>;
export type PastEventsResponse = ApiResponse<PaginatedResponse<PastEvent>>;
export type DonationResponse = ApiResponse<Donation>;

// Error Response Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: ValidationError[];
  timestamp: Date;
}