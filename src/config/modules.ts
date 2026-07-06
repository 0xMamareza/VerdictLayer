export type VerdictModuleId = "claim-verdicts" | "task-verdicts" | "dispute-verdicts";

export type VerdictModuleStatus = "Planned";

export type VerdictModule = {
  id: VerdictModuleId;
  title: string;
  description: string;
  status: VerdictModuleStatus;
};

export const verdictModules: readonly VerdictModule[] = [
  {
    id: "claim-verdicts",
    title: "Claim Verdicts",
    description: "Verify Web3 claims by collecting evidence and preparing structured verdict outputs.",
    status: "Planned",
  },
  {
    id: "task-verdicts",
    title: "Task Verdicts",
    description: "Review builder and bounty submissions against clear task requirements.",
    status: "Planned",
  },
  {
    id: "dispute-verdicts",
    title: "Dispute Verdicts",
    description: "Resolve small evidence-based disagreements with consistent verdict records.",
    status: "Planned",
  },
] as const;
