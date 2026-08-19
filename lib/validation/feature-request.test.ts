import { describe, expect, it } from "vitest";
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  validateFeatureRequest,
} from "@/lib/validation/feature-request";

describe("validateFeatureRequest", () => {
  it("accepts a valid request with an optional empty description", () => {
    expect(validateFeatureRequest("Useful title", "")).toEqual({});
  });

  it("rejects blank and short titles", () => {
    expect(validateFeatureRequest("  ", "")).toHaveProperty("title", "Title is required");
    expect(validateFeatureRequest("Hi", "")).toHaveProperty("title");
  });

  it("enforces the title maximum", () => {
    expect(validateFeatureRequest("x".repeat(TITLE_MAX + 1), "")).toHaveProperty("title");
  });

  it("rejects a non-empty description below its minimum", () => {
    expect(validateFeatureRequest("Valid title", "short")).toHaveProperty("description");
  });

  it("enforces the description maximum", () => {
    expect(validateFeatureRequest("Valid title", "x".repeat(DESCRIPTION_MAX + 1))).toHaveProperty(
      "description",
    );
  });
});
