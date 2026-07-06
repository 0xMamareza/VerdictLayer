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

  return (
    <section className="wallet-card" aria-label="Wallet status">
      <div>
        <p className="panel-label">Wallet</p>
        <h2>Wallet</h2>
        <p className="wallet-status">{getWalletStatusText(walletState)}</p>

        {walletState.status === "not_detected" ? (
          <p className="wallet-message">
            No browser wallet detected. Install MetaMask or another injected wallet to test real
            GenLayer transactions later.
          </p>
        ) : null}

        <p className="wallet-note">
          Wallet connection is prepared for future GenLayer transactions. Current verdict flows
          still run in mock mode.
        </p>
      </div>

      {canConnect || isConnecting ? (
        <button
          className="module-button wallet-button"
          type="button"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : null}
    </section>
  );
}

