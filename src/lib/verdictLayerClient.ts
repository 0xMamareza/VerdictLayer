import { INTEGRATION_MODE } from "../config/integration";
import type { VerdictLayerClient } from "./verdictLayerClientTypes";
import { verdictLayerMockClient } from "./verdictLayerMockClient";
import { verdictLayerRealClient } from "./verdictLayerRealClient";

export const verdictLayerClient: VerdictLayerClient =
  INTEGRATION_MODE === "mock" ? verdictLayerMockClient : verdictLayerRealClient;
