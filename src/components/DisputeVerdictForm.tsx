import { type FormEvent, useState } from "react";
import { INTEGRATION_MODE } from "../config/integration";
import { verdictLayerClient } from "../lib/verdictLayerClient";
import type { GenLayerWriteStatus } from "../lib/genlayerWriteTypes";
import type { DisputeVerdictResult } from "../types/verdict";
import { DisputeVerdictResultCard } from "./DisputeVerdictResultCard";
import { TransactionReadiness } from "./TransactionReadiness";

type DisputeVerdictFormProps = {
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
      return "Reading Dispute Resolution...";
    case "success":
      return "Submit Another Dispute";
    case "error":
      return "Retry GenLayer Submission";
    default:
      return "Submit Dispute to GenLayer";
  }
}

function getWriteStatusLabel(status: GenLayerWriteStatus): string {
  return status.replace(/_/g, " ");
}

export function DisputeVerdictForm({
  walletAddress,
  isWalletConnected,
  isSupportedGenLayerNetwork,
}: DisputeVerdictFormProps) {
  const [disputeTitle, setDisputeTitle] = useState<string>("");
  const [sideAClaim, setSideAClaim] = useState<string>("");
  const [sideBClaim, setSideBClaim] = useState<string>("");
  const [evidence, setEvidence] = useState<string>("");
  const [decisionRule, setDecisionRule] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [writeStatus, setWriteStatus] = useState<GenLayerWriteStatus>("idle");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [result, setResult] = useState<DisputeVerdictResult | null>(null);

  const isGenLayerMode = INTEGRATION_MODE === "genlayer";
  const hasWalletAddress = walletAddress !== null && walletAddress.trim().length > 0;
  const isGenLayerReady =
    isWalletConnected && hasWalletAddress && isSupportedGenLayerNetwork;
  const isGenLayerSubmitDisabled =
    !isGenLayerReady || isSubmitting || isWriteRunning(writeStatus);

  function validateInputs(): string | null {
    if (disputeTitle.trim().length === 0) {
      return isGenLayerMode
        ? "Enter a dispute title to submit to GenLayer."
        : "Enter a dispute title to generate a mock resolution.";
    }

    if (sideAClaim.trim().length === 0) {
      return "Enter Side A's claim.";
    }

    if (sideBClaim.trim().length === 0) {
      return "Enter Side B's claim.";
    }

    if (evidence.trim().length === 0) {
      return "Add evidence for the dispute.";
    }

    if (decisionRule.trim().length === 0) {
      return "Add a decision rule for the dispute.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setSubmitError(null);
    setTransactionHash(null);
    setWriteStatus(isGenLayerMode ? "validating" : "idle");

    const validationMessage: string | null = validateInputs();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      setResult(null);
      setWriteStatus("idle");
      return;
    }

    if (isGenLayerMode && !isWalletConnected) {
      setErrorMessage(null);
      setSubmitError("Connect your wallet before submitting a GenLayer dispute.");
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
        disputeTitle: disputeTitle.trim(),
        sideAClaim: sideAClaim.trim(),
        sideBClaim: sideBClaim.trim(),
        evidence: evidence.trim(),
        decisionRule: decisionRule.trim(),
      };
      const nextResult: DisputeVerdictResult = isGenLayerMode
        ? await verdictLayerClient.submitDisputeVerdict(input, {
            walletAddress,
            isWalletConnected,
            isSupportedGenLayerNetwork,
            onStatusChange: setWriteStatus,
            onTransactionHash: setTransactionHash,
          })
        : await verdictLayerClient.submitDisputeVerdict(input);

      setResult(nextResult);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : isGenLayerMode
            ? "Unable to submit the GenLayer dispute."
            : "Unable to generate mock resolution.",
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
    <div className="dispute-flow">
      <form className="claim-form" onSubmit={handleSubmit}>
        {isGenLayerMode ? (
          <TransactionReadiness
            isReady={isGenLayerReady}
            isWalletReady={isWalletConnected && hasWalletAddress}
            isNetworkReady={isSupportedGenLayerNetwork}
          />
        ) : null}

        <fieldset className="form-section">
          <legend>
            <span className="form-section-index">01</span>
            <span>
              <strong>Dispute positions</strong>
              <small>Capture the issue and both sides of the claim.</small>
            </span>
          </legend>
          <label className="form-field">
            <span className="field-label-row"><span>Dispute title</span><small>Required</small></span>
            <input
              type="text"
              value={disputeTitle}
              onChange={(event) => setDisputeTitle(event.target.value)}
              placeholder="Example: Milestone payment dispute"
            />
          </label>

          <div className="dispute-grid" aria-label="Dispute claims">
            <label className="form-field">
              <span className="field-label-row"><span>Side A claim</span><small>Required</small></span>
              <textarea
                value={sideAClaim}
                onChange={(event) => setSideAClaim(event.target.value)}
                placeholder="Describe Side A's position."
                rows={6}
              />
            </label>

            <label className="form-field">
              <span className="field-label-row"><span>Side B claim</span><small>Required</small></span>
              <textarea
                value={sideBClaim}
                onChange={(event) => setSideBClaim(event.target.value)}
                placeholder="Describe Side B's position."
                rows={6}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>
            <span className="form-section-index">02</span>
            <span>
              <strong>Evidence &amp; decision rule</strong>
              <small>Define what should be considered and how to decide.</small>
            </span>
          </legend>
          <label className="form-field">
            <span className="field-label-row"><span>Evidence</span><small>Required</small></span>
            <textarea
              value={evidence}
              onChange={(event) => setEvidence(event.target.value)}
              placeholder="Paste the relevant evidence, messages, delivery notes, links, or agreement details."
              rows={7}
            />
          </label>

          <label className="form-field">
            <span className="field-label-row"><span>Decision rule</span><small>Required</small></span>
            <textarea
              value={decisionRule}
              onChange={(event) => setDecisionRule(event.target.value)}
              placeholder="Describe the rule the resolver should apply."
              rows={5}
            />
          </label>
        </fieldset>

        <div className="form-submit-area">
          {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
          {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}

          {isGenLayerMode ? (
            <p
              className={`claim-transaction-status ${writeStatus === "success" ? "is-success" : ""}`}
              aria-live="polite"
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
                ? "Resolving..."
                : "Generate Mock Resolution"}
          </button>
        </div>
      </form>

      {isGenLayerMode ? (
        <p className="helper-text">
          The dispute resolution is read from the deployed contract after the transaction is accepted.
        </p>
      ) : (
        <>
          <p className="helper-text">
            This is a local mock resolution. GenLayer Intelligent Contract integration comes later.
          </p>
          <p className="helper-text">
            Async-ready: this flow is prepared for future wallet-signed GenLayer transactions.
          </p>
        </>
      )}

      {result ? (
        <DisputeVerdictResultCard
          result={result}
          source={isGenLayerMode ? "genlayer" : "mock"}
        />
      ) : null}
    </div>
  );
}
