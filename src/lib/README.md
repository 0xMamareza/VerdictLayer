# VerdictLayer Integration Boundary

This folder is the future integration boundary between React components and the VerdictLayer contract layer.

`verdictLayerClientTypes.ts` defines the stable client interface that React components depend on.

The client interface is now async. Mock mode is still active, but the async shape matches the future GenLayer write/read transaction flow.

`verdictLayerMockClient.ts` is temporary. It exposes contract-shaped submit functions while still using local deterministic mock utilities internally.

`verdictLayerRealClient.ts` keeps submit/write methods blocked while exposing read-only helpers for deployed contract reads.

`genlayerReadClient.ts` is the read-only GenLayerJS wrapper. It does not send wallet-signed writes.

`verdictLayerClient.ts` is the active integration selector. It chooses mock mode by default unless `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer` is configured.

React components should call `verdictLayerClient`, not mock utilities or contract APIs directly.
