# Consenza

Onchain decisions for claims, tasks, and disputes.

Submit evidence, review completed work, and resolve disputes through wallet-signed GenLayer workflows.

Built on GenLayer.

GitHub Repository: https://github.com/0xMamareza/VerdictLayer

## What Consenza Is

Consenza is a GenLayer-powered product for turning evidence into structured onchain decisions. It gives builders a focused interface for checking claims, reviewing task submissions, and resolving evidence-based disputes.

The public app demonstrates the production UX while the deployed GenLayer contract provides the verified read/write method interface.

## Why GenLayer

Consenza needs more than deterministic smart contract execution over fixed inputs. Future versions should evaluate natural-language evidence, compare claims against sources, and produce structured decisions from messy context.

GenLayer is a strong fit because Intelligent Contracts can eventually combine on-chain execution with AI/non-deterministic reasoning and validator-based agreement.

## Core Modules

- Claim Decisions: verify Web3 claims from submitted evidence sources.
- Task Reviews: review builder or bounty submissions against proof requirements.
- Dispute Resolutions: resolve small disputes using submitted claims, evidence, and decision rules.

## Interface

Consenza includes a GenLayer-themed landing experience and a production workspace for Claim, Task, and Dispute decisions. The interface also includes wallet and network controls, an About GenLayer resource menu, responsive desktop and mobile behavior, and creator attribution for 0xMamareza.

Full redesign details are documented in [UI_REDESIGN_REPORT.md](UI_REDESIGN_REPORT.md).

## Current MVP Status

- Frontend shell is implemented with React, Vite, TypeScript, and plain CSS.
- All three modules support deterministic local mock flows.
- The public runtime uses `genlayer` mode for wallet-signed Studionet transactions.
- The contract boundary remains isolated in `src/lib/`, with mock mode retained as a local fallback.

## GenLayer Contract Status

- Contract file: `contracts/verdict_layer.py`
- Contract version: `verdictlayer-v0.1-deterministic`
- Deployment method: manual deployment through GenLayer Studio
- Deployment evidence: `contracts/DEPLOYMENT_REPORT.md`

The v0.1 contract stores the latest JSON-like result string for each module and exposes three write methods plus four read methods.

## Tech Stack

- TypeScript
- React
- Vite
- Plain CSS
- GenLayerJS
- Python GenLayer Intelligent Contract

No backend, database, or AI/non-deterministic contract execution is included yet. Wallet and GenLayerJS integration support the three production forms, while diagnostics remain separately gated and hidden publicly.

## Project Structure

```text
contracts/
  verdict_layer.py
  DEPLOYMENT_REPORT.md
  MANUAL_DEPLOYMENT.md
src/
  components/
  config/
  lib/
  types/
  utils/
ARCHITECTURE.md
INTEGRATION_CHECKLIST.md
PROJECT_CONTEXT.md
SUBMISSION_CHECKLIST.md
DEMO_SCRIPT.md
```

## Local Setup Commands

```powershell
Set-Location C:\path\to\verdictlayer
npm install
npm run build
npm run dev
```

## Runtime Modes

React components call `verdictLayerClient`, which selects real GenLayer routes in `genlayer` mode and deterministic local routes in `mock` mode.

The public deployment uses `genlayer`; mock mode remains available for local demos and fallback testing.

## Contract Deployment Evidence

Detailed deployment and manual test evidence is documented in `contracts/DEPLOYMENT_REPORT.md`.

## Evidence

- Deployment report: `contracts/DEPLOYMENT_REPORT.md`
- Submission checklist: `SUBMISSION_CHECKLIST.md`
- Demo script: `DEMO_SCRIPT.md`
- Screenshot guide: `evidence/README.md`

## Manual Testing Summary

The deployed v0.1 contract was tested manually in GenLayer Studio:

- `get_contract_version` returned the expected version.
- `submit_claim_verdict` and `get_latest_claim_verdict` succeeded.
- `submit_task_verdict` and `get_latest_task_verdict` succeeded.
- `submit_dispute_verdict` and `get_latest_dispute_verdict` succeeded.

## Verified GenLayer Browser Transactions

All three deployed contract write methods were tested successfully from the browser. Wallet connection and GenLayer Studionet switching work, and each Claim, Task, and Dispute transaction returned updated contract state through its read-after-write path.

Detailed diagnostics transaction evidence is recorded in [GENLAYER_WRITE_TEST_REPORT.md](GENLAYER_WRITE_TEST_REPORT.md).

The production Claim, Task, and Dispute form integrations are available behind `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer`. All three are manually verified with wallet-signed Studionet transactions and typed read-after-write results. Keep `.env` local and uncommitted, and use a burner or development wallet for testnet interaction.

## Production Claim, Task, and Dispute Integration

Claim Decisions, Task Reviews, and Dispute Resolutions are connected to the deployed GenLayer contract behind `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer`. All three were manually verified with wallet-signed Studionet transactions; their transaction and typed read-after-write evidence is documented in [GENLAYER_PRODUCTION_TEST_REPORT.md](GENLAYER_PRODUCTION_TEST_REPORT.md).

Mock mode remains available for all modules. Keep `.env` uncommitted and use a burner/dev wallet for testnet interaction.

Production integration status:

- Claim: verified
- Task: verified
- Dispute: verified
- Public frontend deployment: live and verified

Production safety: disconnected-wallet and unsupported-network guards are verified. Wallet rejection is manually verified for Claim, Task, and Dispute and displays: "Transaction was rejected in your wallet. No transaction was submitted." Form inputs remain available for retry, and no rejected request produces a transaction hash or result. Evidence is documented in [GENLAYER_ERROR_TEST_REPORT.md](GENLAYER_ERROR_TEST_REPORT.md).

## Public Deployment

Consenza is live at https://verdict-layer-seven.vercel.app/ as a static Vite application connected to GenLayer Studionet. Claim, Task, and Dispute were each verified publicly with wallet-signed transactions and typed read-after-write results. Diagnostics are hidden in the public deployment.

Public deployment status:

- Live: yes
- Claim: verified
- Task: verified
- Dispute: verified
- Diagnostics: hidden
- Network: GenLayer Studionet

Deployment preparation is documented in [PUBLIC_DEPLOYMENT_READINESS.md](PUBLIC_DEPLOYMENT_READINESS.md), and public test evidence is recorded in [PUBLIC_DEPLOYMENT_TEST_REPORT.md](PUBLIC_DEPLOYMENT_TEST_REPORT.md). Use a burner/dev wallet, manually review every transaction, never share wallet secrets, and never commit `.env`.

## Consenza Status

- Product: Consenza
- Network: GenLayer Studionet
- Claim: verified
- Task: verified
- Dispute: verified
- Public deployment: live at https://verdict-layer-seven.vercel.app/ pending external URL rename

## Roadmap

- v0.1 deterministic contract
- v0.2 AI/non-deterministic Intelligent Contract
- v0.3 frontend-to-contract integration
- v0.4 wallet/network integration

## Safety Note

Never commit private keys, seed phrases, wallet secrets, or private deployment credentials.
