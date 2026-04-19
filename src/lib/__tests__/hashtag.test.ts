import { describe, it, expect } from "vitest";
import {
  extractHashtags,
  detectHashtagTrigger,
  replaceHashtagToken,
  MAX_HASHTAGS,
} from "../hashtag";

describe("extractHashtags", () => {
  it("単純な英数字ハッシュタグを抽出する", () => {
    expect(extractHashtags("読了 #Ruby #Rails")).toEqual(["Ruby", "Rails"]);
  });

  it("日本語ハッシュタグを抽出する", () => {
    expect(extractHashtags("#日本語 もOK")).toEqual(["日本語"]);
  });

  it("重複は uniq される", () => {
    expect(extractHashtags("#Ruby #Ruby #Ruby")).toEqual(["Ruby"]);
  });

  it("50文字ちょうどは抽出する", () => {
    const name = "a".repeat(50);
    expect(extractHashtags(`#${name}`)).toEqual([name]);
  });

  it("51文字以上のタグは先頭50文字だけを抽出する（バックエンドと同挙動）", () => {
    const name = "a".repeat(51);
    expect(extractHashtags(`#${name}`)).toEqual([name.slice(0, 50)]);
  });

  it("ハッシュタグがなければ空配列", () => {
    expect(extractHashtags("タグはありません")).toEqual([]);
  });

  it("ハッシュ記号単体は無視する", () => {
    expect(extractHashtags("#")).toEqual([]);
  });

  it("空白・句読点で区切られる", () => {
    expect(extractHashtags("#Ruby、#Rails")).toEqual(["Ruby", "Rails"]);
  });
});

describe("detectHashtagTrigger", () => {
  it("行頭の #Ru| でトリガーを返す", () => {
    const trigger = detectHashtagTrigger("#Ru", 3);
    expect(trigger).toEqual({ query: "Ru", start: 0, end: 3 });
  });

  it("前に文字列がある #Ru| でトリガーを返す", () => {
    const text = "これ #Ru";
    const trigger = detectHashtagTrigger(text, text.length);
    expect(trigger).toEqual({ query: "Ru", start: 3, end: 6 });
  });

  it("トークンの途中にキャレットがある場合でもトリガーを返す", () => {
    // "#Ruby" に対して caret=3 なら "#Ru" までが query
    const trigger = detectHashtagTrigger("#Ruby", 3);
    expect(trigger).toEqual({ query: "Ru", start: 0, end: 3 });
  });

  it("# のみの直後はトリガーを返す（query は空）", () => {
    const trigger = detectHashtagTrigger("#", 1);
    expect(trigger).toEqual({ query: "", start: 0, end: 1 });
  });

  it("連続する ## はトリガーを返さない", () => {
    expect(detectHashtagTrigger("##foo", 5)).toBeNull();
  });

  it("単語途中の # はトリガーを返さない", () => {
    expect(detectHashtagTrigger("abc#def", 7)).toBeNull();
  });

  it("# の後に空白が挟まるとトリガーを返さない", () => {
    expect(detectHashtagTrigger("# foo", 5)).toBeNull();
  });

  it("50文字ちょうどはトリガーを返す", () => {
    const name = "a".repeat(50);
    const text = `#${name}`;
    expect(detectHashtagTrigger(text, text.length)).toEqual({
      query: name,
      start: 0,
      end: text.length,
    });
  });

  it("51文字超はトリガーを返さない", () => {
    const name = "a".repeat(51);
    const text = `#${name}`;
    expect(detectHashtagTrigger(text, text.length)).toBeNull();
  });

  it("日本語入力途中でもトリガーを返す", () => {
    const text = "感想 #日本";
    expect(detectHashtagTrigger(text, text.length)).toEqual({
      query: "日本",
      start: 3,
      end: text.length,
    });
  });

  it("改行直後の # もトリガーを返す", () => {
    const text = "1行目\n#Ruby";
    expect(detectHashtagTrigger(text, text.length)).toEqual({
      query: "Ruby",
      start: 4,
      end: text.length,
    });
  });

  it("キャレットがテキスト範囲外なら null", () => {
    expect(detectHashtagTrigger("#Ru", -1)).toBeNull();
    expect(detectHashtagTrigger("#Ru", 999)).toBeNull();
  });
});

describe("replaceHashtagToken", () => {
  it("行頭のトークンを差し替え、末尾に空白を入れる", () => {
    const trigger = { query: "Ru", start: 0, end: 3 };
    const result = replaceHashtagToken("#Ru", trigger, "Ruby");
    expect(result.text).toBe("#Ruby ");
    expect(result.caret).toBe("#Ruby ".length);
  });

  it("前後にテキストがある場合もトークンのみを差し替える", () => {
    const text = "読んだ #Ru 良い";
    const trigger = { query: "Ru", start: 4, end: 7 };
    const result = replaceHashtagToken(text, trigger, "Ruby");
    expect(result.text).toBe("読んだ #Ruby  良い");
    expect(result.caret).toBe(text.indexOf("#Ru") + "#Ruby ".length);
  });

  it("空 query（# のみ）も差し替えられる", () => {
    const trigger = { query: "", start: 0, end: 1 };
    const result = replaceHashtagToken("#", trigger, "Ruby");
    expect(result.text).toBe("#Ruby ");
    expect(result.caret).toBe("#Ruby ".length);
  });
});

describe("MAX_HASHTAGS", () => {
  it("5 で公開されている", () => {
    expect(MAX_HASHTAGS).toBe(5);
  });
});
