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

export interface ApplicationFormData {
  profileId: string;
  motivationStatement: string;
  relevantExperience: string;
  expectedOutcomes: string;
  availabilityCommitment: string;
  additionalInfo?: string;
  preferredInterviewTimes?: Date[];
  interviewPreferences?: string;
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
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
