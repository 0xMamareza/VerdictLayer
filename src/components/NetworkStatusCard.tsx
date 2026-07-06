import type { NetworkDetectionState } from "../lib/wallet";

type NetworkStatusCardProps = {
  networkState: NetworkDetectionState;
  onRefreshNetwork: () => void;
};

function getNetworkStatusText(networkState: NetworkDetectionState): string {
  if (networkState.status === "connected_supported" && networkState.networkLabel) {
    return `Connected to ${networkState.networkLabel}.`;
  }

  if (networkState.status === "connected_unsupported") {
    return "Connected wallet is on a non-GenLayer network.";
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
  onRefreshNetwork,
}: NetworkStatusCardProps) {
  const isChecking = networkState.status === "checking";
  const showUnsupportedWarning = networkState.status === "connected_unsupported";

  return (
    <section className="network-card" aria-label="Network status">
      <div>
        <p className="panel-label">Network</p>
        <h2>Network</h2>
        <p className="network-status">{getNetworkStatusText(networkState)}</p>

        {showUnsupportedWarning ? (
          <p className="network-warning">
            This wallet is not connected to Studionet or Bradbury. Network switching will be added
            later.
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
          Network detection is read-only. Switching to GenLayer will be added later.
        </p>
      </div>

      <button
        className="module-button network-button"
        type="button"
        onClick={onRefreshNetwork}
        disabled={isChecking}
      >
        {isChecking ? "Checking..." : "Refresh Network"}
      </button>
    </section>
  );
}

