
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
        is_published: true,
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
        is_published: true,
        audioDownloadUrl: "#",
        videoDownloadUrl: "#",
    }
];

const sampleEvents = [
    {
        title: "Youth Conference 2025",
        description: "A special conference for all the youth to connect, learn, and grow in faith.",
        event_date: Timestamp.fromDate(new Date("2025-06-30")),
        start_time: "18:00",
        end_time: "20:30",
        event_type: 'special' as const,
        platform: "Main Church Hall",
        stream_url: "#",
        audience: "Youth",
        is_published: true,
    },
    {
        title: "Sunday Service",
        description: "Join us for our weekly worship and word service.",
        event_date: Timestamp.fromDate(new Date("2024-07-28")), // A date in the past to show it works
        start_time: "09:00",
        end_time: "11:00",
        event_type: 'weekly' as const,
        platform: "YouTube Live",
        stream_url: "https://youtube.com/hscmconnect",
        audience: "All",
        is_published: true,
    }
];

const sampleBlogPosts = [
    {
        title: "Finding Peace in a Chaotic World",
        slug: "finding-peace-in-a-chaotic-world",
        author: "Rev. Innocent Morris",
        content: "In a world filled with noise and distraction, finding true peace can seem impossible. But the Bible tells us that the peace of God, which transcends all understanding, is available to us through Christ Jesus. This article explores practical steps to anchor your heart in God's peace, no matter the storms you face.",
        image_url: 'https://placehold.co/600x400.png',
        ai_hint: 'serene landscape sunset',
        tags: ["peace", "faith", "hope"],
        is_published: true,
        published_at: Timestamp.fromDate(new Date("2024-07-15")),
    },
    {
        title: "The Purpose of Community in Faith",
        slug: "purpose-of-community-in-faith",
        author: "Pastor Jane Mdoe",
        content: "We were not created to walk our faith journey alone. Christian community is God's design for our growth, encouragement, and accountability. Discover why gathering together is more than just a Sunday tradition—it's a vital part of a thriving spiritual life.",
        image_url: 'https://placehold.co/600x400.png',
        ai_hint: 'diverse people smiling',
        tags: ["community", "church", "fellowship"],
        is_published: true,
        published_at: Timestamp.fromDate(new Date("2024-07-10")),
    }
];

const sampleResources = [
    {
        title: "Mwongozo wa Misingi ya Imani",
        description: "Mwongozo wa PDF unaoelezea imani za msingi za Ukristo na kanisa letu. Nzuri kwa waumini wapya.",
        category: "E-Books",
        fileUrl: "#",
        fileType: 'PDF' as const,
        thumbnailUrl: "https://placehold.co/600x400.png",
        aiHint: "open book light",
        order: 1,
        uploadedAt: serverTimestamp(),
    },
    {
        title: "Sermon Series Art",
        description: "High-resolution graphic for the 'Power of a Renewed Mind' sermon series.",
        category: "Graphics",
        fileUrl: "#",
        fileType: 'JPG' as const,
        thumbnailUrl: "https://placehold.co/600x400.png",
        aiHint: "abstract design brain",
        order: 2,
        uploadedAt: serverTimestamp(),
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
    
    // Seed Events
    sampleEvents.forEach(event => {
        const eventRef = doc(collection(db, 'events'));
        batch.set(eventRef, event);
    });
    
    // Seed Blog Posts
    sampleBlogPosts.forEach(post => {
        const postRef = doc(collection(db, 'blog_posts'));
        batch.set(postRef, post);
    });
    
    // Seed Resources
    sampleResources.forEach(resource => {
        const resourceRef = doc(collection(db, 'resources'));
        batch.set(resourceRef, resource);
    });

    await batch.commit();
    
    // Revalidate all relevant paths
    revalidatePath('/');
    revalidatePath('/kozi');
    revalidatePath('/uongozi');
    revalidatePath('/sermons');
    revalidatePath('/matukio');
    revalidatePath('/blog');
    revalidatePath('/resources');
    
    // Revalidate staff pages
    revalidatePath('/staff/content/sermons');
    revalidatePath('/staff/content/courses');
    revalidatePath('/staff/content/leadership');
    revalidatePath('/staff/content/events');
    revalidatePath('/staff/content/blog');
    revalidatePath('/staff/content/resources');


    return { success: true };
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
