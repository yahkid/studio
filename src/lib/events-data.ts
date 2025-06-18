
export interface MinistryEvent {
  id: number;
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

export const initialEventsData: MinistryEvent[] = [
  {
    "id": 2025060101,
    "title": "Maombi ya Kufungua Mwezi",
    "description": "Join Rev. Innocent Morris live as we dedicate the month of June to the Lord, declaring blessings and breakthrough for your life, family, and work.",
    "date": "2025-06-01",
    "startTime": "10:00",
    "endTime": "11:30",
    "eventType": "monthly",
    "platform": "YouTube Live, Facebook Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025060102,
    "title": "Sunday Night Service",
    "description": "A powerful time of worship with the HSCM Worship team and a life-changing message from the Word to start your week strong and centered on Christ.",
    "date": "2025-06-01",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025060301,
    "title": "Mafundisho ya Biblia (Bible Study)",
    "description": "Deep dive into the scriptures. This month's series: Foundations of Faith. Tonight's topic: The Role of the Holy Spirit in a Believer's Life.",
    "date": "2025-06-03",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live, Zoom",
    "streamUrl": "#",
    "audience": "All (Live), Members (Interactive Q&A)"
  },
  {
    "id": 2025060601,
    "title": "Usiku wa Maombi (All-Night Prayer Vigil)",
    "description": "Join us for a night of powerful intercession, worship, and spiritual warfare. Submit your prayer requests live in the chat.",
    "date": "2025-06-06",
    "startTime": "22:00",
    "endTime": "01:00", 
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025060801,
    "title": "Sunday Night Service",
    "description": "A powerful time of worship and Word.",
    "date": "2025-06-08",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025061001,
    "title": "Mafundisho ya Biblia (Bible Study)",
    "description": "Foundations of Faith series continues.",
    "date": "2025-06-10",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live, Zoom",
    "streamUrl": "#",
    "audience": "All (Live), Members (Interactive Q&A)"
  },
   {
    "id": 2025061501,
    "title": "Sunday Night Service - Special Guest",
    "description": "Join us for a special Sunday Night Service with a guest speaker.",
    "date": "2025-06-15",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "special",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025061301, // Example of another event for Friday (matches night prayer pattern)
    "title": "Usiku wa Maombi (All-Night Prayer Vigil)",
    "description": "A night of seeking God's face, intercession for nations, and personal revival.",
    "date": "2025-06-13",
    "startTime": "22:00",
    "endTime": "01:00",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025061701, // Example of another Bible Study
    "title": "Mafundisho ya Biblia (Bible Study)",
    "description": "Continuing our Foundations of Faith series. Topic: The Power of Prayer.",
    "date": "2025-06-17",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live, Zoom",
    "streamUrl": "#",
    "audience": "All (Live), Members (Interactive Q&A)"
  },
  {
    "id": 2025062001, 
    "title": "Usiku wa Maombi (All-Night Prayer Vigil)",
    "description": "Join us for powerful intercession and worship.",
    "date": "2025-06-20",
    "startTime": "22:00",
    "endTime": "01:00",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025062201,
    "title": "Sunday Night Service",
    "description": "Experience God's presence and a timely message.",
    "date": "2025-06-22",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  },
  {
    "id": 2025062401,
    "title": "Mafundisho ya Biblia (Bible Study)",
    "description": "Concluding the Foundations of Faith series. Topic: Living a Spirit-filled Life.",
    "date": "2025-06-24",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "weekly",
    "platform": "YouTube Live, Zoom",
    "streamUrl": "#",
    "audience": "All (Live), Members (Interactive Q&A)"
  },
  {
    "id": 2025062801,
    "title": "Youth Ablaze Conference Kick-off",
    "description": "A special event to kick off our annual Youth Ablaze Conference. Worship, special guest, and impartation.",
    "date": "2025-06-28",
    "startTime": "18:00",
    "endTime": "21:00",
    "eventType": "special",
    "platform": "YouTube Live, On-site (Invite Only)",
    "streamUrl": "#",
    "audience": "Youth, Young Adults, All Welcome Online"
  },
  {
    "id": 2025062901,
    "title": "Sunday Night Service - Youth Takeover",
    "description": "The youth lead our Sunday Night Service as part of the Youth Ablaze Conference.",
    "date": "2025-06-29",
    "startTime": "20:00",
    "endTime": "21:30",
    "eventType": "special",
    "platform": "YouTube Live",
    "streamUrl": "#",
    "audience": "All"
  }
];
