import type { NetworkDetectionState, WalletConnectionState } from "../lib/wallet";
import { getShortAddress } from "../lib/wallet";
import { AboutGenLayerMenu } from "./AboutGenLayerMenu";

type SiteHeaderProps = {
  walletState: WalletConnectionState;
  networkState: NetworkDetectionState;
  targetNetworkLabel: string;
  onConnectWallet: () => void;
};

function WalletIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 4.5h11.5A2.5 2.5 0 0 1 17 7v8.5H3A2 2 0 0 1 1 13.5v-7a2 2 0 0 1 2-2Zm0 2a.5.5 0 0 0 0 1h12V7a.5.5 0 0 0-.5-.5H3Zm0 3v4h12v-4H3Zm8.5 1h2v2h-2v-2Z" />
    </svg>
  );
}

export function SiteHeader({
  walletState,
  networkState,
  targetNetworkLabel,
  onConnectWallet,
}: SiteHeaderProps) {
  const isConnected = walletState.status === "connected" && walletState.address !== null;
  const isConnecting = walletState.status === "connecting";
  const walletUnavailable = walletState.status === "not_detected";
  const isNetworkReady = networkState.status === "connected_supported";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand-lockup" href="#top" aria-label="Consenza home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>
            <strong>Consenza</strong>
            <small>Built on GenLayer</small>
          </span>
        </a>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a className="nav-link" href="#capabilities">Product</a>
          <a className="nav-link" href="#workspace">Workspace</a>
          <AboutGenLayerMenu />
        </nav>

        <div className="header-actions">
          <span className={`network-chip ${isNetworkReady ? "is-ready" : ""}`}>
            <span className="status-light" aria-hidden="true" />
            {targetNetworkLabel}
          </span>

          {isConnected ? (
            <span className="header-wallet-connected" aria-label="Wallet connected">
              <WalletIcon />
              {getShortAddress(walletState.address ?? "")}
            </span>
          ) : (
            <button
              className="header-wallet-button"
              type="button"
              onClick={onConnectWallet}
              disabled={isConnecting || walletUnavailable}
            >
              <WalletIcon />
              {isConnecting ? "Connecting..." : walletUnavailable ? "Wallet unavailable" : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
