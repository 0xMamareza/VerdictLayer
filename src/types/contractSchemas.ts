export type VerdictModuleId = "claim" | "task" | "dispute";

export type ClaimVerdictContractInput = {
  claim: string;
  sourceUrl1: string;
  sourceUrl2: string;
  sourceUrl3: string;
};

export type ClaimVerdictContractResult = {
  verdict: "true" | "false" | "unclear" | "outdated";
  confidence: "low" | "medium" | "high";
  summary: string;
  sourcesChecked: number;
  generatedAt: string;
};

export type TaskVerdictContractInput = {
  taskTitle: string;
  taskRequirements: string;
  contractAddress: string;
  transactionHash: string;
  githubRepoUrl: string;
  explanation: string;
};

export type TaskVerdictContractResult = {
  status: "accepted" | "needs_review" | "incomplete" | "rejected";
  score: number;
  feedback: string;
  missingItems: string[];
  generatedAt: string;
};

export type DisputeVerdictContractInput = {
  disputeTitle: string;
  sideAClaim: string;
  sideBClaim: string;
  evidence: string;
  decisionRule: string;
};

export type DisputeVerdictContractResult = {
  verdict: "side_a" | "side_b" | "split" | "unclear";
  confidence: "low" | "medium" | "high";
  reason: string;
  recommendedResolution: string;
  generatedAt: string;
};
