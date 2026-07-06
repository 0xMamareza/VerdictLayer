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
      TaskVerdictForm.tsx
      TaskVerdictResultCard.tsx
      VerdictResultCard.tsx
    config/
      integration.ts
      modules.ts
    lib/
      README.md
      verdictLayerClient.ts
      verdictLayerClientTypes.ts
      verdictLayerMockClient.ts
      verdictLayerRealClient.ts
    types/
      contractSchemas.ts
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
