
// This file defines types for Firebase Firestore document structures.

import type { Timestamp } from 'firebase/firestore';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define interfaces for your Firestore document structures

export interface DecisionDoc {
  id?: string; 
  created_at: Timestamp;
  name: string;
  email: string;
  decision_type: string;
  comments: string | null;
  user_id: string; 
}

export interface LeadershipDoc {
  id?: string;
  name: string;
  title: string;
  imageSrc: string;
  aiHint?: string;
  bio: string;
  order: number; // For sorting leaders on the page
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

// EventDoc is not directly written to by forms currently, but defined for completeness if needed.
export interface EventDoc {
  id?: string;
  created_at: Timestamp;
  title: string;
  description: string | null;
  details: string | null;
  image_src: string | null;
  image_alt: string | null;
  ai_hint: string | null;
  button_text: string | null;
  button_link: string | null;
  event_date: Timestamp;
  start_time?: string;
  end_time?: string;
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

export interface UserCourseProgressDoc {
  id?: string; // Firestore document ID
  created_at?: Timestamp; // Set only on creation
  user_id: string; // Firebase Auth user.uid
  course_id: string;
  completed_lessons: number[];
  last_accessed: Timestamp;
  progress_percentage: number;
}

export interface UserTestimonyDoc {
  id?: string; // Firestore document ID
  userId: string; // Firebase Auth user.uid
  userName: string;
  userEmail: string;
  story: string;
  fileUrl?: string | null; // URL to uploaded photo/document in Firebase Storage
  originalFileName?: string | null; // Original name of the uploaded file
  submittedAt: Timestamp;
  status: "pending_review" | "approved" | "rejected"; // Moderation status
  consentToShare: boolean;
}

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
}
