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
