import { useState } from "react";
import {
  GENLAYER_CONTRACT_ADDRESS,
  GENLAYER_NETWORK_NAME,
  INTEGRATION_MODE,
} from "../config/integration";
import type { GenLayerReadSmokeTestResult } from "../lib/genlayerReadSmokeTest";

function getReadableErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Read smoke test failed.";
}

function getDisplayedContractAddress(): string {
  const contractAddress = GENLAYER_CONTRACT_ADDRESS.trim();

  return contractAddress.length > 0 ? contractAddress : "missing";
}

export function GenLayerReadDiagnostics() {
  const [result, setResult] = useState<GenLayerReadSmokeTestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleRunSmokeTest(): void {
    setIsLoading(true);
    setErrorMessage(null);

    void import("../lib/genlayerReadSmokeTest")
      .then(({ runGenLayerReadSmokeTest }) => runGenLayerReadSmokeTest())
      .then((smokeTestResult) => {
        setResult(smokeTestResult);
      })
      .catch((error: unknown) => {
        setResult(null);
        setErrorMessage(getReadableErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <section className="diagnostics-card" aria-label="GenLayer read diagnostics">
      <div className="diagnostics-header">
        <div>
          <p className="panel-label">Diagnostics</p>
          <h2>GenLayer Read Diagnostics</h2>
          <p className="diagnostics-note">Read-only contract test. This does not send transactions.</p>
        </div>
        <button
          className="module-button diagnostics-button"
          type="button"
          onClick={handleRunSmokeTest}
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "Run Read Smoke Test"}
        </button>
      </div>

      <dl className="diagnostics-config">
        <div>
          <dt>Integration mode</dt>
          <dd>{INTEGRATION_MODE}</dd>
        </div>
        <div>
          <dt>Network name</dt>
          <dd>{GENLAYER_NETWORK_NAME}</dd>
        </div>
        <div>
          <dt>Contract address</dt>
          <dd>{getDisplayedContractAddress()}</dd>
        </div>
      </dl>

      {errorMessage ? <p className="form-error diagnostics-error">{errorMessage}</p> : null}

      {result ? (
        <div className="diagnostics-results" aria-live="polite">
          <div>
            <h3>Contract Version</h3>
            <pre>{result.contractVersion}</pre>
          </div>
          <div>
            <h3>Latest Claim</h3>
            <pre>{result.latestClaim}</pre>
          </div>
          <div>
            <h3>Latest Task</h3>
            <pre>{result.latestTask}</pre>
          </div>
          <div>
            <h3>Latest Dispute</h3>
            <pre>{result.latestDispute}</pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}
