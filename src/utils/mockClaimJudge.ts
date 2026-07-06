import type {
  ClaimVerdictInput,
  ClaimVerdictResult,
  VerdictConfidence,
} from "../types/verdict";

function getSourceCount(sourceUrls: readonly string[]): number {
  return sourceUrls.filter((sourceUrl) => sourceUrl.trim().length > 0).length;
}

function confidenceFromSourceCount(sourceCount: number): VerdictConfidence {
  if (sourceCount >= 3) {
    return "high";
  }

  if (sourceCount === 2) {
    return "medium";
  }

  return "low";
}

export function mockClaimJudge(input: ClaimVerdictInput): ClaimVerdictResult {
  const normalizedClaim: string = input.claim.trim().toLowerCase();
  const sourcesChecked: number = getSourceCount(input.sourceUrls);

  if (
    normalizedClaim.includes("airdrop confirmed") ||
    normalizedClaim.includes("guaranteed airdrop")
  ) {
    return {
      verdict: "unclear",
      confidence: "medium",
      summary:
        "Airdrop claims often require official confirmation. The provided evidence is not enough for a definitive verdict in this mock flow.",
      sourcesChecked,
      generatedAt: input.generatedAt,
    };
  }

  if (normalizedClaim.includes("scam") && sourcesChecked < 2) {
    return {
      verdict: "unclear",
      confidence: "low",
      summary:
        "The claim uses high-risk language, but there are not enough sources for a stronger mock verdict.",
      sourcesChecked,
      generatedAt: input.generatedAt,
    };
  }

  if (
    (normalizedClaim.includes("testnet is live") ||
      normalizedClaim.includes("mainnet is live")) &&
    sourcesChecked >= 2
  ) {
    return {
      verdict: "true",
      confidence: "high",
      summary:
        "The claim matches a launch-status pattern and has multiple sources, so the mock verdict treats it as supported.",
      sourcesChecked,
      generatedAt: input.generatedAt,
    };
  }

  if (normalizedClaim.includes("ended") || normalizedClaim.includes("expired")) {
    return {
      verdict: "outdated",
      confidence: "medium",
      summary:
        "The claim appears time-sensitive and references an ended or expired state, so the mock verdict marks it as outdated.",
      sourcesChecked,
      generatedAt: input.generatedAt,
    };
  }

  return {
    verdict: "unclear",
    confidence: confidenceFromSourceCount(sourcesChecked),
    summary:
      "The mock judge could not determine a stronger verdict from the local rules. More or better evidence would improve confidence.",
    sourcesChecked,
    generatedAt: input.generatedAt,
  };
}
