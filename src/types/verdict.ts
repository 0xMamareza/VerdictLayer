// UI and local mock flow types. Future contract-facing payloads live in contractSchemas.ts.
export type ClaimVerdict = "true" | "false" | "unclear" | "outdated";

export type VerdictConfidence = "low" | "medium" | "high";

export type ClaimVerdictInput = {
  claim: string;
  sourceUrls: readonly string[];
  generatedAt: string;
};

export type ClaimVerdictResult = {
  verdict: ClaimVerdict;
  confidence: VerdictConfidence;
  summary: string;
  sourcesChecked: number;
  generatedAt: string;
};

export type TaskVerdictStatus = "accepted" | "needs_review" | "incomplete" | "rejected";

export type TaskVerdictInput = {
  taskTitle: string;
  taskRequirements: string;
  contractAddress: string;
  transactionHash: string;
  githubRepoUrl: string;
  explanation: string;
  generatedAt: string;
};

export type TaskVerdictResult = {
  status: TaskVerdictStatus;
  score: number;
  feedback: string;
  missingItems: string[];
  generatedAt: string;
};

export type DisputeVerdict = "side_a" | "side_b" | "split" | "unclear";

export type DisputeVerdictInput = {
  disputeTitle: string;
  sideAClaim: string;
  sideBClaim: string;
  evidence: string;
  decisionRule: string;
  generatedAt: string;
};

export type DisputeVerdictResult = {
  verdict: DisputeVerdict;
  confidence: VerdictConfidence;
  reason: string;
  recommendedResolution: string;
  generatedAt: string;
};
