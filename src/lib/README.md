# VerdictLayer Integration Boundary

This folder is the future integration boundary between React components and the VerdictLayer contract layer.

`verdictLayerClientTypes.ts` defines the stable client interface that React components depend on.

`verdictLayerMockClient.ts` is temporary. It exposes contract-shaped submit functions while still using local deterministic mock utilities internally.

`verdictLayerRealClient.ts` is a placeholder for future GenLayerJS integration. It intentionally throws until wallet, network, and contract decisions are made.

`verdictLayerClient.ts` is the active integration selector. It currently chooses the mock client because `INTEGRATION_MODE` is hardcoded to `"mock"` in `src/config/integration.ts`.

React components should call `verdictLayerClient`, not mock utilities or contract APIs directly.
