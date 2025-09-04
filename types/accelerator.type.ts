// Accelerator Program related types

export enum ApplicationStatus {
  DRAFT = 'draft',
  PROFILE_SUBMITTED = 'profile_submitted',
  APPLICATION_SUBMITTED = 'application_submitted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ApplicationStep {
  PROFILE = 1,
  APPLICATION_FORM = 2,
  INTERVIEW = 3,
  NOTIFICATION = 4
}

export interface AcceleratorApplication {
  id: string;
  userId: string;
  cohortId: string;
  status: ApplicationStatus;
  currentStep: ApplicationStep;
  applicationData: ApplicationFormData;
  interviewScheduledAt?: Date;
  interviewNotes?: string;
  rejectionReason?: string;
  approvedAt?: Date;
  approvedBy?: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationFormData {
  // Step 1: Profile (references existing UserProfile)
  profileId: string;
  
  // Step 2: Application form specific fields
  motivationStatement: string;
  relevantExperience: string;
  expectedOutcomes: string;
  availabilityCommitment: string;
  additionalInfo?: string;
  
  // Step 3: Interview
  preferredInterviewTimes?: Date[];
  interviewPreferences?: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
  googleCalendarId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CohortEvent {
  id: string;
  cohortId: string;
  googleEventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomPassword?: string;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  attendanceStatus: 'registered' | 'attended' | 'no_show';
  attendedAt?: Date;
}

export interface InterviewSlot {
  id: string;
  applicationId: string;
  scheduledAt: Date;
  interviewerUserId: string;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  notes?: string;
  completed: boolean;
  createdAt: Date;
}