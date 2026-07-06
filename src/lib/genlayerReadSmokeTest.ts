import {
  getContractVersion,
  getLatestClaimVerdictRaw,
  getLatestDisputeVerdictRaw,
  getLatestTaskVerdictRaw,
} from "./verdictLayerRealClient";

export type GenLayerReadSmokeTestResult = {
  contractVersion: string;
  latestClaim: string;
  latestTask: string;
  latestDispute: string;
};

export async function runGenLayerReadSmokeTest(): Promise<GenLayerReadSmokeTestResult> {
  const [contractVersion, latestClaim, latestTask, latestDispute] = await Promise.all([
    getContractVersion(),
    getLatestClaimVerdictRaw(),
    getLatestTaskVerdictRaw(),
    getLatestDisputeVerdictRaw(),
  ]);

  return {
    contractVersion,
    latestClaim,
    latestTask,
    latestDispute,
  };
}

