# Consenza Integration Boundary

This folder is the integration boundary between React components and the Consenza contract layer. The deployed Python class and existing TypeScript `verdictLayer` symbols retain their legacy names for compatibility.

`verdictLayerClientTypes.ts` defines the stable client interface that React components depend on.

The client interface is now async. Mock mode is still active, but the async shape matches the future GenLayer write/read transaction flow.

`verdictLayerMockClient.ts` exposes contract-shaped submit functions while using local deterministic mock utilities internally.

`verdictLayerRealClient.ts` implements the verified Claim, Task, and Dispute write/read paths for the deployed contract.

`genlayerReadClient.ts` is the read-only GenLayerJS wrapper. It does not send wallet-signed writes.

`verdictLayerClient.ts` is the active integration selector. It routes all three modules to mock mode by default unless `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer` is configured.

React components should call `verdictLayerClient`, not mock utilities or contract APIs directly.
