import { db } from '@/lib/firebaseClient';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { PublishedTestimonyDoc } from '@/types/firestore';
import { TestimonialsContent } from './testimonials-content';

// Static fallback data
const fallbackTestimonials = [
  {
    imageSrc: "/1750433685204.jpg",
    imageAlt: "Picha ya Asha Juma",
    quote: "Nilipata familia na kusudi jipya.",
    story:
      "Kabla ya kujiunga na HSCM, nilijihisi mpweke na niliyepotea. Kupitia jumuiya na mafundisho, nimepata uponyaji na mwelekeo mpya maishani mwangu.",
    name: "Asha Juma",
    location: "Kinondoni, DSM",
  },
  {
    imageSrc: "/1750433633252.jpg",
    imageAlt: "Picha ya John Peter",
    aiHint: "portrait man african",
    quote: "Maisha yangu yamebadilika kabisa.",
    story:
      "Nilikuwa nimekata tamaa, lakini HSCM ilinipa tumaini. Sasa nina furaha na nguvu mpya ya kumtumikia Mungu na jamii yangu.",
    name: "John Peter",
    location: "Temeke, DSM",
  },
  {
    imageSrc: "/1750433614351.jpg",
    imageAlt: "Picha ya Fatuma Saidi",
    aiHint: "portrait young woman",
    quote: "Upendo nilioupata hapa hauna kifani.",
    story:
      "Jamii ya HSCM Connect ni ya kipekee. Nimekaribishwa kwa mikono miwili na nimejifunza mengi kuhusu imani yangu.",
    name: "Fatuma Saidi",
    location: "Ilala, DSM",
  },
];

async function getPublishedTestimonials() {
  if (!db) {
    console.warn("Testimonials Section: Firestore is not initialized. Returning empty array.");
    return [];
  }
  try {
    const testimonialsQuery = query(collection(db, "published_testimonials"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(testimonialsQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PublishedTestimonyDoc[];
  } catch (error) {
    console.error("Error fetching published testimonials:", error);
    return []; // Return empty array on error to allow fallback
  }
}

export async function TestimonialsSectionSw() {
  const fetchedTestimonials = await getPublishedTestimonials();
  const showFallbackMessage = fetchedTestimonials.length === 0;

  const testimonials = showFallbackMessage 
    ? fallbackTestimonials 
    : fetchedTestimonials.map(t => ({
        imageSrc: t.image_url,
        imageAlt: `Picha ya ${t.name}`,
        quote: t.quote,
        story: t.story,
        name: t.name,
        location: t.location,
        aiHint: t.ai_hint
      }));

  return (
    <TestimonialsContent testimonials={testimonials} showFallbackMessage={showFallbackMessage} />
  );
}
