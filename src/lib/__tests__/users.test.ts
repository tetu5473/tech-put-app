import { describe, it, expect } from "vitest";
import { Gender, genderLabel } from "../users";

describe("genderLabel", () => {
  it("男性を返す", () => {
    expect(genderLabel(Gender.Male)).toBe("男性");
  });

  it("女性を返す", () => {
    expect(genderLabel(Gender.Female)).toBe("女性");
  });

  it("未設定を返す", () => {
    expect(genderLabel(Gender.Unset)).toBe("未設定");
  });
});
