import type {
  DisputeVerdict,
  DisputeVerdictInput,
  DisputeVerdictResult,
  VerdictConfidence,
} from "../types/verdict";

type NormalizedDisputeInput = {
  disputeTitle: string;
  sideAClaim: string;
  sideBClaim: string;
  evidence: string;
  decisionRule: string;
};

function normalizeInput(input: DisputeVerdictInput): NormalizedDisputeInput {
  return {
    disputeTitle: input.disputeTitle.toLowerCase(),
    sideAClaim: input.sideAClaim.toLowerCase(),
    sideBClaim: input.sideBClaim.toLowerCase(),
    evidence: input.evidence.toLowerCase(),
    decisionRule: input.decisionRule.toLowerCase(),
  };
}

function getRecommendedResolution(verdict: DisputeVerdict): string {
  if (verdict === "side_a") {
    return "Favor Side A based on the submitted evidence.";
  }

  if (verdict === "side_b") {
    return "Favor Side B based on the submitted evidence.";
  }

  if (verdict === "split") {
    return "Consider a partial or negotiated resolution.";
  }

  return "Request clearer evidence before making a final decision.";
}

function createResult(
  verdict: DisputeVerdict,
  confidence: VerdictConfidence,
  reason: string,
  generatedAt: string,
): DisputeVerdictResult {
  return {
    verdict,
    confidence,
    reason,
    recommendedResolution: getRecommendedResolution(verdict),
    generatedAt,
  };
}

export function mockDisputeResolver(input: DisputeVerdictInput): DisputeVerdictResult {
  const normalizedInput: NormalizedDisputeInput = normalizeInput(input);

  if (normalizedInput.evidence.includes("both parties agree")) {
    return createResult(
      "split",
      "high",
      "The evidence says both parties agree, so the mock resolver recommends a split outcome.",
      input.generatedAt,
    );
  }

  if (
    normalizedInput.evidence.includes("side a completed") ||
    normalizedInput.evidence.includes("a completed") ||
    normalizedInput.evidence.includes("delivered by side a")
  ) {
    return createResult(
      "side_a",
      "high",
      "The evidence indicates Side A completed or delivered the expected work.",
      input.generatedAt,
    );
  }

  if (
    normalizedInput.evidence.includes("side b is correct") ||
    normalizedInput.evidence.includes("b is correct") ||
    normalizedInput.evidence.includes("side a failed")
  ) {
    return createResult(
      "side_b",
      "high",
      "The evidence directly supports Side B or indicates Side A failed.",
      input.generatedAt,
    );
  }

  if (
    normalizedInput.evidence.includes("partial") ||
    normalizedInput.evidence.includes("partially") ||
    normalizedInput.evidence.includes("incomplete")
  ) {
    return createResult(
      "split",
      "medium",
      "The evidence suggests partial or incomplete performance, so a split resolution fits this mock rule.",
      input.generatedAt,
    );
  }

  if (input.evidence.trim().length < 120) {
    return createResult(
      "unclear",
      "low",
      "The evidence is too short for a confident mock resolution.",
      input.generatedAt,
    );
  }

  return createResult(
    "unclear",
    "medium",
    "The submitted evidence does not match a stronger deterministic resolution rule.",
    input.generatedAt,
  );
}
