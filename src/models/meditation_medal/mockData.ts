import type { MeditationMedal } from "./type";

export const getMockMeditationMedal = (
  count: number,
  date: Date,
): MeditationMedal[] => {
  const mockContents = Array.from({ length: count }, (_, index) => {
    return {
      id: `id_${index}`,
      medal_name: `medal_name_${index}`,
      description: `description_${index}`,
      image_url: `https://picsum.photos/80/80?random=${index}`,
      created_at: date,
      updated_at: date,
    };
  }) satisfies MeditationMedal[];
  return mockContents;
};
