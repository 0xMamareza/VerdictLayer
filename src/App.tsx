import { useEffect, useState } from "react";
import "./App.css";
import { BuilderSignature } from "./components/BuilderSignature";
import { ClaimVerdictForm } from "./components/ClaimVerdictForm";
import { DisputeVerdictForm } from "./components/DisputeVerdictForm";
import { GenLayerReadDiagnostics } from "./components/GenLayerReadDiagnostics";
import { GenLayerWriteDiagnostics } from "./components/GenLayerWriteDiagnostics";
import { LandingHero } from "./components/LandingHero";
import { NetworkStatusCard } from "./components/NetworkStatusCard";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { TaskVerdictForm } from "./components/TaskVerdictForm";
import { WalletStatusCard } from "./components/WalletStatusCard";
import {
  DEFAULT_TARGET_GENLAYER_NETWORK_KEY,
  getGenLayerNetworkByKey,
  getKnownGenLayerNetworkByChainId,
} from "./config/genlayerNetworks";
import { INTEGRATION_MODE, SHOW_GENLAYER_DIAGNOSTICS } from "./config/integration";
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

const capabilityContent = [
  {
    id: "claim-verdicts" as const,
    index: "01",
    title: "Claim Decisions",
    description: "Evaluate claims against submitted evidence.",
    label: "Evidence verification",
  },
  {
    id: "task-verdicts" as const,
    index: "02",
    title: "Task Reviews",
    description: "Review completed work and identify missing proof.",
    label: "Submission review",
  },
  {
    id: "dispute-verdicts" as const,
    index: "03",
    title: "Dispute Resolutions",
    description: "Compare both sides and produce a structured resolution.",
    label: "Evidence resolution",
  },
] as const;

const workflowSteps = [
  { index: "01", title: "Submit Evidence", detail: "Structure the claim, proof, or dispute context." },
  { index: "02", title: "Confirm in Wallet", detail: "Review and approve the GenLayer transaction." },
  { index: "03", title: "Read the Decision", detail: "Receive the typed result from contract state." },
] as const;

