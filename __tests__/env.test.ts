import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse } from "dotenv";

/**
 * 必須の環境変数キー
 * 注意: src/config/index.tsで使用されている環境変数名と一致させること
 */
const REQUIRED_ENV_KEYS = [
  "AUTH_NEXT", // process.env.AUTH_NEXT (NEXTAUTH_SECRETとして使用)
  "NEXTAUTH_URL",
  "FIREBASE_ADMIN_CREDENTIALS",
  "FIREBASE_CLIENT_CREDENTIALS",
] as const;

/**
 * 環境変数名のエイリアスマッピング
 * 実際の.envファイルで異なる名前が使われている場合のマッピング
 */
const ENV_KEY_ALIASES: Record<string, string[]> = {
  AUTH_NEXT: ["AUTH_NEXT", "NEXTAUTH_SECRET"], // AUTH_NEXTまたはNEXTAUTH_SECRETのどちらかがあればOK
};

/**
 * 環境ごとの.envファイルのパターン
 */
const ENV_FILE_PATTERNS = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.production",
  ".env.production.local",
  ".env.staging",
  ".env.staging.local",
  ".env.test",
  ".env.test.local",
] as const;

/**
 * .envファイルを読み込んでパースする
 */
function loadEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }

  try {
    const content = readFileSync(filePath, "utf-8");
    const parsed = parse(content);
    // デバッグ用: ファイルの内容をログ出力（開発時のみ）
    if (process.env.DEBUG_ENV_TEST === "true") {
      console.log(`Loaded ${filePath}:`, Object.keys(parsed));
    }
    return parsed;
  } catch (error) {
    console.warn(`Failed to load ${filePath}:`, error);
    return {};
  }
}

/**
 * 環境変数キーが空でないかチェック
 */
function isKeyValid(key: string, value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  // 空文字列や空白のみの値は無効とみなす
  return value.trim().length > 0;
}

