import { describe, it, expect } from "vitest";
import { linkifyContent } from "../linkify";

describe("linkifyContent", () => {
  it("空文字は空配列を返す", () => {
    expect(linkifyContent("")).toEqual([]);
  });

  it("プレーンテキストはそのまま text セグメントになる", () => {
    expect(linkifyContent("ただのテキスト")).toEqual([
      { type: "text", value: "ただのテキスト" },
    ]);
  });

  it("URLを検出して url セグメントを返す", () => {
    const result = linkifyContent("前 https://example.com/path 後");
    expect(result).toEqual([
      { type: "text", value: "前 " },
      { type: "url", value: "https://example.com/path" },
      { type: "text", value: " 後" },
    ]);
  });

  it("ハッシュタグを検出して hashtag セグメントを返す", () => {
    const result = linkifyContent("前 #タグ 後");
    expect(result).toEqual([
      { type: "text", value: "前 " },
      { type: "hashtag", value: "#タグ" },
      { type: "text", value: " 後" },
    ]);
  });

  it("URLとハッシュタグが混在するケース", () => {
    const result = linkifyContent(
      "#プログラミング https://example.com と #技術書",
    );
    expect(result).toEqual([
      { type: "hashtag", value: "#プログラミング" },
      { type: "text", value: " " },
      { type: "url", value: "https://example.com" },
      { type: "text", value: " と " },
      { type: "hashtag", value: "#技術書" },
    ]);
  });

  it("改行を含むテキストは text セグメント側で保持される", () => {
    const result = linkifyContent("一行目\n二行目 #タグ");
    expect(result).toEqual([
      { type: "text", value: "一行目\n二行目 " },
      { type: "hashtag", value: "#タグ" },
    ]);
  });
});
