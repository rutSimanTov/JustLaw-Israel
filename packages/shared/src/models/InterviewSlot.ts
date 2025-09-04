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
