# VerdictLayer

AI-native verdicts for claims, tasks, and disputes.

GitHub Repository: https://github.com/0xMamareza/VerdictLayer

## What VerdictLayer Is

VerdictLayer is a GenLayer-powered Web3 MVP for turning messy evidence into structured verdicts. It gives builders a simple interface for checking claims, reviewing task submissions, and resolving small evidence-based disputes.

The current app demonstrates the product UX locally while the GenLayer contract demonstrates the deployable method interface.

## Why GenLayer

VerdictLayer needs more than deterministic smart contract execution over fixed inputs. Future versions should evaluate natural-language evidence, compare claims against sources, and produce structured decisions from messy context.

GenLayer is a strong fit because Intelligent Contracts can eventually combine on-chain execution with AI/non-deterministic reasoning and validator-based agreement.

## Core Modules

- Claim Verdicts: verify Web3 claims from submitted evidence sources.
- Task Verdicts: review builder or bounty submissions against proof requirements.
- Dispute Verdicts: resolve small disputes using submitted claims, evidence, and decision rules.

## Current MVP Status

- Frontend shell is implemented with React, Vite, TypeScript, and plain CSS.
- All three modules work locally with deterministic mock flows.
- Frontend runtime mode remains `mock` by design.
- The contract boundary is isolated in `src/lib/` so real GenLayer integration can replace the mock client later.

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
- Python GenLayer Intelligent Contract

No backend, database, production form GenLayer writes, or AI/non-deterministic calls are included yet. Wallet and GenLayerJS integration currently remain isolated to diagnostics.

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
Set-Location C:\path\to\VerdictLayer
npm install
npm run build
npm run dev
```

## Frontend Mock Mode

The frontend currently uses a local mock contract boundary. React components call `verdictLayerClient`, which currently selects the mock client because integration mode is hardcoded to `mock`.

This keeps the UX usable while preserving a clean replacement path for future GenLayerJS calls.

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

Production form integration is the next milestone. Detailed transaction evidence is recorded in [GENLAYER_WRITE_TEST_REPORT.md](GENLAYER_WRITE_TEST_REPORT.md).

The production Claim, Task, and Dispute form integrations are available behind `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer`. All three are manually verified with wallet-signed Studionet transactions and typed read-after-write results. Keep `.env` local and uncommitted, and use a burner or development wallet for testnet interaction.

## Production Claim, Task, and Dispute Integration

Claim, Task, and Dispute Verdicts are connected to the deployed GenLayer contract behind `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer`. All three were manually verified with wallet-signed Studionet transactions; their transaction and typed read-after-write evidence is documented in [GENLAYER_PRODUCTION_TEST_REPORT.md](GENLAYER_PRODUCTION_TEST_REPORT.md).

Mock mode remains available for all modules. Keep `.env` uncommitted and use a burner/dev wallet for testnet interaction.

Production integration status:

- Claim: verified
- Task: verified
- Dispute: verified
- Public frontend deployment: pending

Production safety: disconnected-wallet and unsupported-network guards are verified. Wallet rejection is manually verified for Claim, Task, and Dispute and displays: "Transaction was rejected in your wallet. No transaction was submitted." Form inputs remain available for retry, and no rejected request produces a transaction hash or result. Evidence is documented in [GENLAYER_ERROR_TEST_REPORT.md](GENLAYER_ERROR_TEST_REPORT.md).

## Public Deployment

Provider-neutral deployment preparation is documented in [PUBLIC_DEPLOYMENT_READINESS.md](PUBLIC_DEPLOYMENT_READINESS.md). VerdictLayer is a static Vite frontend, and every `VITE_` environment variable is public browser configuration; never place secrets in frontend environment variables.

Public deployment has not yet been completed. The intended target is GenLayer Studionet, using a burner or development wallet and manual approval for every transaction.

## Roadmap

- v0.1 deterministic contract
- v0.2 AI/non-deterministic Intelligent Contract
- v0.3 frontend-to-contract integration
- v0.4 wallet/network integration

## Safety Note

Never commit private keys, seed phrases, wallet secrets, or private deployment credentials.
