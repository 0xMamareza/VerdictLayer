# VerdictLayer Public Deployment Readiness

## Current Status

- Public deployment preparation, the provider-neutral readiness audit, and the Vercel deployment are complete.
- The production build passes with the existing non-blocking Vite warnings documented below.
- Claim, Task, and Dispute production forms are connected to GenLayer behind `genlayer` mode and have been manually verified on Studionet.
- Deterministic mock fallback remains available through `mock` mode.
- The public deployment is live at https://verdict-layer-seven.vercel.app/.

## UI Redesign Deployment Status

- The premium GenLayer-themed redesign is complete, approved, and live.
- The static build remains compatible with a site-root Vercel deployment.
- Vercel serves the redesign successfully from the site root.
- The public visual, wallet/network, and three-module transaction reviews passed.

## Deployment Model

- VerdictLayer builds as a static Vite frontend.
- Wallet connection and transaction approval happen in the browser through an injected provider.
- There is no backend or database deployment dependency.
- The deployed GenLayer contract address is public configuration.
- Every `VITE_` variable is embedded in the browser bundle and must be treated as public.

## Required Environment Variables

| Variable | Purpose | Safe public deployment value | Requirement | Security note |
| --- | --- | --- | --- | --- |
| `VITE_VERDICTLAYER_INTEGRATION_MODE` | Selects local mock or real GenLayer client routing. | `genlayer` | Required for real public flows. | Invalid or missing values fall back to `mock`. |
| `VITE_GENLAYER_NETWORK_NAME` | Selects the configured GenLayer chain. | `studionet` | Required for the current deployment. | This is public network metadata. |
| `VITE_GENLAYER_RPC_URL` | Reserved optional RPC override. | Blank | Optional. | Never use an authenticated or private RPC URL in a frontend variable. The app currently uses the SDK's configured public chain defaults. |
| `VITE_VERDICTLAYER_CONTRACT_ADDRESS` | Identifies the deployed VerdictLayer contract. | `0xf7931C9C809b31B516b6C8fF199cA2e7819165d5` | Required for real reads and writes. | Contract addresses are public; this must never be replaced with a private key or wallet secret. |
| `VITE_SHOW_GENLAYER_DIAGNOSTICS` | Controls visibility of the technical read/write diagnostics panels. | `false` | Optional; defaults to `false`. | Set to `true` only for an intentional technical demonstration. |

## Recommended Public Values

```dotenv
VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer
VITE_GENLAYER_NETWORK_NAME=studionet
VITE_GENLAYER_RPC_URL=
VITE_VERDICTLAYER_CONTRACT_ADDRESS=0xf7931C9C809b31B516b6C8fF199cA2e7819165d5
VITE_SHOW_GENLAYER_DIAGNOSTICS=false
```

## Wallet Safety

- Use a burner or development wallet.
- Treat Studionet as a test environment and do not use mainnet assets.
- Every contract write requires an explicit user action and wallet approval.
- VerdictLayer never requests a seed phrase or private key.
- A rejected wallet request submits no transaction and produces no transaction hash.

## Diagnostics Policy

Read and write diagnostics are hidden unless `VITE_SHOW_GENLAYER_DIAGNOSTICS=true`. Production Claim, Task, and Dispute forms are unaffected by this flag.

Maintainers can enable diagnostics for a deliberate technical demo. Enabling them does not trigger a network request or transaction automatically, does not bypass wallet/network guards, and does not bypass wallet approval.

## Static Hosting Compatibility

- Build command: `npm run build`
- Output directory: `dist`
- Navigation uses React state rather than React Router or browser-history routes, so no SPA fallback rewrite is currently required.
- A generic static host can serve `dist/index.html` and `dist/assets` at the site root.
- Vite currently uses its default root base path. A provider that deploys under a repository subpath would require a base-path decision before deployment.
- Vercel is the selected hosting platform and serves the application at the domain root without a fallback rewrite.

## Known Non-Blocking Warnings

- When diagnostics are enabled, Vite has reported that `verdictLayerRealClient.ts` is both statically and dynamically imported, so the dynamic import does not create a separate chunk.
- The bundled GenLayer SDK chunk is approximately 523.53 kB after minification, above Vite's default 500 kB warning threshold.
- The GenLayer SDK bundle includes dormant built-in localnet endpoint constants. VerdictLayer source selects Studionet and contains no localhost runtime endpoint configuration.
- The production build succeeds. The GenLayer SDK chunk-size warning remains active; the conditional diagnostics import note is retained as historical readiness context.

## Public Deployment Completed

- Vercel deployment completed at https://verdict-layer-seven.vercel.app/.
- Site-root static hosting works.
- Public environment variables are configured for `genlayer` mode and Studionet.
- Diagnostics are hidden.
- The public smoke test passed.
- The public wallet/network test passed, including unsupported-network blocking and Studionet recovery.
- Claim, Task, and Dispute live transactions and read-after-write results passed.
- The public deployment readiness milestone is complete.

## Remaining Steps

1. Record the final demo.
2. Capture the final submission screenshots.
3. Complete the final submission description and repository review.
4. Deliver the builder submission.
