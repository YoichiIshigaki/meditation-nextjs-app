import type { User } from "./type";

export const getMockUsers = (count: number): User[] => {
  const mockUsers = Array.from({ length: count }, (_, index) => {
    return {
      id: `user_id_${index}`,
      first_name: `first_name_${index}`,
      last_name: `last_name_${index}`,
      language: `language_${index}`,
      last_logged_in: new Date(),
      status: `status_${index}`,
      thumbnail_url: `thumbnail_url_${index}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }) satisfies User[];
  return mockUsers;
};
  