function WorkflowGlyph({ moduleId }: { moduleId: VerdictModuleId }) {
  if (moduleId === "claim-verdicts") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v12H8l-4 4V4Zm3 4h10M7 12h7" />
      </svg>
    );
  }

  if (moduleId === "task-verdicts") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10v3h3v13H4V7h3V4Zm2 0v4h6V4H9Zm-1 9 2.5 2.5L16 10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v18M6 6h12M7 6l-4 7h8L7 6Zm10 0-4 7h8l-4-7ZM8 21h8" />
    </svg>
  );
}

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
  const isWalletConnected = walletState.status === "connected";
  const isOnSupportedGenLayerNetwork = networkState.status === "connected_supported";

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

  const connectionReady = isWalletConnected && isOnSupportedGenLayerNetwork;

  return (
    <>
      <SiteHeader
        walletState={walletState}
        networkState={networkState}
        targetNetworkLabel={targetGenLayerNetwork.label}
        onConnectWallet={handleConnectWallet}
      />

      <main>
        <div className="page-shell">
          <LandingHero />

          <section className="capabilities-section" id="capabilities" aria-labelledby="capabilities-title">
            <div className="section-heading-row">
              <div>
                <p className="section-eyebrow">Decision infrastructure</p>
                <h2 id="capabilities-title">Three workflows. One decision layer.</h2>
              </div>
              <p>Purpose-built evidence surfaces for Web3 coordination.</p>
            </div>

            <div className="capability-grid">
              {capabilityContent.map((capability) => (
                <article className="capability-card" key={capability.id}>
                  <div className="capability-card-topline">
                    <span>{capability.index}</span>
                    <span>{capability.label}</span>
                  </div>
                  <span className="capability-icon">
                    <WorkflowGlyph moduleId={capability.id} />
                  </span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="process-section" aria-labelledby="process-title">
            <div className="process-heading">
              <p className="section-eyebrow">Consensus path</p>
              <h2 id="process-title">From evidence to outcome.</h2>
            </div>
            <ol className="process-list">
              {workflowSteps.map((step) => (
                <li key={step.index}>
                  <span className="process-index">{step.index}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="workspace-section" id="workspace" aria-labelledby="workspace-title">
          <div className="workspace-inner">
            <div className="workspace-heading">
              <p className="section-eyebrow">Consenza Workspace</p>
              <h2 id="workspace-title">Choose a decision workflow.</h2>
              <p>
                Every GenLayer submission requires a connected wallet, a supported network, and
                manual approval.
              </p>
            </div>

            <aside className="testnet-notice" aria-label="Testnet safety notice">
              <span className="notice-signal" aria-hidden="true">
                <span />
              </span>
              <div>
                <strong>Testnet environment</strong>
                <p>
                  Consenza currently uses GenLayer Studionet. Use a burner/dev wallet, review
                  every transaction before approval, and never share wallet secrets.
                </p>
              </div>
            </aside>

            <section className="connection-dock" aria-labelledby="connection-title">
              <header className="connection-dock-header">
                <div>
                  <p className="panel-label">Connection layer</p>
                  <h3 id="connection-title">Wallet &amp; network</h3>
                </div>
                <span className={`connection-summary ${connectionReady ? "is-ready" : ""}`}>
                  <span className="status-light" aria-hidden="true" />
                  {connectionReady ? "Ready for submission" : "Setup required"}
                </span>
              </header>
              <div className="connection-grid">
                <WalletStatusCard walletState={walletState} onConnect={handleConnectWallet} />
                <NetworkStatusCard
                  networkState={networkState}
                  targetNetworkLabel={targetGenLayerNetwork.label}
                  onRefreshNetwork={handleRefreshNetwork}
                  onSwitchNetwork={handleSwitchNetwork}
                  isSwitchingNetwork={isSwitchingNetwork}
                />
              </div>
            </section>

            <div className="module-switcher" role="tablist" aria-label="Decision workflows">
              {verdictModules.map((module) => {
                const capability = capabilityContent.find((item) => item.id === module.id);
                const isActive = selectedModuleId === module.id;

                return (
                  <button
                    className={`module-tab ${isActive ? "is-active" : ""}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="workflow-panel"
                    onClick={() => setSelectedModuleId(module.id)}
                    key={module.id}
                  >
                    <span className="module-tab-icon">
                      <WorkflowGlyph moduleId={module.id} />
                    </span>
                    <span className="module-tab-copy">
                      <strong>{module.title}</strong>
                      <small>{capability?.label}</small>
                    </span>
                    <span className="module-active-marker">{isActive ? "Active" : "Open"}</span>
                  </button>
                );
              })}
            </div>

            <section
              className={`workspace-panel ${selectedModule ? "has-workflow" : ""}`}
              id="workflow-panel"
              role="tabpanel"
              aria-live="polite"
            >
              {selectedModule ? (
                <>
                  <header className="workspace-panel-header">
                    <div>
                      <p className="panel-label">Active workflow</p>
                      <h3>{selectedModule.title}</h3>
                      <p>{selectedModule.description}</p>
                    </div>
                    <span className="runtime-badge">
                      <span className="status-light" aria-hidden="true" />
                      {INTEGRATION_MODE === "genlayer" ? "GenLayer mode" : "Mock mode"}
                    </span>
                  </header>

                  {selectedModule.id === "claim-verdicts" ? (
                    <ClaimVerdictForm
                      walletAddress={walletState.address}
                      isWalletConnected={isWalletConnected}
                      isSupportedGenLayerNetwork={isOnSupportedGenLayerNetwork}
                    />
                  ) : null}
                  {selectedModule.id === "task-verdicts" ? (
                    <TaskVerdictForm
                      walletAddress={walletState.address}
                      isWalletConnected={isWalletConnected}
                      isSupportedGenLayerNetwork={isOnSupportedGenLayerNetwork}
                    />
                  ) : null}
                  {selectedModule.id === "dispute-verdicts" ? (
                    <DisputeVerdictForm
                      walletAddress={walletState.address}
                      isWalletConnected={isWalletConnected}
                      isSupportedGenLayerNetwork={isOnSupportedGenLayerNetwork}
                    />
                  ) : null}
                </>
              ) : (
                <div className="workspace-empty-state">
                  <span className="empty-state-mark" aria-hidden="true">C / 00</span>
                  <h3>Select a workflow to begin.</h3>
                  <p>Choose Claim, Task, or Dispute above. Your inputs stay local until you submit.</p>
                </div>
              )}
            </section>

            {SHOW_GENLAYER_DIAGNOSTICS ? (
              <section className="technical-diagnostics" aria-label="Technical diagnostics">
                <header>
                  <p className="section-eyebrow">Technical verification</p>
                  <h2>GenLayer diagnostics</h2>
                </header>
                <GenLayerReadDiagnostics />
                <GenLayerWriteDiagnostics
                  walletAddress={walletState.address}
                  isWalletConnected={isWalletConnected}
                  isOnSupportedGenLayerNetwork={isOnSupportedGenLayerNetwork}
                />
              </section>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
      <BuilderSignature />
    </>
  );
}

export default App;
