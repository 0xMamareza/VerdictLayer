import { INTEGRATION_MODE } from "../config/integration";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";
import { verdictLayerMockClient } from "./verdictLayerMockClient";
import { verdictLayerRealClient } from "./verdictLayerRealClient";

export const verdictLayerClient: VerdictLayerClient = {
  // Claim and Task are production-enabled in the staged GenLayer rollout.
  submitClaimVerdict(input, context) {
    return INTEGRATION_MODE === "genlayer"
      ? verdictLayerRealClient.submitClaimVerdict(input, context)
      : verdictLayerMockClient.submitClaimVerdict(input, context);
  },

  submitTaskVerdict(input, context) {
    return INTEGRATION_MODE === "genlayer"
      ? verdictLayerRealClient.submitTaskVerdict(input, context)
      : verdictLayerMockClient.submitTaskVerdict(input, context);
  },

  // Dispute remains mock until the final separately verified migration.
  submitDisputeVerdict(input, context) {
    return verdictLayerMockClient.submitDisputeVerdict(input, context);
  },
};
