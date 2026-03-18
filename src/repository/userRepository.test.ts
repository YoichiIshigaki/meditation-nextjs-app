import { fillEmailsFromAuth, type AdminAuth } from "./userRepository";

jest.mock("@/lib/firebaseAdmin", () => ({
  getAdminAuth: jest.fn(),
}));

import { getAdminAuth } from "@/lib/firebaseAdmin";

const mockGetAdminAuth = jest.mocked(getAdminAuth);

const buildMockAdminAuth = (emailMap: Record<string, string>): AdminAuth =>
  ({
    getUsers: jest.fn(async (identifiers: { uid: string }[]) => ({
      users: identifiers
        .filter(({ uid }) => uid in emailMap)
        .map(({ uid }) => ({ uid, email: emailMap[uid] })),
    })),
  }) as unknown as AdminAuth;

describe("fillEmailsFromAuth", () => {
  beforeEach(() => jest.clearAllMocks());

  it("各ユーザーに Firebase Auth のメールアドレスを補完して返す", async () => {
    const mockAuth = buildMockAdminAuth({
      uid1: "user1@example.com",
      uid2: "user2@example.com",
    });
    mockGetAdminAuth.mockResolvedValue(mockAuth);

    const result = await fillEmailsFromAuth([
      { id: "uid1", firstName: "Alice", email: "" },
      { id: "uid2", firstName: "Bob", email: "" },
    ]);

    expect(result).toEqual([
      { id: "uid1", firstName: "Alice", email: "user1@example.com" },
      { id: "uid2", firstName: "Bob", email: "user2@example.com" },
    ]);
  });

  it("Firebase Auth にメールが存在しない uid は email が空文字になる", async () => {
    const mockAuth = buildMockAdminAuth({});
    mockGetAdminAuth.mockResolvedValue(mockAuth);

    const result = await fillEmailsFromAuth([
      { id: "uid_unknown", firstName: "Carol", email: "" },
    ]);

    expect(result).toEqual([
      { id: "uid_unknown", firstName: "Carol", email: "" },
    ]);
  });

  it("元の配列を変更しない（純粋関数）", async () => {
    const mockAuth = buildMockAdminAuth({ uid1: "user1@example.com" });
    mockGetAdminAuth.mockResolvedValue(mockAuth);

    const original = [{ id: "uid1", firstName: "Alice", email: "" }];
    await fillEmailsFromAuth(original);

    expect(original[0].email).toBe("");
  });

  it("getUsers が失敗したバッチは元のエントリをそのまま返す", async () => {
    const mockAuth = buildMockAdminAuth({});
    (mockAuth.getUsers as jest.Mock).mockRejectedValue(new Error("Auth error"));
    mockGetAdminAuth.mockResolvedValue(mockAuth);

    const result = await fillEmailsFromAuth([
      { id: "uid1", firstName: "Alice", email: "" },
    ]);

    expect(result).toEqual([
      { id: "uid1", firstName: "Alice", email: "" },
    ]);
  });

  it("101件以上のユーザーを100件ずつバッチ処理する", async () => {
    const emailMap = Object.fromEntries(
      Array.from({ length: 101 }, (_, i) => [`uid${i}`, `user${i}@example.com`]),
    );
    const mockAuth = buildMockAdminAuth(emailMap);
    mockGetAdminAuth.mockResolvedValue(mockAuth);

    const users = Array.from({ length: 101 }, (_, i) => ({
      id: `uid${i}`,
      firstName: `User${i}`,
      email: "",
    }));

    const result = await fillEmailsFromAuth(users);

    expect(mockAuth.getUsers).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(101);
    expect(result[0].email).toBe("user0@example.com");
    expect(result[100].email).toBe("user100@example.com");
  });
});
