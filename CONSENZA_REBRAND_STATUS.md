# Consenza Rebrand Status

## Approved Name

Consenza

## Rebrand Scope

- Public UI
- Browser metadata
- Package metadata
- Documentation
- Reports
- Submission copy
- GitHub repository name
- Vercel project name and URL

The external rebrand changed public repository and hosting identifiers without renaming or redeploying the verified contract, changing integration behavior, or renaming the local project directory.

## Completed in This Code Phase

- Public interface name updated to Consenza.
- Approved tagline and supporting description applied.
- Workspace, header, footer, and browser metadata updated.
- Package metadata updated to `consenza`.
- Public documentation and submission copy updated.
- Public module labels refined to Claim Decisions, Task Reviews, and Dispute Resolutions.
- Contract specification renamed to `contracts/CONSENZA_CONTRACT_SPEC.md`.

## Preserved Technical Identifiers

- Python class: `VerdictLayer`
- Contract file: `contracts/verdict_layer.py`
- Contract version: `verdictlayer-v0.1-deterministic`
- Contract address: `0xf7931C9C809b31B516b6C8fF199cA2e7819165d5`
- Contract methods: `submit_claim_verdict`, `submit_task_verdict`, `submit_dispute_verdict`, `get_latest_claim_verdict`, `get_latest_task_verdict`, `get_latest_dispute_verdict`, and `get_contract_version`
- Environment variables: `VITE_VERDICTLAYER_INTEGRATION_MODE` and `VITE_VERDICTLAYER_CONTRACT_ADDRESS`
- TypeScript `VerdictLayerClient` and `verdictLayerClient` compatibility symbols
- Local directory name: `verdictlayer`
- Existing transaction hashes and deployment evidence

These values are compatibility internals, not public branding.

## Current External Identifiers

- GitHub: https://github.com/0xMamareza/Consenza
- Vercel: https://consenza-seven.vercel.app/

These are the active public repository and production application URLs.

## External Rebrand Completed

- GitHub repository renamed to Consenza.
- Local Git remote updated to the renamed repository.
- Vercel project renamed to `consenza`.
- New production domain assigned: https://consenza-seven.vercel.app/.
- Former production domain removed: https://verdict-layer-seven.vercel.app/.
- GitHub `main` branch and commit history preserved.
- Vercel Git integration remains functional.
- New public domain manually smoke-tested.
- Wallet and network flow manually verified without submitting a transaction.
- Consenza branding verified on the public deployment.
- Claim Decisions, Task Reviews, and Dispute Resolutions verified to render and navigate.
- Diagnostics verified hidden publicly.
- No contract redeployment or new transaction was performed for the external rebrand.

## Rollback

`cd314e17444d8c74dd38cb58fad8990333872580`
