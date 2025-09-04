// System-wide and infrastructure types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedResourceType?: string;
  relatedResourceId?: string;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  APPLICATION_APPROVED = 'application_approved',
  APPLICATION_REJECTED = 'application_rejected',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  EVENT_REMINDER = 'event_reminder',
  CONTENT_PUBLISHED = 'content_published',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export interface Partner {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  partnershipType: PartnershipType;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum PartnershipType {
  STRATEGIC = 'strategic',
  TECHNOLOGY = 'technology',
  FUNDING = 'funding',
  COMMUNITY = 'community',
  ACADEMIC = 'academic'
}

export interface PastEvent {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  location?: string;
  imageUrl?: string;
  attendeeCount?: number;
  highlightText?: string;
  createdAt: Date;
}

export interface Donation {
  id: string;
  donorEmail?: string;
  donorName?: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'ILS';
  isAnonymous: boolean;
  paymentMethod: string;
  paymentId: string;
  status: DonationStatus;
  createdAt: Date;
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  conferenceData?: {
    entryPoints: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
  };
}

export interface ZoomMeeting {
  id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  join_url: string;
  password?: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    waiting_room: boolean;
  };
}