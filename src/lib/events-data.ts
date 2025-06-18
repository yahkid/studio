
import type { MinistryEvent as BaseMinistryEvent } from "@/app/matukio/page";

// Re-exporting or redefining MinistryEvent if it was only in matukio/page.tsx
// If it's already globally accessible or defined elsewhere, this might not be needed
// For now, let's assume it was defined in matukio/page.tsx and we need to centralize it.

export interface MinistryEvent extends BaseMinistryEvent {}

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
];
