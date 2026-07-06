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

  return (
    <section className="network-card" aria-label="Network status">
      <div>
        <p className="panel-label">Network</p>
        <h2>Network</h2>
        <p className="network-target">Target: {targetNetworkLabel}</p>
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
          Network switching is prepared for future GenLayer transactions. Verdict flows still run
          in mock mode.
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
