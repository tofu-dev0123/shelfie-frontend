import { describe, it, expect } from "vitest";
import { reducer } from "../useUsernameCheck";

describe("useUsernameCheck reducer", () => {
  it("RESET は idle を返す", () => {
    expect(reducer("checking", { type: "RESET" })).toBe("idle");
  });

  it("START_CHECK は checking を返す", () => {
    expect(reducer("idle", { type: "START_CHECK" })).toBe("checking");
  });

  it("RESOLVE(available: true) は available を返す", () => {
    expect(reducer("checking", { type: "RESOLVE", available: true })).toBe(
      "available",
    );
  });

  it("RESOLVE(available: false) は taken を返す", () => {
    expect(reducer("checking", { type: "RESOLVE", available: false })).toBe(
      "taken",
    );
  });

  it("INVALID は invalid を返す", () => {
    expect(reducer("checking", { type: "INVALID" })).toBe("invalid");
  });

  it("ERROR は idle を返す", () => {
    expect(reducer("checking", { type: "ERROR" })).toBe("idle");
  });
});
