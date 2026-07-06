# VerdictLayer Architecture

## Current Architecture

VerdictLayer currently uses a Vite, React, and TypeScript frontend-only architecture. The app is a single-page shell with module metadata stored in `src/config/modules.ts` and simple module selection state managed in `src/App.tsx`.

## Future Architecture

Future versions should add mocked verdict flows first, then introduce GenLayer-specific integration in isolated steps. Contract work should live separately from the frontend until the product flows are clear and stable.

## Planned Folder Structure

```text
verdictlayer/
  contracts/
    DEPLOYMENT_REPORT.md
    README.md
    VERDICTLAYER_CONTRACT_SPEC.md
    verdict_layer.py
    verdict_layer_skeleton.py
  INTEGRATION_CHECKLIST.md
  README.md
  SUBMISSION_CHECKLIST.md
  DEMO_SCRIPT.md
  .env.example
  src/
    components/
      ClaimVerdictForm.tsx
      DisputeVerdictForm.tsx
      DisputeVerdictResultCard.tsx
      NetworkStatusCard.tsx
      TaskVerdictForm.tsx
      TaskVerdictResultCard.tsx
      VerdictResultCard.tsx
      WalletStatusCard.tsx
    config/
      genlayerNetworks.ts
      integration.ts
      modules.ts
    lib/
      README.md
      verdictLayerClient.ts
      verdictLayerClientTypes.ts
      verdictLayerMockClient.ts
      verdictLayerRealClient.ts
      wallet.ts
    types/
      contractSchemas.ts
      ethereum.ts
      verdict.ts
    utils/
      mockClaimJudge.ts
      mockDisputeResolver.ts
      mockTaskJudge.ts
    App.css
    App.tsx
    main.tsx
  ARCHITECTURE.md
  PROJECT_CONTEXT.md
```

## Build Phases

Phase 1: frontend shell

Phase 2: Claim Verdicts mock flow

Claim Verdicts mock flow implemented locally with deterministic mock logic. No GenLayer integration yet.

Phase 3: Task Verdicts mock flow

Task Verdicts mock flow implemented locally with deterministic scoring logic. No GenLayer integration yet.

Phase 4: Dispute Verdicts mock flow

Dispute Verdicts mock flow implemented locally with deterministic resolution logic. No GenLayer integration yet.

Phase 5: GenLayer Intelligent Contract

Contract-facing TypeScript schemas and GenLayer contract interface specification were added. No real GenLayer contract or frontend integration yet.

Phase 6: GenLayer frontend integration

Frontend flows now use a contract-boundary mock client. This isolates future GenLayerJS integration from React components.

Integration client abstraction added. React components now depend on verdictLayerClient instead of the mock client directly.

## Integration Readiness

Integration checklist added, and `.env.example` now documents planned GenLayer runtime variables. The real client remains a placeholder, and mock mode remains the only active runtime mode.

## Contract Deployment Milestone

The v0.1 deterministic contract was deployed in GenLayer Studio. It stores latest JSON-like result strings for claim, task, and dispute modules.

Frontend integration is still intentionally separated through the client boundary layer.

## Submission-Ready MVP

The frontend and contract are intentionally decoupled. The frontend demonstrates the UX for all three verdict modules, while the contract demonstrates GenLayer deployment and the method interface.

The future step is replacing the mock client with real GenLayer integration through the existing client boundary layer.

## Async Client Boundary

All module submits now use async client calls. This prepares the UI for wallet-signed GenLayer transactions while keeping mock mode as the active runtime.

No real GenLayerJS integration has been added yet.

## Wallet Preparation Layer

Injected wallet detection and a wallet account request flow have been added for future GenLayer transactions. There is no network switching yet, and no real GenLayer transaction calls have been implemented.

Runtime remains in mock mode, so Claim, Task, and Dispute verdict flows continue to work without a connected wallet.

## Network Detection Layer

Static GenLayer network metadata has been added for Studionet and Bradbury. The app can read the connected wallet chain id with `eth_chainId` and display whether the wallet is on a supported GenLayer network.

No real GenLayer transactions are sent from the detection layer. Runtime remains in mock mode.

## Network Switching Layer

Wallet network switching support has been added with `wallet_switchEthereumChain`, plus a `wallet_addEthereumChain` fallback when the target GenLayer chain is missing from the wallet. The target network defaults to Studionet, while Bradbury metadata is prepared for later use.

No real GenLayer writes have been added yet. Runtime remains in mock mode.
