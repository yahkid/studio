
// @/lib/podcast-data.ts
export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  publishDate: string; // YYYY-MM-DD
  duration: string; // e.g., "45:30"
  audioUrl: string; // Link to audio file or platform
  coverImageUrl?: string; // Optional: URL for episode cover art
  episodeNumber?: number;
  seasonNumber?: number;
  showNotes?: string; // Could be markdown content
}

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep1-roho-mtakatifu",
    title: "Kazi ya Roho Mtakatifu Maishani Mwako",
    description: "Gundua jinsi Roho Mtakatifu anavyofanya kazi ndani yako na kupitia wewe ili kuleta mabadiliko na ushindi.",
    publishDate: "2024-05-15",
    duration: "35:12",
    audioUrl: "https://archive.org/download/mythium/JLS_ATI_01.mp3", // Example MP3 URL
    coverImageUrl: "https://placehold.co/600x600.png?text=Podcast+Episode+1",
    episodeNumber: 1,
    seasonNumber: 1,
    showNotes: "Katika kipindi hiki, Rev. Innocent Morris anafafanua:\n- Majukumu makuu ya Roho Mtakatifu.\n- Jinsi ya kujazwa na Roho Mtakatifu.\n- Ishara za mtu anayeongozwa na Roho."
  },
  {
    id: "ep2-nguvu-ya-ushuhuda",
    title: "Nguvu ya Ushuhuda Wako",
    description: "Jifunze jinsi kushiriki hadithi yako ya imani kunavyoweza kuleta tumaini na kuwabadilisha wengine.",
    publishDate: "2024-05-22",
    duration: "42:55",
    audioUrl: "https://archive.org/download/mythium/JLS_ATI_02.mp3", // Example MP3 URL
    coverImageUrl: "https://placehold.co/600x600.png?text=Podcast+Episode+2",
    episodeNumber: 2,
    seasonNumber: 1,
    showNotes: "Mchungaji Jane Doe anashiriki:\n- Kwa nini ushuhuda ni muhimu.\n- Jinsi ya kuandaa ushuhuda wako.\n- Athari za ushuhuda katika uinjilisti."
  },
  {
    id: "ep3-kuvuka-majaribu",
    title: "Kukua Kupitia Majaribu",
    description: "Changamoto ni sehemu ya maisha, lakini Mungu anaweza kuzitumia kutukuza na kutuimarisha. Sikiliza jinsi gani.",
    publishDate: "2024-05-29",
    duration: "38:20",
    audioUrl: "https://archive.org/download/mythium/JLS_ATI_03.mp3", // Example MP3 URL
    coverImageUrl: "https://placehold.co/600x600.png?text=Podcast+Episode+3",
    episodeNumber: 3,
    seasonNumber: 1,
    showNotes: "Katika kipindi hiki tunajadili:\n- Mtazamo wa kibiblia kuhusu majaribu.\n- Ahadi za Mungu wakati wa magumu.\n- Ushindi unaopatikana kupitia Kristo."
  },
  {
    id: "ep4-familia-ya-imani",
    title: "Umuhimu wa Familia ya Imani",
    description: "Kuchunguza jukumu la kanisa kama familia na jinsi tunavyoweza kuinuana na kukua pamoja katika Kristo.",
    publishDate: "2024-06-05",
    duration: "40:10",
    audioUrl: "https://archive.org/download/mythium/JLS_ATI_04.mp3", // Example MP3 URL
    coverImageUrl: "https://placehold.co/600x600.png?text=Podcast+Episode+4",
    episodeNumber: 4,
    seasonNumber: 1,
    showNotes: "Rev. Morris na Pastor Jane wanajadili:\n- Dhana ya kanisa kama mwili wa Kristo.\n- Wajibu wa kila muumini katika familia ya Mungu.\n- Faida za ushirika wa kweli."
  }
];

export const getPodcastEpisodeById = (id: string): PodcastEpisode | undefined => {
  return podcastEpisodes.find(episode => episode.id === id);
};

export const getLatestPodcastEpisodes = (count: number): PodcastEpisode[] => {
  return [...podcastEpisodes]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
};
