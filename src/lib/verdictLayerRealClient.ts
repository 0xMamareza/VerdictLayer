import type {
  ClaimVerdictContractInput,
  ClaimVerdictContractResult,
  DisputeVerdictContractInput,
  DisputeVerdictContractResult,
  TaskVerdictContractInput,
  TaskVerdictContractResult,
} from "../types/contractSchemas";
import type { VerdictLayerReadMethodName } from "./genlayerReadClient";
import type {
  VerdictLayerClient,
  VerdictLayerSubmitContext,
} from "./verdictLayerClientTypes";

function throwNotImplemented(): never {
  throw new Error(
    "This production GenLayer write integration is not implemented yet. See INTEGRATION_CHECKLIST.md.",
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isClaimVerdict(value: unknown): value is ClaimVerdictContractResult["verdict"] {
  return value === "true" || value === "false" || value === "unclear" || value === "outdated";
}

function isClaimConfidence(value: unknown): value is ClaimVerdictContractResult["confidence"] {
  return value === "low" || value === "medium" || value === "high";
}

function parseClaimVerdictResult(rawResult: string): ClaimVerdictContractResult {
  let parsedResult: unknown;

  try {
    parsedResult = JSON.parse(rawResult) as unknown;
  } catch {
    throw new Error("GenLayer returned an invalid Claim verdict result.");
  }

  if (
    !isRecord(parsedResult) ||
    !isClaimVerdict(parsedResult.verdict) ||
    !isClaimConfidence(parsedResult.confidence) ||
    typeof parsedResult.summary !== "string" ||
    typeof parsedResult.sourcesChecked !== "number" ||
    !Number.isFinite(parsedResult.sourcesChecked) ||
    typeof parsedResult.generatedAt !== "string"
  ) {
    throw new Error("GenLayer returned an invalid Claim verdict result.");
  }

  return {
    verdict: parsedResult.verdict,
    confidence: parsedResult.confidence,
    summary: parsedResult.summary,
    sourcesChecked: parsedResult.sourcesChecked,
    generatedAt: parsedResult.generatedAt,
  };
}

function isTaskVerdictStatus(value: unknown): value is TaskVerdictContractResult["status"] {
  return (
    value === "accepted" ||
    value === "needs_review" ||
    value === "incomplete" ||
    value === "rejected"
  );
}

function normalizeTaskMissingItems(value: unknown): string[] | null {
  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (normalizedValue.toLowerCase() === "none") {
      return [];
    }

    return normalizedValue
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return [...value];
  }

  return null;
}

function parseTaskVerdictResult(rawResult: string): TaskVerdictContractResult {
  let parsedResult: unknown;

  try {
    parsedResult = JSON.parse(rawResult) as unknown;
  } catch {
    throw new Error("GenLayer returned an invalid Task verdict result.");
  }

  if (!isRecord(parsedResult)) {
    throw new Error("GenLayer returned an invalid Task verdict result.");
  }

  const missingItems = normalizeTaskMissingItems(parsedResult.missingItems);

  if (
    !isTaskVerdictStatus(parsedResult.status) ||
    typeof parsedResult.score !== "number" ||
    !Number.isFinite(parsedResult.score) ||
    typeof parsedResult.feedback !== "string" ||
    missingItems === null ||
    typeof parsedResult.generatedAt !== "string"
  ) {
    throw new Error("GenLayer returned an invalid Task verdict result.");
  }

  return {
    status: parsedResult.status,
    score: parsedResult.score,
    feedback: parsedResult.feedback,
    missingItems,
    generatedAt: parsedResult.generatedAt,
  };
}

function getValidatedWalletAddress(context?: VerdictLayerSubmitContext): string {
  if (!context || !context.isWalletConnected) {
    throw new Error("Connect your wallet before submitting a GenLayer verdict.");
  }

  if (!context.walletAddress || context.walletAddress.trim().length === 0) {
    throw new Error("Connected wallet address is missing.");
  }

  if (!context.isSupportedGenLayerNetwork) {
    throw new Error("Switch to a supported GenLayer network before submitting.");
  }

  return context.walletAddress;
}

function getValidatedTaskWalletAddress(context?: VerdictLayerSubmitContext): string {
  if (!context || !context.isWalletConnected) {
    throw new Error("Connect your wallet before submitting a GenLayer task review.");
  }

  if (!context.walletAddress || context.walletAddress.trim().length === 0) {
    throw new Error("Connected wallet address is missing.");
  }

  if (!context.isSupportedGenLayerNetwork) {
    throw new Error("Switch to a supported GenLayer network before submitting.");
  }

  return context.walletAddress;
}

async function readVerdictLayerRaw(methodName: VerdictLayerReadMethodName): Promise<string> {
  const { readVerdictLayerString } = await import("./genlayerReadClient");

  return readVerdictLayerString(methodName);
}

export async function getContractVersion(): Promise<string> {
  return readVerdictLayerRaw("get_contract_version");
}

export async function getLatestClaimVerdictRaw(): Promise<string> {
  return readVerdictLayerRaw("get_latest_claim_verdict");
}

export async function getLatestTaskVerdictRaw(): Promise<string> {
  return readVerdictLayerRaw("get_latest_task_verdict");
}

export async function getLatestDisputeVerdictRaw(): Promise<string> {
  return readVerdictLayerRaw("get_latest_dispute_verdict");
}

export const verdictLayerRealClient: VerdictLayerClient = {
  async submitClaimVerdict(
    input: ClaimVerdictContractInput,
    context?: VerdictLayerSubmitContext,
  ): Promise<ClaimVerdictContractResult> {
    const walletAddress = getValidatedWalletAddress(context);
    const { submitClaimVerdictTransaction } = await import("./genlayerWriteClient");
    const writeResult = await submitClaimVerdictTransaction(input, walletAddress, {
      onStatusChange: context?.onStatusChange,
      onTransactionHash: context?.onTransactionHash,
    });

    if (writeResult.errorMessage) {
      context?.onStatusChange?.("error");
      throw new Error(writeResult.errorMessage);
    }

    try {
      const rawResult = await getLatestClaimVerdictRaw();
      const result = parseClaimVerdictResult(rawResult);

      context?.onStatusChange?.("success");
      return result;
    } catch (error: unknown) {
      context?.onStatusChange?.("error");
      throw error;
    }
  },
  async submitTaskVerdict(
    input: TaskVerdictContractInput,
    context?: VerdictLayerSubmitContext,
  ): Promise<TaskVerdictContractResult> {
    const walletAddress = getValidatedTaskWalletAddress(context);
    const { submitTaskVerdictTransaction } = await import("./genlayerWriteClient");
    const writeResult = await submitTaskVerdictTransaction(input, walletAddress, {
      onStatusChange: context?.onStatusChange,
      onTransactionHash: context?.onTransactionHash,
    });

    if (writeResult.errorMessage) {
      context?.onStatusChange?.("error");
      throw new Error(writeResult.errorMessage);
    }

    try {
      const rawResult = await getLatestTaskVerdictRaw();
      const result = parseTaskVerdictResult(rawResult);

      context?.onStatusChange?.("success");
      return result;
    } catch (error: unknown) {
      context?.onStatusChange?.("error");
      throw error;
    }
  },
  async submitDisputeVerdict(
    _input: DisputeVerdictContractInput,
    _context?: VerdictLayerSubmitContext,
  ): Promise<DisputeVerdictContractResult> {
    return throwNotImplemented();
  },
};
