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
