import type { MeditationContent } from './type'

export const getMockMeditationContent = (count: number, date: Date): MeditationContent[] => {

  const mockContents = Array.from({length: count },(_, index) => {
    return {
      id: `id_${index}`,
      title: `title_${index}`,
      description: `description_${index}`,
      image_url: `https://picsum.photos/80/80?random=${index}`,
      audio_url: `https://picsum.photos/80/80?random=${index}`,
      video_url: `https://picsum.photos/80/80?random=${index}`,
      duration: index * 10,
      created_at: date,
      updated_at: date,
    };
  }) satisfies MeditationContent[];
  return mockContents;
}