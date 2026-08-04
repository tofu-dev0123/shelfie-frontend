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

  it("複数のURLを検出する", () => {
    const result = linkifyContent(
      "https://example.com と https://example.org/page",
    );
    expect(result).toEqual([
      { type: "url", value: "https://example.com" },
      { type: "text", value: " と " },
      { type: "url", value: "https://example.org/page" },
    ]);
  });

  it("ハッシュタグはただのテキストとして扱う", () => {
    const result = linkifyContent("前 #タグ 後");
    expect(result).toEqual([{ type: "text", value: "前 #タグ 後" }]);
  });

  it("改行を含むテキストは text セグメント側で保持される", () => {
    const result = linkifyContent("一行目\n二行目 https://example.com");
    expect(result).toEqual([
      { type: "text", value: "一行目\n二行目 " },
      { type: "url", value: "https://example.com" },
    ]);
  });
});
