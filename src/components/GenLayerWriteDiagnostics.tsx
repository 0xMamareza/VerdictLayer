import { useState } from "react";
import { GENLAYER_CONTRACT_ADDRESS } from "../config/integration";
import type {
  ClaimVerdictContractInput,
  DisputeVerdictContractInput,
  TaskVerdictContractInput,
} from "../types/contractSchemas";
import type { GenLayerWriteResult, GenLayerWriteStatus } from "../lib/genlayerWriteTypes";

const sampleClaimInput: ClaimVerdictContractInput = {
  claim: "GenLayer Bradbury testnet is live",
  sourceUrl1: "https://genlayer.com",
  sourceUrl2: "https://docs.genlayer.com",
  sourceUrl3: "",
};

const sampleTaskInput: TaskVerdictContractInput = {
  taskTitle: "Deploy first GenLayer contract",
  taskRequirements: "Submit contract address, transaction hash, README, and screenshot.",
  contractAddress: "0x123456789",
  transactionHash: "0xtesthash123",
  githubRepoUrl: "https://github.com/0xMamareza/VerdictLayer",
  explanation:
    "Consenza uses its deterministic GenLayer contract and includes proof fields for the builder task validation flow.",
};

const sampleDisputeInput: DisputeVerdictContractInput = {
  disputeTitle: "Builder task review dispute",
  sideAClaim: "Side A says the task was completed.",
  sideBClaim: "Side B says the proof was incomplete.",
  evidence:
    "The evidence says side a completed the requested builder task and provided the required proof.",
  decisionRule: "Judge based on whether the submitted evidence shows the task was completed.",
};

type GenLayerWriteDiagnosticsProps = {
  walletAddress: string | null;
  isWalletConnected: boolean;
  isOnSupportedGenLayerNetwork: boolean;
};

function getContractAddressConfigured(): boolean {
  return GENLAYER_CONTRACT_ADDRESS.trim().length > 0;
}

function getReadableErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

function getWriteIsRunning(status: GenLayerWriteStatus): boolean {
  return (
    status === "submitting_transaction" ||
    status === "waiting_for_receipt" ||
    status === "reading_result"
  );
}

function renderWriteResult(result: GenLayerWriteResult | null, resultLabel: string) {
  if (!result) {
    return null;
  }

  return (
    <div className="diagnostics-results write-results" aria-live="polite">
      <div>
        <h3>Transaction Hash</h3>
        <pre>{result.txHash ?? "none"}</pre>
      </div>
      <div>
        <h3>Receipt Status</h3>
        <pre>{result.receiptStatus ?? "none"}</pre>
      </div>
      <div>
        <h3>{resultLabel}</h3>
        <pre>{result.rawResult ?? "not read yet"}</pre>
      </div>
    </div>
  );
}

