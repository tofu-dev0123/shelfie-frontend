import { describe, it, expect } from "vitest";
import { getPurchaseLabel } from "../purchaseLabel";

describe("getPurchaseLabel", () => {
  it("amazon.co.jp のURLから Amazon ラベルを返す", () => {
    expect(getPurchaseLabel("https://www.amazon.co.jp/dp/4873115655")).toBe(
      "Amazon",
    );
  });

  it("amazon.com のURLから Amazon ラベルを返す", () => {
    expect(getPurchaseLabel("https://www.amazon.com/dp/4873115655")).toBe(
      "Amazon",
    );
  });

  it("books.rakuten.co.jp のURLから 楽天ブックス ラベルを返す", () => {
    expect(getPurchaseLabel("https://books.rakuten.co.jp/rb/11487136/")).toBe(
      "楽天ブックス",
    );
  });

  it("rakuten.co.jp のURLから 楽天ブックス ラベルを返す", () => {
    expect(getPurchaseLabel("https://rakuten.co.jp/")).toBe("楽天ブックス");
  });

  it("それ以外のドメインは null を返す", () => {
    expect(
      getPurchaseLabel("https://honto.jp/netstore/pd-book_25335638.html"),
    ).toBeNull();
  });

  it("不正なURLでも例外を投げず null を返す", () => {
    expect(getPurchaseLabel("not-a-url")).toBeNull();
    expect(getPurchaseLabel("")).toBeNull();
  });

  it("ドメインに amazon を偽装した別サービスは Amazon ラベルを返さない", () => {
    expect(getPurchaseLabel("https://evil.com/amazon-fake")).toBeNull();
  });
});
