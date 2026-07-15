type TransactionReadinessProps = {
  isReady: boolean;
  isWalletReady: boolean;
  isNetworkReady: boolean;
};

export function TransactionReadiness({
  isReady,
  isWalletReady,
  isNetworkReady,
}: TransactionReadinessProps) {
  return (
    <section className={`claim-genlayer-readiness ${isReady ? "is-ready" : "is-warning"}`}>
      <header className="readiness-header">
        <div>
          <p className="panel-label">Transaction gate</p>
          <h3>GenLayer readiness</h3>
        </div>
        <span className="readiness-state">
          <span className="status-light" aria-hidden="true" />
          {isReady ? "Ready" : "Action required"}
        </span>
      </header>
      <div className="readiness-checks">
        <span>
          <small>Wallet</small>
          <strong>{isWalletReady ? "Connected" : "Required"}</strong>
        </span>
        <span>
          <small>Network</small>
          <strong>{isNetworkReady ? "Supported" : "Required"}</strong>
        </span>
      </div>
      <p>Submitting sends a real wallet-signed transaction and always requires approval.</p>
    </section>
  );
}
