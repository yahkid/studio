
'use server';

import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebaseClient';
import { doc, setDoc, writeBatch, Timestamp, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const sampleCourses = [
  {
    course_slug: 'kusikia-sauti-ya-mungu',
    title: 'Kusikia Sauti ya Mungu',
    description: 'Jifunze jinsi ya kutambua na kuitikia sauti ya Mungu maishani mwako kupitia Neno, maombi, na Roho Mtakatifu.',
    instructor: 'Rev. Innocent Morris',
    image_url: 'https://placehold.co/600x400.png',
    is_published: true,
    order: 1,
    lessons: [
      { id: 1, title: 'Utangulizi: Kwa Nini Tusikie?', videoId: 'VIDEO_ID_1', duration: '15:00', description: 'Utangulizi wa umuhimu wa kusikia sauti ya Mungu.', pdfDownloadUrl: '#' },
      { id: 2, title: 'Njia Nne Mungu Anazungumza', videoId: 'VIDEO_ID_2', duration: '25:30', description: 'Gundua njia kuu ambazo Mungu hutumia kuwasiliana nasi.', pdfDownloadUrl: '#' },
      { id: 3, title: 'Kutambua Sauti ya Mchungaji Mwema', videoId: 'VIDEO_ID_3', duration: '22:15', description: 'Jifunze kutofautisha sauti ya Mungu na sauti zingine.' },
    ],
  },
  {
    course_slug: 'maisha-ya-maombi',
    title: 'Maisha ya Maombi',
    description: 'Gundua nguvu na umuhimu wa maombi ya kila siku. Kozi hii itakupa msingi imara wa kujenga maisha yenye maombi yenye matokeo.',
    instructor: 'Pastor Jane Mdoe',
    image_url: 'https://placehold.co/600x400.png',
    is_published: true,
    order: 2,
    lessons: [
      { id: 1, title: 'Maombi ni Nini?', videoId: 'VIDEO_ID_4', duration: '18:00', description: 'Kuelewa asili na madhumuni ya maombi.', pdfDownloadUrl: '#' },
      { id: 2, title: 'Aina za Maombi', videoId: 'VIDEO_ID_5', duration: '28:00', description: 'Jifunze kuhusu maombi ya shukrani, kuabudu, maombezi na dua.' },
      { id: 3, title: 'Kujenga Tabia ya Kuomba', videoId: 'VIDEO_ID_6', duration: '20:00', description: 'Vidokezo vya vitendo vya kufanya maombi kuwa sehemu ya maisha yako ya kila siku.' },
    ],
  },
];

const sampleLeadership = [
    { id: 'rev-innocent-morris', name: 'Rev. Innocent Morris', title: 'Mchungaji Kiongozi & Mwanzilishi', imageSrc: '/Rev Innocent Morris.png', bio: 'Rev. Innocent Morris ni mwanzilishi na mchungaji kiongozi wa HSCM Connect. Ana shauku ya kuona watu wakikutana na Yesu na kugundua kusudi lao.', order: 1, aiHint: 'pastor portrait african man' },
    { id: 'pastor-jane-mdoe', name: 'Pastor Jane Mdoe', title: 'Mchungaji Mshirika', imageSrc: '/1750433614351.jpg', bio: 'Pastor Jane anasimamia huduma za wanawake na familia, akihakikisha kila mtu anapata msaada na upendo katika jamii ya kanisa.', order: 2, aiHint: 'pastor portrait african woman' },
    { id: 'john-peter', name: 'John Peter', title: 'Kiongozi wa Sifa na Kuabudu', imageSrc: '/1750433633252.jpg', bio: 'John anaongoza timu ya sifa na kuabudu, akilenga kuunda mazingira ambapo watu wanaweza kukutana na Mungu kwa njia ya muziki.', order: 3, aiHint: 'worship leader portrait man' },
];

const sampleSermons = [
    {
        title: "The Power of a Renewed Mind",
        description: "Discover how changing your mindset through God's Word can transform every area of your life. Based on Romans 12:2.",
        speaker: "Rev. Innocent Morris",
        youtube_video_id: "DpA0drOZsKc",
        sermon_date: Timestamp.fromDate(new Date("2024-07-21")),
        tags: ["transformation", "mindset", "faith"],
        is_featured: true,
        audioDownloadUrl: "#",
        videoDownloadUrl: "#",
    },
    {
        title: "Living in Abundant Joy",
        description: "Joy is more than happiness; it's a fruit of the Spirit. Learn how to cultivate unshakable joy, regardless of your circumstances.",
        speaker: "Pastor Jane Mdoe",
        youtube_video_id: "SP3FVbEP0ps",
        sermon_date: Timestamp.fromDate(new Date("2024-07-14")),
        tags: ["joy", "spiritual growth", "hope"],
        is_featured: false,
        audioDownloadUrl: "#",
        videoDownloadUrl: "#",
    }
];

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Seed Courses
    sampleCourses.forEach(course => {
      const courseRef = doc(db, 'courses', course.course_slug);
      batch.set(courseRef, course);
    });

    // Seed Leadership
    sampleLeadership.forEach(leader => {
      const leaderRef = doc(db, 'leadership', leader.id);
      batch.set(leaderRef, leader);
    });

    // Seed Sermons
    sampleSermons.forEach(sermon => {
        const sermonRef = doc(collection(db, 'sermons'));
        batch.set(sermonRef, sermon);
    });

    await batch.commit();
    
    // Revalidate paths to show new data
    revalidatePath('/kozi');
    revalidatePath('/uongozi');
    revalidatePath('/'); // For sermons on homepage
    revalidatePath('/staff/content/sermons');
    revalidatePath('/staff/content/courses');
    revalidatePath('/staff/content/leadership');


    return { success: true };
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
