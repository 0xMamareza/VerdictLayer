import { INTEGRATION_MODE } from "../config/integration";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";
import { verdictLayerMockClient } from "./verdictLayerMockClient";
import { verdictLayerRealClient } from "./verdictLayerRealClient";

export const verdictLayerClient: VerdictLayerClient = {
  // All production modules use GenLayer only when the explicit mode is enabled.
  // Mock mode remains the safe fallback; diagnostics stay isolated from this router.
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

  submitDisputeVerdict(input, context) {
    return INTEGRATION_MODE === "genlayer"
      ? verdictLayerRealClient.submitDisputeVerdict(input, context)
      : verdictLayerMockClient.submitDisputeVerdict(input, context);
  },
};
