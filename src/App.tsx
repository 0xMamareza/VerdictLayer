import { useEffect, useState } from "react";
import "./App.css";
import { ClaimVerdictForm } from "./components/ClaimVerdictForm";
import { DisputeVerdictForm } from "./components/DisputeVerdictForm";
import { NetworkStatusCard } from "./components/NetworkStatusCard";
import { TaskVerdictForm } from "./components/TaskVerdictForm";
import { WalletStatusCard } from "./components/WalletStatusCard";
import {
  DEFAULT_TARGET_GENLAYER_NETWORK_KEY,
  getGenLayerNetworkByKey,
  getKnownGenLayerNetworkByChainId,
} from "./config/genlayerNetworks";
import { verdictModules, type VerdictModule, type VerdictModuleId } from "./config/modules";
import {
  getInjectedEthereumProvider,
  getWalletChainId,
  parseHexChainIdToDecimal,
  requestWalletAccounts,
  switchOrAddWalletNetwork,
  type NetworkDetectionState,
  type WalletConnectionState,
} from "./lib/wallet";

const targetGenLayerNetwork = getGenLayerNetworkByKey(DEFAULT_TARGET_GENLAYER_NETWORK_KEY);

function getReadableErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

function getNotDetectedNetworkState(): NetworkDetectionState {
  return {
    status: "not_detected",
    chainIdHex: null,
    chainIdDecimal: null,
    networkLabel: null,
    errorMessage: null,
  };
}

function getNotConnectedNetworkState(): NetworkDetectionState {
  return {
    status: "not_connected",
    chainIdHex: null,
    chainIdDecimal: null,
    networkLabel: null,
    errorMessage: null,
  };
}

function getNetworkStateFromChainId(chainIdHex: string): NetworkDetectionState {
  const knownNetwork = getKnownGenLayerNetworkByChainId(chainIdHex);
  const chainIdDecimal = knownNetwork?.chainIdDecimal ?? parseHexChainIdToDecimal(chainIdHex);

  if (knownNetwork) {
    return {
      status: "connected_supported",
      chainIdHex: knownNetwork.chainIdHex,
      chainIdDecimal,
      networkLabel: knownNetwork.label,
      errorMessage: null,
    };
  }

  return {
    status: "connected_unsupported",
    chainIdHex,
    chainIdDecimal,
    networkLabel: null,
    errorMessage: null,
  };
}

