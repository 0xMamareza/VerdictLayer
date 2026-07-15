import { type FormEvent, useState } from "react";
import { INTEGRATION_MODE } from "../config/integration";
import { verdictLayerClient } from "../lib/verdictLayerClient";
import type { GenLayerWriteStatus } from "../lib/genlayerWriteTypes";
import type { TaskVerdictResult } from "../types/verdict";
import { TaskVerdictResultCard } from "./TaskVerdictResultCard";
import { TransactionReadiness } from "./TransactionReadiness";

type TaskVerdictFormProps = {
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
      return "Reading Task Review...";
    case "success":
      return "Submit Another Task";
    case "error":
      return "Retry GenLayer Submission";
    default:
      return "Submit Task to GenLayer";
  }
}

function getWriteStatusLabel(status: GenLayerWriteStatus): string {
  return status.replace(/_/g, " ");
}

export function TaskVerdictForm({
  walletAddress,
  isWalletConnected,
  isSupportedGenLayerNetwork,
}: TaskVerdictFormProps) {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskRequirements, setTaskRequirements] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [proofTransactionHash, setProofTransactionHash] = useState<string>("");
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [writeStatus, setWriteStatus] = useState<GenLayerWriteStatus>("idle");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [result, setResult] = useState<TaskVerdictResult | null>(null);

  const isGenLayerMode = INTEGRATION_MODE === "genlayer";
  const hasWalletAddress = walletAddress !== null && walletAddress.trim().length > 0;
  const isGenLayerReady =
    isWalletConnected && hasWalletAddress && isSupportedGenLayerNetwork;
  const isGenLayerSubmitDisabled =
    !isGenLayerReady || isSubmitting || isWriteRunning(writeStatus);

  function hasProofField(): boolean {
    return [contractAddress, proofTransactionHash, githubRepoUrl, explanation].some(
      (value) => value.trim().length > 0,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedTaskTitle: string = taskTitle.trim();
    const trimmedTaskRequirements: string = taskRequirements.trim();

    setSubmitError(null);
    setTransactionHash(null);
    setWriteStatus(isGenLayerMode ? "validating" : "idle");

    if (trimmedTaskTitle.length === 0) {
      setErrorMessage(
        isGenLayerMode
          ? "Enter a task title to submit to GenLayer."
          : "Enter a task title to generate a mock review.",
      );
      setResult(null);
      setWriteStatus("idle");
      return;
    }

    if (trimmedTaskRequirements.length === 0) {
      setErrorMessage(
        isGenLayerMode
          ? "Enter task requirements to submit to GenLayer."
          : "Enter task requirements to generate a mock review.",
      );
      setResult(null);
      setWriteStatus("idle");
      return;
    }

    if (!hasProofField()) {
      setErrorMessage(
        isGenLayerMode
          ? "Add at least one proof field before submitting to GenLayer."
          : "Add at least one proof field before generating a mock review.",
      );
      setResult(null);
      setWriteStatus("idle");
      return;
    }

    if (isGenLayerMode && !isWalletConnected) {
      setErrorMessage(null);
      setSubmitError("Connect your wallet before submitting a GenLayer task review.");
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
        taskTitle: trimmedTaskTitle,
        taskRequirements: trimmedTaskRequirements,
        contractAddress,
        transactionHash: proofTransactionHash,
        githubRepoUrl,
        explanation,
      };
      const nextResult: TaskVerdictResult = isGenLayerMode
        ? await verdictLayerClient.submitTaskVerdict(input, {
            walletAddress,
            isWalletConnected,
            isSupportedGenLayerNetwork,
            onStatusChange: setWriteStatus,
            onTransactionHash: setTransactionHash,
          })
        : await verdictLayerClient.submitTaskVerdict(input);

      setResult(nextResult);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : isGenLayerMode
            ? "Unable to submit the GenLayer task review."
            : "Unable to generate mock review.",
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
    <div className="task-flow">
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
              <strong>Task brief</strong>
              <small>Define the work and its acceptance criteria.</small>
            </span>
          </legend>
          <div className="task-brief-grid">
            <label className="form-field">
              <span className="field-label-row"><span>Task title</span><small>Required</small></span>
              <input
                type="text"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Example: Deploy verification contract"
              />
            </label>

            <label className="form-field">
              <span className="field-label-row"><span>Task requirements</span><small>Required</small></span>
              <textarea
                value={taskRequirements}
                onChange={(event) => setTaskRequirements(event.target.value)}
                placeholder="Describe acceptance criteria, proof requirements, demo, README, or screenshots."
                rows={6}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>
            <span className="form-section-index">02</span>
            <span>
              <strong>Proof package</strong>
              <small>Provide at least one proof field for review.</small>
            </span>
          </legend>
          <div className="proof-grid" aria-label="Submission proof">
            <label className="form-field">
              <span>Contract address</span>
              <input
                type="text"
                value={contractAddress}
                onChange={(event) => setContractAddress(event.target.value)}
                placeholder="0x..."
              />
            </label>

            <label className="form-field">
              <span>Transaction hash</span>
              <input
                type="text"
                value={proofTransactionHash}
                onChange={(event) => setProofTransactionHash(event.target.value)}
                placeholder="0x..."
              />
            </label>

            <label className="form-field">
              <span>GitHub repo URL</span>
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(event) => setGithubRepoUrl(event.target.value)}
                placeholder="https://github.com/example/repo"
              />
            </label>
          </div>

          <label className="form-field form-field-wide">
            <span>Explanation</span>
            <textarea
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              placeholder="Explain what was built, how it satisfies the task, and where reviewers should look."
              rows={6}
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
                ? "Reviewing..."
                : "Generate Mock Review"}
          </button>
        </div>
      </form>

      {isGenLayerMode ? (
        <p className="helper-text">
          The task review is read from the deployed contract after the transaction is accepted.
        </p>
      ) : (
        <>
          <p className="helper-text">
            This is a local mock review. GenLayer Intelligent Contract integration comes later.
          </p>
          <p className="helper-text">
            Async-ready: this flow is prepared for future wallet-signed GenLayer transactions.
          </p>
        </>
      )}

      {result ? (
        <TaskVerdictResultCard result={result} source={isGenLayerMode ? "genlayer" : "mock"} />
      ) : null}
    </div>
  );
}
