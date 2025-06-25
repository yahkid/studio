'use server';

import { db } from '@/lib/firebaseClient';
import { collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { format, startOfMonth } from 'date-fns';
import type { DecisionDoc, DonationDoc } from '@/types/firestore';

export async function getAnalyticsData() {
  try {
    // 1. Fetch all necessary data in parallel
    const [
      decisionsSnap,
      donationsSnap,
      testimoniesSnap,
      coursesProgressSnap,
    ] = await Promise.all([
      getDocs(collection(db, 'decisions')),
      getDocs(collection(db, 'donations')),
      getCountFromServer(collection(db, 'user_testimonies')),
      getCountFromServer(collection(db, 'user_course_progress')),
    ]);

    const decisions = decisionsSnap.docs.map(doc => doc.data() as DecisionDoc);
    const donations = donationsSnap.docs.map(doc => doc.data() as DonationDoc);

    // 2. Process data for metric cards
    const totalDecisions = decisions.length;
    const totalTestimonies = testimoniesSnap.data().count;
    const totalCourses = coursesProgressSnap.data().count;
    const successfulDonations = donations.filter(d => d.status === 'succeeded');
    const totalDonationAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0);

    // 3. Process data for charts
    // Decisions over time (by month)
    const decisionsByMonth = decisions.reduce((acc, decision) => {
      const month = format(startOfMonth(decision.created_at.toDate()), 'yyyy-MM');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const decisionsTimeSeries = Object.entries(decisionsByMonth)
      .map(([month, count]) => ({
        date: month,
        Decisions: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Decision types breakdown
    const decisionTypes = decisions.reduce((acc, decision) => {
      const type = decision.decision_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const decisionTypeData = Object.entries(decisionTypes)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      success: true,
      stats: {
        totalDecisions,
        totalTestimonies,
        totalCourses,
        totalDonationAmount,
        totalUsers: 150, // Placeholder, as getting auth users server-side is complex
      },
      chartData: {
        decisionsTimeSeries,
        decisionTypeData,
      },
    };
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return { success: false, error: error.message };
  }
}
