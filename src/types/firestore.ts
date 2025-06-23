
// This file defines types for Firebase Firestore document structures.

import type { Timestamp } from 'firebase/firestore';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// --- USER SUBMISSION COLLECTIONS ---

export interface DecisionDoc {
  id?: string; 
  created_at: Timestamp;
  name: string;
  email: string;
  decision_type: string;
  comments: string | null;
  user_id: string; 
}

export interface LeadMagnetSignupDoc {
  id?: string;
  created_at: Timestamp;
  email: string;
}

export interface VisitRequestDoc {
  id?: string;
  created_at: Timestamp;
  name: string;
  email: string;
  message: string | null;
}

export interface ExitIntentOfferDoc {
  id?: string;
  created_at: Timestamp;
  email: string; // Can be 'anonymous_prayer_request'
}

export interface WeeklyUpdateSignupDoc {
  id?: string;
  created_at: Timestamp;
  email: string;
  source?: string; // e.g., 'watch_grow_section', 'matukio_page'
}

export interface FinancialPartnerSignupDoc {
  id?: string;
  created_at: Timestamp;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  country: string | null;
}

export interface PrayerPartnerSignupDoc {
  id?: string;
  created_at: Timestamp;
  first_name: string;
  last_name: string;
  email: string;
  committed_to_pray: boolean | null;
}

export interface VolunteerPartnerSignupDoc {
  id?: string;
  created_at: Timestamp;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  selected_roles?: string[];
  interests_skills: string | null;
}

export interface UserTestimonyDoc {
  id?: string; 
  userId: string; 
  userName: string;
  userEmail: string;
  story: string;
  fileUrl: string | null; 
  originalFileName: string | null; 
  submittedAt: Timestamp;
  status: "pending_review" | "approved" | "rejected"; 
  consentToShare: boolean;
  aiSuggestedQuote?: string | null; // AI-generated quote
  aiSummary?: string | null; // AI-generated summary
}

// --- USER DATA COLLECTIONS ---

export interface UserCourseProgressDoc {
  id?: string; 
  created_at?: Timestamp; 
  user_id: string; 
  course_id: string;
  completed_lessons: number[];
  last_accessed: Timestamp;
  progress_percentage: number;
}


// --- SITE CONTENT COLLECTIONS ---

export interface LeadershipDoc {
  id?: string;
  name: string;
  title: string;
  imageSrc: string;
  aiHint?: string;
  bio: string;
  order: number; 
}

export interface EventDoc {
  id?: string;
  title: string;
  description: string;
  event_date: Timestamp; // Use a Timestamp for querying
  start_time: string; // e.g., "20:00"
  end_time: string; // e.g., "21:30"
  event_type: 'weekly' | 'monthly' | 'special';
  platform: string; // e.g., "YouTube Live, Facebook"
  stream_url: string;
  audience: string; // e.g., "All", "Youth"
  is_active: boolean; // To easily show/hide events
}

export interface LessonDoc {
  id: number;
  title: string;
  videoId: string;
  duration: string;
  description?: string;
}

export interface CourseDoc {
  id?: string;
  course_slug: string; // e.g., "kusikia-sauti-ya-mungu"
  title: string;
  description: string;
  instructor: string;
  image_url: string;
  lessons: LessonDoc[]; // Array of lesson objects
  is_published: boolean;
  order: number;
}

export interface SermonDoc {
    id?: string;
    title: string;
    description: string;
    speaker: string;
    youtube_video_id: string;
    sermon_date: Timestamp;
    tags?: string[];
    is_featured: boolean; // To mark a sermon for the homepage
}

export interface PublishedTestimonyDoc {
    id?: string;
    name: string;
    location: string;
    quote: string;
    story: string;
    image_url: string;
    ai_hint?: string;
    order: number; // For sorting on the page
    original_testimony_id: string; // Link back to the original submission
    published_at: Timestamp;
}


// --- MASTER TYPE INTERFACE ---
// This interface groups all document types for easy reference.

export interface FirestoreDocTypes {
  decisions: DecisionDoc;
  leadership: LeadershipDoc;
  lead_magnet_signups: LeadMagnetSignupDoc;
  visit_requests: VisitRequestDoc;
  exit_intent_offers: ExitIntentOfferDoc;
  weekly_updates_signups: WeeklyUpdateSignupDoc;
  financial_partner_signups: FinancialPartnerSignupDoc;
  prayer_partner_signups: PrayerPartnerSignupDoc;
  volunteer_partner_signups: VolunteerPartnerSignupDoc;
  user_course_progress: UserCourseProgressDoc;
  user_testimonies: UserTestimonyDoc;
  
  // Newly added content collections
  events: EventDoc;
  courses: CourseDoc;
  sermons: SermonDoc;
  published_testimonials: PublishedTestimonyDoc;
}
