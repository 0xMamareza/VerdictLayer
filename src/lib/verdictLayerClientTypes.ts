import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";
import type { GenLayerWriteStatus } from "./genlayerWriteTypes";

export type VerdictLayerSubmitContext = {
  walletAddress: string | null;
  isWalletConnected: boolean;
  isSupportedGenLayerNetwork: boolean;
  onStatusChange?: (status: GenLayerWriteStatus) => void;
  onTransactionHash?: (txHash: string) => void;
};

export interface VerdictLayerClient {
  submitClaimVerdict(
    input: ClaimVerdictContractInput,
    context?: VerdictLayerSubmitContext,
  ): Promise<ClaimVerdictContractResult>;
  submitTaskVerdict(
    input: TaskVerdictContractInput,
    context?: VerdictLayerSubmitContext,
  ): Promise<TaskVerdictContractResult>;
  submitDisputeVerdict(
    input: DisputeVerdictContractInput,
    context?: VerdictLayerSubmitContext,
  ): Promise<DisputeVerdictContractResult>;
}
