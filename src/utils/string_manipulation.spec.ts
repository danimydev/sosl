import { doubleQuote, singleQuote } from "./string_manipulation";

describe("string manipulation test suit", () => {
  it("should add single quotes on string", () => {
    const result = singleQuote("test");
    expect(result).toBe(`\'test\'`);
  });

  it("should add double quotes on string", () => {
    const result = doubleQuote("test");
    expect(result).toBe(`\"test\"`);
  });
});
