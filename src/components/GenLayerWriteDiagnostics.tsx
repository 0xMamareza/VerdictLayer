import { useState } from "react";
import { GENLAYER_CONTRACT_ADDRESS } from "../config/integration";
import type { ClaimVerdictContractInput } from "../types/contractSchemas";
import type { GenLayerWriteResult, GenLayerWriteStatus } from "../lib/genlayerWriteTypes";

const sampleClaimInput: ClaimVerdictContractInput = {
  claim: "GenLayer Bradbury testnet is live",
  sourceUrl1: "https://genlayer.com",
  sourceUrl2: "https://docs.genlayer.com",
  sourceUrl3: "",
};

type GenLayerWriteDiagnosticsProps = {
  walletAddress: string | null;
  isWalletConnected: boolean;
  isOnSupportedGenLayerNetwork: boolean;
};

function getContractAddressConfigured(): boolean {
  return GENLAYER_CONTRACT_ADDRESS.trim().length > 0;
}

function getReadableErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Claim write diagnostics failed.";
}

export function GenLayerWriteDiagnostics({
  walletAddress,
  isWalletConnected,
  isOnSupportedGenLayerNetwork,
}: GenLayerWriteDiagnosticsProps) {
  const [status, setStatus] = useState<GenLayerWriteStatus>("idle");
  const [result, setResult] = useState<GenLayerWriteResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasContractAddress = getContractAddressConfigured();
  const isRunning =
    status === "submitting_transaction" ||
    status === "waiting_for_receipt" ||
    status === "reading_result";
  const canSubmit =
    isWalletConnected &&
    walletAddress !== null &&
    isOnSupportedGenLayerNetwork &&
    hasContractAddress &&
    !isRunning;

  function handleSubmitClaimTransaction(): void {
    if (!walletAddress) {
      setStatus("wallet_required");
      setErrorMessage("Connect a wallet before submitting the diagnostics transaction.");
      return;
    }

    setStatus("submitting_transaction");
    setResult(null);
    setErrorMessage(null);

    void import("../lib/genlayerWriteClient")
      .then(({ submitClaimVerdictTransaction }) =>
        submitClaimVerdictTransaction(sampleClaimInput, walletAddress),
      )
      .then((writeResult) => {
        if (writeResult.errorMessage) {
          setStatus("error");
          setResult(writeResult);
          setErrorMessage(writeResult.errorMessage);
          return Promise.resolve(null);
        }

        setStatus("reading_result");

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

        setResult(completedResult);
        setStatus("success");
      })
      .catch((error: unknown) => {
        setStatus("error");
        setErrorMessage(getReadableErrorMessage(error));
      });
  }

  return (
    <section className="diagnostics-card write-diagnostics-card" aria-label="GenLayer write diagnostics">
      <div className="diagnostics-header">
        <div>
          <p className="panel-label">Diagnostics</p>
          <h2>GenLayer Write Diagnostics</h2>
          <p className="write-warning">
            Dev-only transaction test. This sends a real wallet-signed GenLayer transaction.
          </p>
        </div>
        <button
          className="module-button diagnostics-button"
          type="button"
          onClick={handleSubmitClaimTransaction}
          disabled={!canSubmit}
        >
          {isRunning ? "Submitting..." : "Submit Claim Test Transaction"}
        </button>
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

      <p className="write-status">Status: {status}</p>

      {errorMessage ? <p className="form-error diagnostics-error">{errorMessage}</p> : null}

      {result ? (
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
            <h3>Latest Claim Result</h3>
            <pre>{result.rawResult ?? "not read yet"}</pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}

