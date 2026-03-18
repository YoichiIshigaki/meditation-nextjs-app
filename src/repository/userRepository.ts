import { getAdminAuth } from "@/lib/firebaseAdmin";
import { chunk } from "@/utils/array";

export type UserEntry = { id: string; firstName: string; email: string };

type AdminAuth = Awaited<ReturnType<typeof getAdminAuth>>;

// バッチ内のユーザーに Firebase Auth のメールアドレスを補完して返す
const fetchEmailsForBatch = async (
  batch: UserEntry[],
  adminAuth: AdminAuth,
): Promise<UserEntry[]> => {
  const { users: authUsers } = await adminAuth.getUsers(batch.map((u) => ({ uid: u.id })));
  const emailMap = new Map(authUsers.map((u) => [u.uid, u.email ?? ""]));
  return batch.map((u) => ({ ...u, email: emailMap.get(u.id) ?? "" }));
};

// Firebase Auth から uid に紐づくメールアドレスを取得し、email フィールドを補完した新しい配列を返す。
// Firebase Auth の getUsers は 100件上限のため、100件ずつバッチ処理する。
export const fillEmailsFromAuth = async (userEntries: UserEntry[]): Promise<UserEntry[]> => {
  const adminAuth = await getAdminAuth();
  return chunk(userEntries, 100).reduce<Promise<UserEntry[]>>(async (prevPromise, batch) => {
    const prev = await prevPromise;
    try {
      return [...prev, ...await fetchEmailsForBatch(batch, adminAuth)];
    } catch (err) {
      console.error("Failed to batch fetch user emails:", err);
      return [...prev, ...batch];
    }
  }, Promise.resolve([]));
};
