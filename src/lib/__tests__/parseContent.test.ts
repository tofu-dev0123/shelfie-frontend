import { describe, it, expect } from "vitest";
import { parseContent } from "../parseContent";

describe("parseContent", () => {
  it("タグがない本文はテキスト1つに分解される", () => {
    expect(parseContent("普通のコメントです。")).toEqual([
      { type: "text", value: "普通のコメントです。" },
    ]);
  });

  it("英字タグを抽出する", () => {
    expect(parseContent("これは #javascript の本です。")).toEqual([
      { type: "text", value: "これは " },
      { type: "tag", value: "#javascript", tagName: "javascript" },
      { type: "text", value: " の本です。" },
    ]);
  });

  it("日本語タグを抽出する", () => {
    expect(parseContent("おすすめ #小説 #村上春樹")).toEqual([
      { type: "text", value: "おすすめ " },
      { type: "tag", value: "#小説", tagName: "小説" },
      { type: "text", value: " " },
      { type: "tag", value: "#村上春樹", tagName: "村上春樹" },
    ]);
  });

  it("英数字・アンダースコア混在のタグを抽出する", () => {
    expect(parseContent("#test_1 #ABC123")).toEqual([
      { type: "tag", value: "#test_1", tagName: "test_1" },
      { type: "text", value: " " },
      { type: "tag", value: "#ABC123", tagName: "ABC123" },
    ]);
  });

  it("句読点でタグが終端する", () => {
    expect(parseContent("読了！#感想、よかった。")).toEqual([
      { type: "text", value: "読了！" },
      { type: "tag", value: "#感想", tagName: "感想" },
      { type: "text", value: "、よかった。" },
    ]);
  });

  it("タグだけの本文を扱える", () => {
    expect(parseContent("#git")).toEqual([
      { type: "tag", value: "#git", tagName: "git" },
    ]);
  });

  it("空文字列は空配列になる", () => {
    expect(parseContent("")).toEqual([]);
  });

  it("# 単体（タグ名なし）はテキストとして扱う", () => {
    expect(parseContent("# はタグではない")).toEqual([
      { type: "text", value: "# はタグではない" },
    ]);
  });
});
