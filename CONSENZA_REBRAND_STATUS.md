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

This code phase does not rename or redeploy the verified contract, change integration behavior, rename the local project directory, or change external GitHub and Vercel resources.

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

- GitHub: https://github.com/0xMamareza/VerdictLayer
- Vercel: https://verdict-layer-seven.vercel.app/

These URLs remain active and intentionally unchanged during the local code phase.

## Pending Manual External Renames

- Rename the GitHub repository to Consenza.
- Update the local Git remote.
- Rename the Vercel project to `consenza` if available.
- Assign the new Vercel production domain.
- Confirm the GitHub integration remains connected.
- Update tracked URLs after external renames.
- Perform a public smoke test.
- Perform one no-transaction wallet/network check.

## Rollback

`cd314e17444d8c74dd38cb58fad8990333872580`

No external GitHub or Vercel rename is claimed as complete in this phase.
