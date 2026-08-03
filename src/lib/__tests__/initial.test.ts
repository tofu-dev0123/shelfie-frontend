import { describe, it, expect } from "vitest";
import { initialOf } from "../initial";

describe("initialOf", () => {
  it("英字は大文字にして返す", () => {
    expect(initialOf("haruki")).toBe("H");
  });

  it("日本語はそのまま1文字返す", () => {
    expect(initialOf("村上春樹")).toBe("村");
  });

  it("前後の空白を無視する", () => {
    expect(initialOf("  tofu")).toBe("T");
  });

  it("空文字は ? を返す", () => {
    expect(initialOf("")).toBe("?");
  });

  it("空白のみは ? を返す", () => {
    expect(initialOf("   ")).toBe("?");
  });

  it("サロゲートペアの絵文字が割れない", () => {
    expect(initialOf("😀にこ")).toBe("😀");
  });
});
