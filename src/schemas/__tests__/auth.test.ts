import { describe, it, expect } from "vitest";
import { signupFormSchema } from "../auth";

describe("signupFormSchema - username", () => {
  it("有効なユーザー名を通過させる", () => {
    expect(
      signupFormSchema.safeParse({ username: "testuser", nickname: "テスト" })
        .success,
    ).toBe(true);
  });

  it("アンダースコアを含む有効なユーザー名を通過させる", () => {
    expect(
      signupFormSchema.safeParse({ username: "test_user", nickname: "テスト" })
        .success,
    ).toBe(true);
  });

  it("数字を含む有効なユーザー名を通過させる", () => {
    expect(
      signupFormSchema.safeParse({ username: "user123", nickname: "テスト" })
        .success,
    ).toBe(true);
  });

  it("2文字以下はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "ab",
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "3文字以上で入力してください",
      );
    }
  });

  it("21文字以上はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "a".repeat(21),
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "20文字以内で入力してください",
      );
    }
  });

  it("日本語を含む場合はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "テストuser",
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "半角英数字・アンダースコアのみ使用できます",
      );
    }
  });

  it("ハイフンを含む場合はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "test-user",
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "半角英数字・アンダースコアのみ使用できます",
      );
    }
  });

  it("アンダースコアの連続はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "test__user",
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "アンダースコアを連続して使用することはできません",
      );
    }
  });

  it("空文字はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "",
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupFormSchema - nickname", () => {
  it("有効なニックネームを通過させる", () => {
    expect(
      signupFormSchema.safeParse({
        username: "testuser",
        nickname: "テストユーザー",
      }).success,
    ).toBe(true);
  });

  it("1文字のニックネームを通過させる", () => {
    expect(
      signupFormSchema.safeParse({ username: "testuser", nickname: "あ" })
        .success,
    ).toBe(true);
  });

  it("50文字のニックネームを通過させる", () => {
    expect(
      signupFormSchema.safeParse({
        username: "testuser",
        nickname: "あ".repeat(50),
      }).success,
    ).toBe(true);
  });

  it("空文字はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "testuser",
      nickname: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "ニックネームを入力してください",
      );
    }
  });

  it("51文字以上はエラー", () => {
    const result = signupFormSchema.safeParse({
      username: "testuser",
      nickname: "あ".repeat(51),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "50文字以内で入力してください",
      );
    }
  });
});
