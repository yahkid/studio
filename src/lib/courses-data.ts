
export interface Lesson {
  id: number; // Unique numeric ID within the course, e.g., 1, 2, 3
  title: string;
  videoId: string; // YouTube video ID
  duration: string; // e.g., "10:23"
  description?: string;
}

export interface Course {
  id: string; // Unique string ID for the course, e.g., "kusikia-sauti-ya-mungu"
  title: string;
  description: string;
  instructor: string;
  image: string; // URL or path to course image
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "kusikia-sauti-ya-mungu",
    title: "Jinsi ya Kusikia Sauti ya Mungu",
    description: "Jifunze mbinu na kanuni za msingi za kutambua na kusikia sauti ya Mungu maishani mwako.",
    instructor: "Rev. Innocent Morris",
    image: "https://placehold.co/600x400.png",
    lessons: [
      { id: 1, title: "Utangulizi: Umuhimu wa Kusikia Sauti ya Mungu", videoId: "dQw4w9WgXcQ", duration: "12:30" },
      { id: 2, title: "Njia Mbalimbali Mungu Anazungumza Nasi", videoId: "L_jWHffIx5E", duration: "15:45" },
      { id: 3, title: "Kujenga Mazingira ya Usikivu wa Kiroho", videoId: "3JZ_D3ELwOQ", duration: "10:15" },
      { id: 4, title: "Vikwazo Vinavyozuia Kusikia Sauti ya Mungu", videoId: "SKHXmC2E9Rk", duration: "14:00" },
      { id: 5, title: "Kuthibitisha Unabii na Ujumbe wa Mungu", videoId: "tS_u-9z_zYk", duration: "11:50" },
    ],
  },
  {
    id: "maisha-ya-maombi",
    title: "Nguvu ya Maisha ya Maombi",
    description: "Gundua nguvu inayopatikana katika maisha ya maombi ya kina na jinsi ya kuimarisha uhusiano wako na Mungu kupitia maombi.",
    instructor: "Pastor Jane Doe",
    image: "https://placehold.co/600x400.png",
    lessons: [
      { id: 1, title: "Msingi wa Maombi: Kwa Nini Tunaomba?", videoId: "ru0K8uYEZWw", duration: "10:05" },
      { id: 2, title: "Aina za Maombi na Umuhimu Wake", videoId: "n_GFkY2Logc", duration: "13:20" },
      { id: 3, title: "Kuomba Kulingana na Mapenzi ya Mungu", videoId: "6g3g-w_x3Wc", duration: "12:00" },
      { id: 4, title: "Kushinda Changamoto Katika Maisha ya Maombi", videoId: "PTc_0wTRAzY", duration: "16:10" },
    ],
  },
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};
