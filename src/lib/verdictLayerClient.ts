import { INTEGRATION_MODE } from "../config/integration";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";
import { verdictLayerMockClient } from "./verdictLayerMockClient";
import { verdictLayerRealClient } from "./verdictLayerRealClient";

export const verdictLayerClient: VerdictLayerClient = {
  // Claim is the first production module in the staged GenLayer rollout.
  submitClaimVerdict(input, context) {
    return INTEGRATION_MODE === "genlayer"
      ? verdictLayerRealClient.submitClaimVerdict(input, context)
      : verdictLayerMockClient.submitClaimVerdict(input, context);
  },

  // Task and Dispute remain mock until their separately verified migrations.
  submitTaskVerdict(input, context) {
    return verdictLayerMockClient.submitTaskVerdict(input, context);
  },

  submitDisputeVerdict(input, context) {
    return verdictLayerMockClient.submitDisputeVerdict(input, context);
  },
};