function App() {
  const [selectedModuleId, setSelectedModuleId] = useState<VerdictModuleId | null>(null);
  const [walletState, setWalletState] = useState<WalletConnectionState>({
    status: "not_detected",
    address: null,
    errorMessage: null,
    isMetaMask: false,
  });
  const [networkState, setNetworkState] = useState<NetworkDetectionState>(
    getNotDetectedNetworkState,
  );
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState<boolean>(false);

  useEffect(() => {
    const provider = getInjectedEthereumProvider();

    setWalletState({
      status: provider ? "disconnected" : "not_detected",
      address: null,
      errorMessage: null,
      isMetaMask: provider?.isMetaMask === true,
    });
    setNetworkState(provider ? getNotConnectedNetworkState() : getNotDetectedNetworkState());
  }, []);

  const selectedModule: VerdictModule | undefined = verdictModules.find(
    (module) => module.id === selectedModuleId,
  );

  function detectConnectedWalletNetwork(): void {
    const provider = getInjectedEthereumProvider();

    if (!provider) {
      setNetworkState(getNotDetectedNetworkState());
      return;
    }

    setNetworkState({
      status: "checking",
      chainIdHex: null,
      chainIdDecimal: null,
      networkLabel: null,
      errorMessage: null,
    });

    void getWalletChainId()
      .then((chainIdHex) => {
        setNetworkState(getNetworkStateFromChainId(chainIdHex));
      })
      .catch((error: unknown) => {
        setNetworkState({
          status: "error",
          chainIdHex: null,
          chainIdDecimal: null,
          networkLabel: null,
          errorMessage: getReadableErrorMessage(error, "Network detection failed."),
        });
      });
  }

  function handleRefreshNetwork(): void {
    const provider = getInjectedEthereumProvider();

    if (!provider) {
      setNetworkState(getNotDetectedNetworkState());
      return;
    }

    if (walletState.status !== "connected") {
      setNetworkState(getNotConnectedNetworkState());
      return;
    }

    detectConnectedWalletNetwork();
  }

  function handleSwitchNetwork(): void {
    const provider = getInjectedEthereumProvider();

    if (!provider) {
      setNetworkState(getNotDetectedNetworkState());
      return;
    }

    if (walletState.status !== "connected") {
      setNetworkState(getNotConnectedNetworkState());
      return;
    }

    setIsSwitchingNetwork(true);

    void switchOrAddWalletNetwork(targetGenLayerNetwork)
      .then(() => getWalletChainId())
      .then((chainIdHex) => {
        setNetworkState(getNetworkStateFromChainId(chainIdHex));
      })
      .catch((error: unknown) => {
        setNetworkState({
          status: "error",
          chainIdHex: null,
          chainIdDecimal: null,
          networkLabel: null,
          errorMessage: getReadableErrorMessage(error, "Network switch failed."),
        });
      })
      .finally(() => {
        setIsSwitchingNetwork(false);
      });
  }

  function handleConnectWallet(): void {
    const provider = getInjectedEthereumProvider();

    setWalletState({
      status: "connecting",
      address: null,
      errorMessage: null,
      isMetaMask: provider?.isMetaMask === true,
    });

    void requestWalletAccounts()
      .then((accounts) => {
        const address = accounts[0];

        if (!address) {
          throw new Error("Wallet did not return an account address.");
        }

        setWalletState({
          status: "connected",
          address,
          errorMessage: null,
          isMetaMask: provider?.isMetaMask === true,
        });
        detectConnectedWalletNetwork();
      })
      .catch((error: unknown) => {
        setWalletState({
          status: "error",
          address: null,
          errorMessage: getReadableErrorMessage(error, "Wallet connection failed."),
          isMetaMask: provider?.isMetaMask === true,
        });
        setNetworkState(provider ? getNotConnectedNetworkState() : getNotDetectedNetworkState());
      });
  }

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="product-title">
        <p className="eyebrow">GenLayer-powered MVP</p>
        <h1 id="product-title">VerdictLayer</h1>
        <p className="tagline">AI-native verdicts for claims, tasks, and disputes.</p>
        <p className="description">
          VerdictLayer is a GenLayer-powered MVP for turning messy evidence into structured
          verdicts across Web3 claims, builder submissions, and small disputes.
        </p>
      </section>

      <div className="status-card-grid">
        <WalletStatusCard walletState={walletState} onConnect={handleConnectWallet} />
        <NetworkStatusCard
          networkState={networkState}
          targetNetworkLabel={targetGenLayerNetwork.label}
          onRefreshNetwork={handleRefreshNetwork}
          onSwitchNetwork={handleSwitchNetwork}
          isSwitchingNetwork={isSwitchingNetwork}
        />
      </div>

      <section className="module-grid" aria-label="VerdictLayer modules">
        {verdictModules.map((module) => (
          <article className="module-card" key={module.id}>
            <div className="module-card-header">
              <h2>{module.title}</h2>
              <span className="status-badge">{module.status}</span>
            </div>
            <p>{module.description}</p>
            <button
              className="module-button"
              type="button"
              onClick={() => setSelectedModuleId(module.id)}
            >
              Open Module
            </button>
          </article>
        ))}
      </section>

      {selectedModule ? (
        <section className="selected-panel" aria-live="polite">
          <p className="panel-label">Selected module</p>
          <h2>{selectedModule.title}</h2>
          <p>{selectedModule.description}</p>
          <span className="status-badge">{selectedModule.status}</span>

          {selectedModule.id === "claim-verdicts" ? <ClaimVerdictForm /> : null}
          {selectedModule.id === "task-verdicts" ? <TaskVerdictForm /> : null}
          {selectedModule.id === "dispute-verdicts" ? <DisputeVerdictForm /> : null}
        </section>
      ) : null}
    </main>
  );
}

export default App;