export function GenLayerWriteDiagnostics({
  walletAddress,
  isWalletConnected,
  isOnSupportedGenLayerNetwork,
}: GenLayerWriteDiagnosticsProps) {
  const [claimStatus, setClaimStatus] = useState<GenLayerWriteStatus>("idle");
  const [claimResult, setClaimResult] = useState<GenLayerWriteResult | null>(null);
  const [claimErrorMessage, setClaimErrorMessage] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<GenLayerWriteStatus>("idle");
  const [taskResult, setTaskResult] = useState<GenLayerWriteResult | null>(null);
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);
  const [disputeStatus, setDisputeStatus] = useState<GenLayerWriteStatus>("idle");
  const [disputeResult, setDisputeResult] = useState<GenLayerWriteResult | null>(null);
  const [disputeErrorMessage, setDisputeErrorMessage] = useState<string | null>(null);

  const hasContractAddress = getContractAddressConfigured();
  const isClaimRunning = getWriteIsRunning(claimStatus);
  const isTaskRunning = getWriteIsRunning(taskStatus);
  const isDisputeRunning = getWriteIsRunning(disputeStatus);
  const canSubmitClaim =
    isWalletConnected &&
    walletAddress !== null &&
    isOnSupportedGenLayerNetwork &&
    hasContractAddress &&
    !isClaimRunning;
  const canSubmitTask =
    isWalletConnected &&
    walletAddress !== null &&
    isOnSupportedGenLayerNetwork &&
    hasContractAddress &&
    !isTaskRunning;
  const canSubmitDispute =
    isWalletConnected &&
    walletAddress !== null &&
    isOnSupportedGenLayerNetwork &&
    hasContractAddress &&
    !isDisputeRunning;

  function handleSubmitClaimTransaction(): void {
    if (!walletAddress) {
      setClaimStatus("wallet_required");
      setClaimErrorMessage("Connect a wallet before submitting the diagnostics transaction.");
      return;
    }

    setClaimStatus("submitting_transaction");
    setClaimResult(null);
    setClaimErrorMessage(null);

    void import("../lib/genlayerWriteClient")
      .then(({ submitClaimVerdictTransaction }) =>
        submitClaimVerdictTransaction(sampleClaimInput, walletAddress),
      )
      .then((writeResult) => {
        if (writeResult.errorMessage) {
          setClaimStatus("error");
          setClaimResult(writeResult);
          setClaimErrorMessage(writeResult.errorMessage);
          return Promise.resolve(null);
        }

        setClaimStatus("reading_result");

        return import("../lib/verdictLayerRealClient").then(({ getLatestClaimVerdictRaw }) =>
          getLatestClaimVerdictRaw().then((latestClaim) => ({
            ...writeResult,
            rawResult: latestClaim,
          })),
        );
      })
      .then((completedResult) => {
        if (!completedResult) {
          return;
        }

        setClaimResult(completedResult);
        setClaimStatus("success");
      })
      .catch((error: unknown) => {
        setClaimStatus("error");
        setClaimErrorMessage(getReadableErrorMessage(error, "Claim write diagnostics failed."));
      });
  }

  function handleSubmitTaskTransaction(): void {
    if (!walletAddress) {
      setTaskStatus("wallet_required");
      setTaskErrorMessage("Connect a wallet before submitting the diagnostics transaction.");
      return;
    }

    setTaskStatus("submitting_transaction");
    setTaskResult(null);
    setTaskErrorMessage(null);

    void import("../lib/genlayerWriteClient")
      .then(({ submitTaskVerdictTransaction }) =>
        submitTaskVerdictTransaction(sampleTaskInput, walletAddress),
      )
      .then((writeResult) => {
        if (writeResult.errorMessage) {
          setTaskStatus("error");
          setTaskResult(writeResult);
          setTaskErrorMessage(writeResult.errorMessage);
          return Promise.resolve(null);
        }

        setTaskStatus("reading_result");

        return import("../lib/verdictLayerRealClient").then(({ getLatestTaskVerdictRaw }) =>
          getLatestTaskVerdictRaw().then((latestTask) => ({
            ...writeResult,
            rawResult: latestTask,
          })),
        );
      })
      .then((completedResult) => {
        if (!completedResult) {
          return;
        }

        setTaskResult(completedResult);
        setTaskStatus("success");
      })
      .catch((error: unknown) => {
        setTaskStatus("error");
        setTaskErrorMessage(getReadableErrorMessage(error, "Task write diagnostics failed."));
      });
  }

  function handleSubmitDisputeTransaction(): void {
    if (!walletAddress) {
      setDisputeStatus("wallet_required");
      setDisputeErrorMessage("Connect a wallet before submitting the diagnostics transaction.");
      return;
    }

    setDisputeStatus("submitting_transaction");
    setDisputeResult(null);
    setDisputeErrorMessage(null);

    void import("../lib/genlayerWriteClient")
      .then(({ submitDisputeVerdictTransaction }) =>
        submitDisputeVerdictTransaction(sampleDisputeInput, walletAddress),
      )
      .then((writeResult) => {
        if (writeResult.errorMessage) {
          setDisputeStatus("error");
          setDisputeResult(writeResult);
          setDisputeErrorMessage(writeResult.errorMessage);
          return Promise.resolve(null);
        }

        setDisputeStatus("reading_result");

        return import("../lib/verdictLayerRealClient").then(({ getLatestDisputeVerdictRaw }) =>
          getLatestDisputeVerdictRaw().then((latestDispute) => ({
            ...writeResult,
            rawResult: latestDispute,
          })),
        );
      })
      .then((completedResult) => {
        if (!completedResult) {
          return;
        }

        setDisputeResult(completedResult);
        setDisputeStatus("success");
      })
      .catch((error: unknown) => {
        setDisputeStatus("error");
        setDisputeErrorMessage(
          getReadableErrorMessage(error, "Dispute write diagnostics failed."),
        );
      });
  }

  return (
    <section
      className="diagnostics-card write-diagnostics-card"
      aria-label="GenLayer write diagnostics"
    >
      <div className="diagnostics-header">
        <div>
          <p className="panel-label">Diagnostics</p>
          <h2>GenLayer Write Diagnostics</h2>
          <p className="write-warning">
            Dev-only transaction test. This sends a real wallet-signed GenLayer transaction.
          </p>
        </div>
      </div>

      <dl className="diagnostics-config">
        <div>
          <dt>Wallet connected</dt>
          <dd>{isWalletConnected ? "yes" : "no"}</dd>
        </div>
        <div>
          <dt>Supported network</dt>
          <dd>{isOnSupportedGenLayerNetwork ? "yes" : "no"}</dd>
        </div>
        <div>
          <dt>Contract configured</dt>
          <dd>{hasContractAddress ? "yes" : "no"}</dd>
        </div>
      </dl>

      <div className="write-test-section">
        <div className="write-test-header">
          <div>
            <h3>Claim Write Test</h3>
            <p>Dev-only Claim transaction test.</p>
          </div>
          <button
            className="module-button diagnostics-button"
            type="button"
            onClick={handleSubmitClaimTransaction}
            disabled={!canSubmitClaim}
          >
            {isClaimRunning ? "Submitting..." : "Submit Claim Test Transaction"}
          </button>
        </div>

        <div className="write-sample-panel">
          <h3>Sample Claim</h3>
          <dl>
            <div>
              <dt>Claim</dt>
              <dd>{sampleClaimInput.claim}</dd>
            </div>
            <div>
              <dt>Source 1</dt>
              <dd>{sampleClaimInput.sourceUrl1}</dd>
            </div>
            <div>
              <dt>Source 2</dt>
              <dd>{sampleClaimInput.sourceUrl2}</dd>
            </div>
          </dl>
        </div>

        <p className="write-status">Claim status: {claimStatus}</p>
        {claimErrorMessage ? (
          <p className="form-error diagnostics-error">{claimErrorMessage}</p>
        ) : null}
        {renderWriteResult(claimResult, "Latest Claim Result")}
      </div>

      <div className="write-test-section">
        <div className="write-test-header">
          <div>
            <h3>Task Write Test</h3>
            <p>Dev-only Task transaction test.</p>
          </div>
          <button
            className="module-button diagnostics-button"
            type="button"
            onClick={handleSubmitTaskTransaction}
            disabled={!canSubmitTask}
          >
            {isTaskRunning ? "Submitting..." : "Submit Task Test Transaction"}
          </button>
        </div>

        <div className="write-sample-panel">
          <h3>Sample Task</h3>
          <dl className="write-sample-grid">
            <div>
              <dt>Task title</dt>
              <dd>{sampleTaskInput.taskTitle}</dd>
            </div>
            <div>
              <dt>Requirements</dt>
              <dd>{sampleTaskInput.taskRequirements}</dd>
            </div>
            <div>
              <dt>Contract address</dt>
              <dd>{sampleTaskInput.contractAddress}</dd>
            </div>
            <div>
              <dt>Transaction hash</dt>
              <dd>{sampleTaskInput.transactionHash}</dd>
            </div>
            <div>
              <dt>GitHub repo</dt>
              <dd>{sampleTaskInput.githubRepoUrl}</dd>
            </div>
            <div>
              <dt>Explanation</dt>
              <dd>{sampleTaskInput.explanation}</dd>
            </div>
          </dl>
        </div>

        <p className="write-status">Task status: {taskStatus}</p>
        {taskErrorMessage ? (
          <p className="form-error diagnostics-error">{taskErrorMessage}</p>
        ) : null}
        {renderWriteResult(taskResult, "Latest Task Result")}
      </div>

      <div className="write-test-section">
        <div className="write-test-header">
          <div>
            <h3>Dispute Write Test</h3>
            <p>Dev-only Dispute transaction test.</p>
          </div>
          <button
            className="module-button diagnostics-button"
            type="button"
            onClick={handleSubmitDisputeTransaction}
            disabled={!canSubmitDispute}
          >
            {isDisputeRunning ? "Submitting..." : "Submit Dispute Test Transaction"}
          </button>
        </div>

        <div className="write-sample-panel">
          <h3>Sample Dispute</h3>
          <dl className="write-sample-grid">
            <div>
              <dt>Dispute title</dt>
              <dd>{sampleDisputeInput.disputeTitle}</dd>
            </div>
            <div>
              <dt>Side A claim</dt>
              <dd>{sampleDisputeInput.sideAClaim}</dd>
            </div>
            <div>
              <dt>Side B claim</dt>
              <dd>{sampleDisputeInput.sideBClaim}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{sampleDisputeInput.evidence}</dd>
            </div>
            <div>
              <dt>Decision rule</dt>
              <dd>{sampleDisputeInput.decisionRule}</dd>
            </div>
          </dl>
        </div>

        <p className="write-status">Dispute status: {disputeStatus}</p>
        {disputeErrorMessage ? (
          <p className="form-error diagnostics-error">{disputeErrorMessage}</p>
        ) : null}
        {renderWriteResult(disputeResult, "Latest Dispute Result")}
      </div>
    </section>
  );
}
