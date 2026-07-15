import type { WalletConnectionState } from "../lib/wallet";
import { getShortAddress } from "../lib/wallet";

type WalletStatusCardProps = {
  walletState: WalletConnectionState;
  onConnect: () => void;
};

function getWalletStatusText(walletState: WalletConnectionState): string {
  if (walletState.status === "connected" && walletState.address) {
    return `Connected: ${getShortAddress(walletState.address)}`;
  }

  if (walletState.status === "connecting") {
    return "Connecting to injected wallet...";
  }

  if (walletState.status === "disconnected") {
    return walletState.isMetaMask ? "MetaMask detected. Wallet is not connected." : "Injected wallet detected. Wallet is not connected.";
  }

  if (walletState.status === "error") {
    return walletState.errorMessage ?? "Wallet connection failed.";
  }

  return "No injected wallet detected.";
}

export function WalletStatusCard({ walletState, onConnect }: WalletStatusCardProps) {
  const canConnect = walletState.status === "disconnected" || walletState.status === "error";
  const isConnecting = walletState.status === "connecting";
  const isConnected = walletState.status === "connected" && walletState.address !== null;

  return (
    <section className="wallet-card connection-panel" aria-label="Wallet status">
      <div>
        <header className="connection-panel-heading">
          <span className="connection-panel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2a1 1 0 0 0 0 2h14V8a1 1 0 0 0-1-1H4Zm0 4v5h14v-5H4Zm10 1h2v2h-2v-2Z" />
            </svg>
          </span>
          <div>
            <p className="panel-label">Signer</p>
            <h4>Wallet</h4>
          </div>
          <span className={`panel-status ${isConnected ? "is-ready" : ""}`}>
            <span className="status-light" aria-hidden="true" />
            {isConnected ? "Connected" : "Not connected"}
          </span>
        </header>
        <p className="wallet-status technical-value">{getWalletStatusText(walletState)}</p>

        {walletState.status === "not_detected" ? (
          <p className="wallet-message">
            No browser wallet detected. Install MetaMask or another injected wallet to continue.
          </p>
        ) : null}

        <p className="wallet-note">
          Use a burner/dev wallet. Every GenLayer submission still requires manual approval.
        </p>
      </div>

      {canConnect || isConnecting ? (
        <button
          className="module-button wallet-button"
          type="button"
          onClick={onConnect}
          disabled={isConnecting}
        >
          <svg className="button-icon" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 4h12a2 2 0 0 1 2 2v9H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2a.5.5 0 0 0 0 1h12V6H3Zm8 3h4v3h-4V9Z" />
          </svg>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : null}
    </section>
  );
}
