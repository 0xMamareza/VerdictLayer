import type { NetworkDetectionState } from "../lib/wallet";

type NetworkStatusCardProps = {
  networkState: NetworkDetectionState;
  targetNetworkLabel: string;
  onRefreshNetwork: () => void;
  onSwitchNetwork: () => void;
  isSwitchingNetwork: boolean;
};

function getNetworkStatusText(networkState: NetworkDetectionState): string {
  if (networkState.status === "connected_supported" && networkState.networkLabel) {
    return `Connected to ${networkState.networkLabel}. Wallet is on a supported GenLayer network.`;
  }

  if (networkState.status === "connected_unsupported") {
    return "Wallet is connected to an unsupported network. Switch before real transactions.";
  }

  if (networkState.status === "checking") {
    return "Checking connected wallet network...";
  }

  if (networkState.status === "not_connected") {
    return "Wallet detected, but not connected.";
  }

  if (networkState.status === "error") {
    return networkState.errorMessage ?? "Network detection failed.";
  }

  return "No injected wallet detected.";
}

export function NetworkStatusCard({
  networkState,
  targetNetworkLabel,
  onRefreshNetwork,
  onSwitchNetwork,
  isSwitchingNetwork,
}: NetworkStatusCardProps) {
  const isChecking = networkState.status === "checking";
  const isBusy = isChecking || isSwitchingNetwork;
  const showUnsupportedWarning = networkState.status === "connected_unsupported";
  const isSupported = networkState.status === "connected_supported";

  return (
    <section className="network-card connection-panel" aria-label="Network status">
      <div>
        <header className="connection-panel-heading">
          <span className="connection-panel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <circle cx="5" cy="6" r="2" />
              <circle cx="19" cy="6" r="2" />
              <circle cx="5" cy="18" r="2" />
              <circle cx="19" cy="18" r="2" />
              <path d="m7 7.5 3 2.5m4 0 3-2.5M7 16.5l3-2.5m4 0 3 2.5" />
            </svg>
          </span>
          <div>
            <p className="panel-label">Execution</p>
            <h4>Network</h4>
          </div>
          <span className={`panel-status ${isSupported ? "is-ready" : ""}`}>
            <span className="status-light" aria-hidden="true" />
            {isSupported ? "Ready" : "Check network"}
          </span>
        </header>
        <p className="network-target">Target / {targetNetworkLabel}</p>
        <p className="network-status">{getNetworkStatusText(networkState)}</p>

        {showUnsupportedWarning ? (
          <p className="network-warning">
            Wallet is connected to an unsupported network. Switch before real transactions.
          </p>
        ) : null}

        {networkState.chainIdHex ? (
          <dl className="network-details">
            <div>
              <dt>Chain ID</dt>
              <dd>{networkState.chainIdHex}</dd>
            </div>
            {networkState.chainIdDecimal !== null ? (
              <div>
                <dt>Decimal</dt>
                <dd>{networkState.chainIdDecimal}</dd>
              </div>
            ) : null}
            {networkState.networkLabel ? (
              <div>
                <dt>Network</dt>
                <dd>{networkState.networkLabel}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <p className="network-note">
          Network changes use your wallet's standard approval flow. No switch runs automatically.
        </p>
      </div>

      <div className="network-actions">
        <button
          className="module-button network-button"
          type="button"
          onClick={onSwitchNetwork}
          disabled={isBusy}
        >
          {isSwitchingNetwork ? "Switching..." : `Switch to ${targetNetworkLabel}`}
        </button>
        <button
          className="module-button network-button network-button-secondary"
          type="button"
          onClick={onRefreshNetwork}
          disabled={isBusy}
        >
          {isChecking ? "Checking..." : "Refresh Network"}
        </button>
      </div>
    </section>
  );
}
