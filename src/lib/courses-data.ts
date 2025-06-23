import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import type { CourseDoc, LessonDoc } from '@/types/firestore';

// Re-exporting aligned types for components.
export interface Lesson extends LessonDoc {}
export interface Course extends CourseDoc {
  id: string; // The Firestore document ID
}

/**
 * Fetches all published courses from Firestore, ordered by the 'order' field.
 * @returns A promise that resolves to an array of Course objects.
 */
export async function getAllCourses(): Promise<Course[]> {
    if (!db) return [];
    try {
        const coursesQuery = query(
            collection(db, "courses"),
            where("is_published", "==", true),
            orderBy("order", "asc")
        );
        const querySnapshot = await getDocs(coursesQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as CourseDoc)
        })) as Course[];
    } catch (error) {
        console.error("Error fetching all courses:", error);
        return [];
    }
}

/**
 * Fetches a single published course by its URL slug.
 * This replaces the old static getCourseById function.
 * @param slug The URL slug of the course (e.g., "kusikia-sauti-ya-mungu").
 * @returns A promise that resolves to a Course object or null if not found.
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
    if (!db) return null;
    try {
        const q = query(
            collection(db, "courses"),
            where("course_slug", "==", slug),
            where("is_published", "==", true),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn(`No published course found with slug: ${slug}`);
            return null;
        }
        const courseDoc = querySnapshot.docs[0];
        return { id: courseDoc.id, ...(courseDoc.data() as CourseDoc) } as Course;
    } catch (error) {
        console.error(`Error fetching course with slug ${slug}:`, error);
        return null;
    }
}
