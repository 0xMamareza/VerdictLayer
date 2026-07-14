import { createClient } from "genlayer-js";
import { studionet, testnetBradbury } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import {
  GENLAYER_CONTRACT_ADDRESS,
  GENLAYER_NETWORK_NAME,
} from "../config/integration";
import type {
  ClaimVerdictContractInput,
  DisputeVerdictContractInput,
  TaskVerdictContractInput,
} from "../types/contractSchemas";
import { getInjectedEthereumProvider } from "./wallet";
import type { GenLayerWriteResult, GenLayerWriteStatus } from "./genlayerWriteTypes";

type GenLayerWriteCallbacks = {
  onStatusChange?: (status: GenLayerWriteStatus) => void;
  onTransactionHash?: (txHash: string) => void;
};

function getSelectedGenLayerChain() {
  if (GENLAYER_NETWORK_NAME === "bradbury" || GENLAYER_NETWORK_NAME === "testnetBradbury") {
    return testnetBradbury;
  }

  return studionet;
}

function getConfiguredContractAddress(): `0x${string}` {
  const contractAddress = GENLAYER_CONTRACT_ADDRESS.trim();

  if (contractAddress.length === 0) {
    throw new Error("Missing VITE_VERDICTLAYER_CONTRACT_ADDRESS.");
  }

  if (!/^0x[0-9a-fA-F]+$/.test(contractAddress)) {
    throw new Error("VITE_VERDICTLAYER_CONTRACT_ADDRESS must be a hex contract address.");
  }

  return contractAddress as `0x${string}`;
}

function getConfiguredAccount(account: string): `0x${string}` {
  const normalizedAccount = account.trim();

  if (normalizedAccount.length === 0) {
    throw new Error("Wallet account is required before submitting a transaction.");
  }

  if (!/^0x[0-9a-fA-F]+$/.test(normalizedAccount)) {
    throw new Error("Wallet account must be a hex address.");
  }

  return normalizedAccount as `0x${string}`;
}

function getReadableErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallbackMessage;
}

function getTransactionHash(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getReceiptStatus(value: unknown): string | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  if ("statusName" in value) {
    const statusName = value.statusName;

    if (typeof statusName === "string") {
      return statusName;
    }
  }

  if ("status" in value) {
    const status = value.status;

    if (typeof status === "string" || typeof status === "number") {
      return String(status);
    }
  }

  return null;
}

async function submitVerdictTransaction(
  functionName:
    | "submit_claim_verdict"
    | "submit_task_verdict"
    | "submit_dispute_verdict",
  args: string[],
  account: string,
  fallbackErrorMessage: string,
  callbacks?: GenLayerWriteCallbacks,
): Promise<GenLayerWriteResult> {
  try {
    const provider = getInjectedEthereumProvider();

    if (!provider) {
      throw new Error("No injected wallet provider was detected.");
    }

    const client = createClient({
      chain: getSelectedGenLayerChain(),
      account: getConfiguredAccount(account),
      provider,
    });

    callbacks?.onStatusChange?.("submitting_transaction");

    const transactionHashResult: unknown = await client.writeContract({
      address: getConfiguredContractAddress(),
      functionName,
      args,
      value: 0n,
    });
    const txHash = getTransactionHash(transactionHashResult);

    if (!txHash) {
      throw new Error("GenLayer writeContract returned an unexpected transaction hash.");
    }

    callbacks?.onTransactionHash?.(txHash);
    callbacks?.onStatusChange?.("waiting_for_receipt");

    const receipt: unknown = await client.waitForTransactionReceipt({
      hash: txHash as `0x${string}` & { length: 66 },
      status: TransactionStatus.ACCEPTED,
    });

    callbacks?.onStatusChange?.("reading_result");

    return {
      txHash,
      receiptStatus: getReceiptStatus(receipt),
      rawResult: null,
      errorMessage: null,
    };
  } catch (error: unknown) {
    return {
      txHash: null,
      receiptStatus: null,
      rawResult: null,
      errorMessage: getReadableErrorMessage(error, fallbackErrorMessage),
    };
  }
}

export async function submitClaimVerdictTransaction(
  input: ClaimVerdictContractInput,
  account: string,
  options?: GenLayerWriteCallbacks,
): Promise<GenLayerWriteResult> {
  return submitVerdictTransaction(
    "submit_claim_verdict",
    [input.claim, input.sourceUrl1, input.sourceUrl2, input.sourceUrl3],
    account,
    "GenLayer claim write transaction failed.",
    options,
  );
}

export async function submitTaskVerdictTransaction(
  input: TaskVerdictContractInput,
  account: string,
  options?: GenLayerWriteCallbacks,
): Promise<GenLayerWriteResult> {
  return submitVerdictTransaction(
    "submit_task_verdict",
    [
      input.taskTitle,
      input.taskRequirements,
      input.contractAddress,
      input.transactionHash,
      input.githubRepoUrl,
      input.explanation,
    ],
    account,
    "GenLayer task write transaction failed.",
    options,
  );
}

export async function submitDisputeVerdictTransaction(
  input: DisputeVerdictContractInput,
  account: string,
): Promise<GenLayerWriteResult> {
  return submitVerdictTransaction(
    "submit_dispute_verdict",
    [
      input.disputeTitle,
      input.sideAClaim,
      input.sideBClaim,
      input.evidence,
      input.decisionRule,
    ],
    account,
    "GenLayer dispute write transaction failed.",
  );
}
