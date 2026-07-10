import { describe, it, expect, beforeEach } from "vitest";
import localforage from "localforage";
import {
  createUser,
  getUsers,
  findUserByEmail,
  login,
  logout,
  getCurrentUser,
} from "../usersStore";
import { Gender } from "../users";
import type { User } from "../users";

// usersStore.ts と同じ設定のインスタンスを作ると同じストアを参照できる
const storage = localforage.createInstance({
  name: "tech-put-app",
  storeName: "app_storage",
});

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "test-id-1",
  name: "山田 太郎",
  email: "taro@example.com",
  birthday: "2000-01-01",
  gender: Gender.Unset,
  password: "secret123",
  createdAt: new Date().toISOString(),
  ...overrides,
});

beforeEach(async () => {
  await storage.clear();
});

describe("createUser", () => {
  it("ユーザーを登録できる", async () => {
    await createUser(makeUser());
    const users = await getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("taro@example.com");
  });

  it("同じメールアドレスは登録できない", async () => {
    await createUser(makeUser());
    await expect(
      createUser(makeUser({ id: "test-id-2" }))
    ).rejects.toThrow("既に登録されています");
  });

  it("メールアドレスの重複判定は大文字小文字を区別しない", async () => {
    await createUser(makeUser());
    await expect(
      createUser(makeUser({ id: "test-id-2", email: "TARO@EXAMPLE.COM" }))
    ).rejects.toThrow("既に登録されています");
  });
});

describe("findUserByEmail", () => {
  it("大文字小文字を区別せずに検索できる", async () => {
    await createUser(makeUser());
    const found = await findUserByEmail("TARO@example.com");
    expect(found?.id).toBe("test-id-1");
  });

  it("存在しない場合は null を返す", async () => {
    expect(await findUserByEmail("nobody@example.com")).toBeNull();
  });
});

describe("login / logout", () => {
  it("正しいパスワードでログインでき、現在のユーザーになる", async () => {
    await createUser(makeUser());
    const user = await login("taro@example.com", "secret123");
    expect(user.id).toBe("test-id-1");

    const current = await getCurrentUser();
    expect(current?.id).toBe("test-id-1");
  });

  it("間違ったパスワードではログインできない", async () => {
    await createUser(makeUser());
    await expect(login("taro@example.com", "wrong")).rejects.toThrow(
      "メールアドレスまたはパスワードが違います"
    );
  });

  it("未登録のメールアドレスではログインできない", async () => {
    await expect(login("nobody@example.com", "secret123")).rejects.toThrow(
      "メールアドレスまたはパスワードが違います"
    );
  });

  it("ログアウトすると現在のユーザーがいなくなる", async () => {
    await createUser(makeUser());
    await login("taro@example.com", "secret123");
    await logout();
    expect(await getCurrentUser()).toBeNull();
  });
});
