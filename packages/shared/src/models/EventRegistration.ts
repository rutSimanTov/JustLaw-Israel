export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  attendanceStatus: 'registered' | 'attended' | 'no_show';
  attendedAt?: Date;
}