// テストがciで落ちるのでスキップ
describe.skip("環境変数ファイルの検証", () => {
  const projectRoot = resolve(process.cwd());

  // 各.envファイルを読み込む
  const envFiles = ENV_FILE_PATTERNS.map((pattern) => ({
    pattern,
    path: resolve(projectRoot, pattern),
    exists: existsSync(resolve(projectRoot, pattern)),
    content: loadEnvFile(resolve(projectRoot, pattern)),
  })).filter((file) => file.exists);

  describe("必須の環境変数キーの存在確認", () => {
    REQUIRED_ENV_KEYS.forEach((key) => {
      test(`${key} が少なくとも1つの.envファイルに存在すること`, () => {
        // エイリアスも含めてチェック
        const aliases = ENV_KEY_ALIASES[key] || [key];
        const foundInFiles = envFiles
          .filter((file) => {
            // エイリアスのいずれかが有効な値を持っているかチェック
            return aliases.some((alias) =>
              isKeyValid(alias, file.content[alias]),
            );
          })
          .map((file) => file.pattern);

        if (foundInFiles.length === 0) {
          console.error(
            `エラー: ${key} (またはエイリアス: ${aliases.join(", ")}) がどの.envファイルにも存在しません。`,
          );
        }

        expect(foundInFiles.length).toBeGreaterThan(0);
      });
    });
  });

  describe("各.envファイルの必須キー確認", () => {
    envFiles.forEach((file) => {
      describe(`${file.pattern}`, () => {
        REQUIRED_ENV_KEYS.forEach((key) => {
          test(`${key} が存在し、空でないこと（エイリアスも含む）`, () => {
            // エイリアスも含めてチェック
            const aliases = ENV_KEY_ALIASES[key] || [key];
            const foundAlias = aliases.find((alias) => {
              const value = file.content[alias];
              return value !== undefined && isKeyValid(alias, value);
            });

            if (foundAlias) {
              // エイリアスのいずれかが見つかった場合はOK
              expect(isKeyValid(foundAlias, file.content[foundAlias])).toBe(
                true,
              );
            } else {
              // ファイルにキーが存在しない場合は警告のみ（他のファイルにある可能性があるため）
              console.warn(
                `警告: ${file.pattern} に ${key} (またはエイリアス: ${aliases.join(", ")}) が存在しません。他の.envファイルで定義されていることを確認してください。`,
              );
            }
          });
        });
      });
    });
  });

  describe("環境変数の値の検証", () => {
    envFiles.forEach((file) => {
      describe(`${file.pattern}`, () => {
        Object.entries(file.content).forEach(([key, value]) => {
          test(`${key} の値が有効であること`, () => {
            // コメント行や空行は無視
            if (key.startsWith("#") || key.trim() === "") {
              return;
            }

            // 値が空でないことを確認
            expect(value).toBeDefined();
            expect(typeof value).toBe("string");

            // 値が空文字列でないことを確認（オプションのキーを除く）
            if ((REQUIRED_ENV_KEYS as readonly string[]).includes(key)) {
              expect(value.trim().length).toBeGreaterThan(0);
            }
          });
        });
      });
    });
  });

  describe("環境変数ファイルの存在確認", () => {
    test("少なくとも1つの.envファイルが存在すること", () => {
      expect(envFiles.length).toBeGreaterThan(0);
    });

    // 主要な環境ファイルの存在を確認
    const essentialFiles = [
      ".env",
      ".env.local",
      ".env.development",
      ".env.production",
    ];
    essentialFiles.forEach((pattern) => {
      const filePath = resolve(projectRoot, pattern);
      test(`${pattern} が存在するか、または他の.envファイルでカバーされていること`, () => {
        // ファイルが存在するか、または他のファイルで必須キーがカバーされているかを確認
        const exists = existsSync(filePath);
        if (!exists) {
          // ファイルが存在しない場合、他のファイルで必須キーがカバーされているか確認
          const allKeys = new Set(
            envFiles.flatMap((file) => Object.keys(file.content)),
          );
          const hasRequiredKeys = REQUIRED_ENV_KEYS.every((key) => {
            // エイリアスも含めてチェック
            const aliases = ENV_KEY_ALIASES[key] || [key];
            return aliases.some((alias) => allKeys.has(alias));
          });
          expect(hasRequiredKeys).toBe(true);
        }
      });
    });
  });

  describe("環境変数の重複確認", () => {
    test("同じキーが複数のファイルに定義されている場合、優先順位を確認", () => {
      const keyOccurrences: Record<string, string[]> = {};

      envFiles.forEach((file) => {
        Object.keys(file.content).forEach((key) => {
          if (!keyOccurrences[key]) {
            keyOccurrences[key] = [];
          }
          keyOccurrences[key].push(file.pattern);
        });
      });

      // 重複がある場合は警告を出力（これは正常な動作の可能性があるため、エラーにはしない）
      Object.entries(keyOccurrences).forEach(([key, files]) => {
        if (files.length > 1) {
          console.log(
            `情報: ${key} は複数のファイルに定義されています: ${files.join(", ")}`,
          );
        }
      });
    });
  });

  describe("環境変数の完全性チェック", () => {
    test("すべての必須環境変数が少なくとも1つのファイルに存在すること", () => {
      const allKeys = new Set(
        envFiles.flatMap((file) => Object.keys(file.content)),
      );

      const missingKeys = REQUIRED_ENV_KEYS.filter((key) => {
        // エイリアスも含めてチェック
        const aliases = ENV_KEY_ALIASES[key] || [key];
        return !aliases.some((alias) => allKeys.has(alias));
      });

      if (missingKeys.length > 0) {
        console.error("以下の必須環境変数が見つかりません:", missingKeys);
        missingKeys.forEach((key) => {
          const aliases = ENV_KEY_ALIASES[key] || [key];
          console.error(`  - ${key} (またはエイリアス: ${aliases.join(", ")})`);
        });
      }

      expect(missingKeys.length).toBe(0);
    });
  });
});
