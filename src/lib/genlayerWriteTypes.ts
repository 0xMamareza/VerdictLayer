export type GenLayerWriteStatus =
  | "idle"
  | "validating"
  | "wallet_required"
  | "wrong_network"
  | "submitting_transaction"
  | "waiting_for_receipt"
  | "reading_result"
  | "success"
  | "error";

export type GenLayerWriteResult = {
  txHash: string | null;
  receiptStatus: string | null;
  rawResult: string | null;
  errorMessage: string | null;
};

export type VerdictLayerWriteMethod =
  | "submit_claim_verdict"
  | "submit_task_verdict"
  | "submit_dispute_verdict";

export type VerdictLayerReadAfterWriteMethod =
  | "get_latest_claim_verdict"
  | "get_latest_task_verdict"
  | "get_latest_dispute_verdict";

