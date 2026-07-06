import { useEffect, useState } from "react";
import "./App.css";
import { ClaimVerdictForm } from "./components/ClaimVerdictForm";
import { DisputeVerdictForm } from "./components/DisputeVerdictForm";
import { TaskVerdictForm } from "./components/TaskVerdictForm";
import { WalletStatusCard } from "./components/WalletStatusCard";
import { verdictModules, type VerdictModule, type VerdictModuleId } from "./config/modules";
import {
  getInjectedEthereumProvider,
  requestWalletAccounts,
  type WalletConnectionState,
} from "./lib/wallet";

function getReadableErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Wallet connection failed.";
}

function App() {
  const [selectedModuleId, setSelectedModuleId] = useState<VerdictModuleId | null>(null);
  const [walletState, setWalletState] = useState<WalletConnectionState>({
    status: "not_detected",
    address: null,
    errorMessage: null,
    isMetaMask: false,
  });

  useEffect(() => {
    const provider = getInjectedEthereumProvider();

    setWalletState({
      status: provider ? "disconnected" : "not_detected",
      address: null,
      errorMessage: null,
      isMetaMask: provider?.isMetaMask === true,
    });
  }, []);

  const selectedModule: VerdictModule | undefined = verdictModules.find(
    (module) => module.id === selectedModuleId,
  );

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
      })
      .catch((error: unknown) => {
        setWalletState({
          status: "error",
          address: null,
          errorMessage: getReadableErrorMessage(error),
          isMetaMask: provider?.isMetaMask === true,
        });
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

      <WalletStatusCard walletState={walletState} onConnect={handleConnectWallet} />

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
