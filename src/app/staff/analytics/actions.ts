
'use server';

import { db } from '@/lib/firebaseClient';
import { collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { format, startOfMonth } from 'date-fns';
import type { DecisionDoc, DonationDoc, UserCourseProgressDoc } from '@/types/firestore';

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
      getDocs(collection(db, 'user_course_progress')), // Fetch full docs now
    ]);

    const decisions = decisionsSnap.docs.map(doc => doc.data() as DecisionDoc);
    const donations = donationsSnap.docs.map(doc => doc.data() as DonationDoc);
    const courseProgresses = coursesProgressSnap.docs.map(doc => doc.data() as UserCourseProgressDoc);

    // 2. Process data for metric cards
    const totalDecisions = decisions.length;
    const totalTestimonies = testimoniesSnap.data().count;
    const totalCoursesStarted = courseProgresses.length;
    const totalLessonsCompleted = courseProgresses.reduce((sum, progress) => sum + (progress.completed_lessons?.length || 0), 0);
    const successfulDonations = donations.filter(d => d.status === 'succeeded');
    const totalDonationAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalSuccessfulDonations = successfulDonations.length;

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

    // Donations over time (by month)
    const donationsByMonth = successfulDonations.reduce((acc, donation) => {
      const month = format(startOfMonth(donation.created_at.toDate()), 'yyyy-MM');
      acc[month] = (acc[month] || 0) + donation.amount;
      return acc;
    }, {} as Record<string, number>);

    const donationsTimeSeries = Object.entries(donationsByMonth)
      .map(([date, amount]) => ({
        date,
        Amount: amount,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      success: true,
      stats: {
        totalDecisions,
        totalTestimonies,
        totalCoursesStarted,
        totalLessonsCompleted,
        totalDonationAmount,
        totalSuccessfulDonations,
        totalUsers: 150, // Placeholder
      },
      chartData: {
        decisionsTimeSeries,
        decisionTypeData,
        donationsTimeSeries,
      },
    };
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return { success: false, error: error.message };
  }
}
