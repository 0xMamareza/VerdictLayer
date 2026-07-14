import { type FormEvent, useState } from "react";
import { INTEGRATION_MODE } from "../config/integration";
import { verdictLayerClient } from "../lib/verdictLayerClient";
import type { GenLayerWriteStatus } from "../lib/genlayerWriteTypes";
import type { ClaimVerdictResult } from "../types/verdict";
import { VerdictResultCard } from "./VerdictResultCard";

const emptySourceUrls: readonly string[] = ["", "", ""];

type ClaimVerdictFormProps = {
  walletAddress: string | null;
  isWalletConnected: boolean;
  isSupportedGenLayerNetwork: boolean;
};

function isWriteRunning(status: GenLayerWriteStatus): boolean {
  return (
    status === "validating" ||
    status === "submitting_transaction" ||
    status === "waiting_for_receipt" ||
    status === "reading_result"
  );
}

function getGenLayerButtonLabel(status: GenLayerWriteStatus): string {
  switch (status) {
    case "validating":
      return "Preparing...";
    case "submitting_transaction":
      return "Confirm in Wallet...";
    case "waiting_for_receipt":
      return "Waiting for Receipt...";
    case "reading_result":
      return "Reading Verdict...";
    case "success":
      return "Submit Another Claim";
    case "error":
      return "Retry GenLayer Submission";
    default:
      return "Submit Claim to GenLayer";
  }
}

function getWriteStatusLabel(status: GenLayerWriteStatus): string {
  return status.replace(/_/g, " ");
}

export function ClaimVerdictForm({
  walletAddress,
  isWalletConnected,
  isSupportedGenLayerNetwork,
}: ClaimVerdictFormProps) {
  const [claim, setClaim] = useState<string>("");
  const [sourceUrls, setSourceUrls] = useState<string[]>([...emptySourceUrls]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [writeStatus, setWriteStatus] = useState<GenLayerWriteStatus>("idle");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [result, setResult] = useState<ClaimVerdictResult | null>(null);

  const isGenLayerMode = INTEGRATION_MODE === "genlayer";
  const hasWalletAddress = walletAddress !== null && walletAddress.trim().length > 0;
  const isGenLayerReady =
    isWalletConnected && hasWalletAddress && isSupportedGenLayerNetwork;
  const isGenLayerSubmitDisabled =
    !isGenLayerReady || isSubmitting || isWriteRunning(writeStatus);

  function updateSourceUrl(index: number, value: string): void {
    setSourceUrls((currentSourceUrls) =>
      currentSourceUrls.map((sourceUrl, sourceIndex) =>
        sourceIndex === index ? value : sourceUrl,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedClaim: string = claim.trim();
    const hasSourceUrl: boolean = sourceUrls.some((sourceUrl) => sourceUrl.trim().length > 0);

    setSubmitError(null);
    setTransactionHash(null);
    setWriteStatus(isGenLayerMode ? "validating" : "idle");

    if (trimmedClaim.length === 0) {
      setErrorMessage(
        isGenLayerMode
          ? "Enter a claim to submit to GenLayer."
          : "Enter a claim to generate a mock verdict.",
      );
      setResult(null);
      setWriteStatus("idle");
      return;
    }

    if (!hasSourceUrl) {
      setErrorMessage("Add at least one source URL.");
      setResult(null);
      setWriteStatus("idle");
      return;
    }

    if (isGenLayerMode && !isWalletConnected) {
      setErrorMessage(null);
      setSubmitError("Connect your wallet before submitting a GenLayer verdict.");
      setWriteStatus("wallet_required");
      return;
    }

    if (isGenLayerMode && !walletAddress) {
      setErrorMessage(null);
      setSubmitError("Connected wallet address is missing.");
      setWriteStatus("wallet_required");
      return;
    }

    if (isGenLayerMode && !isSupportedGenLayerNetwork) {
      setErrorMessage(null);
      setSubmitError("Switch to a supported GenLayer network before submitting.");
      setWriteStatus("wrong_network");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const input = {
        claim: trimmedClaim,
        sourceUrl1: sourceUrls[0] ?? "",
        sourceUrl2: sourceUrls[1] ?? "",
        sourceUrl3: sourceUrls[2] ?? "",
      };
      const nextResult: ClaimVerdictResult = isGenLayerMode
        ? await verdictLayerClient.submitClaimVerdict(input, {
            walletAddress,
            isWalletConnected,
            isSupportedGenLayerNetwork,
            onStatusChange: setWriteStatus,
            onTransactionHash: setTransactionHash,
          })
        : await verdictLayerClient.submitClaimVerdict(input);

      setResult(nextResult);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : isGenLayerMode
            ? "Unable to submit the GenLayer verdict."
            : "Unable to generate mock verdict.",
      );
      setResult(null);

      if (isGenLayerMode) {
        setWriteStatus("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="claim-flow">
      <form className="claim-form" onSubmit={handleSubmit}>
        {isGenLayerMode ? (
          <div
            className={`claim-genlayer-readiness ${isGenLayerReady ? "is-ready" : "is-warning"}`}
          >
            <h3>GenLayer transaction readiness</h3>
            <p>Wallet: {isWalletConnected && hasWalletAddress ? "connected" : "required"}</p>
            <p>
              Supported GenLayer network: {isSupportedGenLayerNetwork ? "ready" : "required"}
            </p>
            <p>This submission sends a real wallet-signed transaction.</p>
          </div>
        ) : null}

        <label className="form-field">
          <span>Claim</span>
          <textarea
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            placeholder="Example: GenLayer testnet is live"
            rows={5}
          />
        </label>

        <div className="source-grid" aria-label="Evidence sources">
          {sourceUrls.map((sourceUrl, index) => (
            <label className="form-field" key={`source-url-${index + 1}`}>
              <span>Source URL {index + 1}</span>
              <input
                type="url"
                value={sourceUrl}
                onChange={(event) => updateSourceUrl(index, event.target.value)}
                placeholder="https://example.com/evidence"
              />
            </label>
          ))}
        </div>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        {submitError ? <p className="form-error">{submitError}</p> : null}

        {isGenLayerMode ? (
          <p
            className={`claim-transaction-status ${writeStatus === "success" ? "is-success" : ""}`}
          >
            Transaction status: {getWriteStatusLabel(writeStatus)}
          </p>
        ) : null}

        {isGenLayerMode && transactionHash ? (
          <div className="claim-transaction-hash" aria-live="polite">
            <span>Transaction Hash</span>
            <code>{transactionHash}</code>
          </div>
        ) : null}

        <button
          className={`module-button form-submit ${isGenLayerMode ? "real-submit" : ""}`}
          type="submit"
          disabled={isGenLayerMode ? isGenLayerSubmitDisabled : isSubmitting}
        >
          {isGenLayerMode
            ? getGenLayerButtonLabel(writeStatus)
            : isSubmitting
              ? "Generating..."
              : "Generate Mock Verdict"}
        </button>
      </form>

      {isGenLayerMode ? (
        <p className="helper-text">
          The verdict is read from the deployed contract after the transaction is accepted.
        </p>
      ) : (
        <>
          <p className="helper-text">
            This is a local mock verdict. GenLayer Intelligent Contract integration comes later.
          </p>
          <p className="helper-text">
            Async-ready: this flow is prepared for future wallet-signed GenLayer transactions.
          </p>
        </>
      )}

      {result ? (
        <VerdictResultCard result={result} source={isGenLayerMode ? "genlayer" : "mock"} />
      ) : null}
    </div>
  );
}
