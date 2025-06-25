
export interface MinistryEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  eventType: 'weekly' | 'monthly' | 'special';
  platform: string;
  streamUrl: string;
  audience: string;
  parsedDate?: Date; // Optional, for internal use after parsing
}
