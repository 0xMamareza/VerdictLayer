# Consenza Project Context

## Product Name

Consenza

## Product Summary

Consenza provides onchain decisions for claims, tasks, and disputes. Users submit evidence, review completed work, and resolve disputes through wallet-signed GenLayer workflows.

Public rebrand status: application code, browser metadata, package metadata, documentation, and submission copy use Consenza. The deployed `VerdictLayer` contract and existing `verdictLayer` integration identifiers remain unchanged for compatibility.

Current integration mode: local mock contract boundary. No wallet or GenLayerJS yet.

Current production runtime: `genlayer` on GenLayer Studionet, with deterministic `mock` mode retained as a local fallback. The milestone notes below are preserved chronologically; earlier statements describing mock-only operation record completed development phases.

Current runtime mode: mock.

Frontend client boundary migrated to async mode. Runtime remains mock.

Wallet UI status: injected wallet detection and connect flow added. Runtime remains mock.

Network UI status: wallet chain detection added for Studionet and Bradbury. Runtime remains mock.

Network switching status: users can switch/add the target GenLayer network through wallet RPC methods. Runtime remains mock.

Real integration status: read-only GenLayer client layer prepared. Write transactions are not implemented yet. Mock remains default.

Read diagnostics UI added for manual browser smoke testing of deployed contract read methods.

Browser read smoke test succeeded. The frontend can read deployed GenLayer contract state through the diagnostics panel while mock verdict flows remain active.

Write integration status: transaction lifecycle planned. Production wallet-signed writes are not implemented yet.

Write diagnostics status: dev-only Claim write transaction path added. Production forms remain mock.

Claim write diagnostics succeeded. A real wallet-signed GenLayer transaction was submitted from the browser and the updated latest claim verdict was read afterward.

Task write diagnostics status: dev-only Task write transaction path added. Production forms remain mock.

Task write diagnostics succeeded. A real wallet-signed GenLayer transaction was submitted from the browser and the updated latest task verdict was read afterward.

Dispute write diagnostics status: dev-only Dispute write transaction path added. Production forms remain mock.

Dispute write diagnostics succeeded. All three Consenza modules now have verified browser-based wallet-signed GenLayer write transactions and successful read-after-write results. Production forms still use mock mode.

Production integration status: Claim, Task, and Dispute forms are connected to the verified GenLayer write/read flow behind the genlayer integration mode.

Production Claim integration verified. The real Claim form successfully submitted a browser wallet-signed GenLayer transaction and rendered the typed read-after-write result. Task and Dispute are also production-enabled.

Production integration status: all three forms are connected to real GenLayer behind genlayer mode.

Production Task integration verified. The real Task form successfully submitted a browser wallet-signed GenLayer transaction and rendered the strictly parsed task result. The verified result was accepted with a score of 90, strong-proof feedback, and no missing proof gaps.

Production integration status: Claim, Task, and Dispute forms are connected to real GenLayer behind genlayer mode and are manually verified. Mock mode remains available.

Production Dispute integration verified. Claim, Task, and Dispute production forms have all successfully submitted browser wallet-signed GenLayer Studionet transactions and rendered strictly parsed read-after-write results. Genlayer mode now provides real integration for all three modules, while mock mode remains the deterministic fallback.

Production error-state testing verified disconnected-wallet protection, unsupported-network protection, network recovery, and wallet-rejection recovery for Claim, Task, and Dispute. A shared error normalizer removes viem internals from user-facing rejection errors.

Shared wallet-rejection error normalization is manually verified across Claim, Task, and Dispute. Rejected wallet requests now display a concise message without viem internals, submit no transaction, preserve all form inputs, and leave each production form ready for retry.

Public deployment preparation completed. Consenza is a static Vite frontend with browser wallet interaction and no backend/database dependency. Public environment variables and diagnostics visibility are documented. The current static build supports site-root hosting; subpath hosting requires a future Vite base-path decision. Hosting-provider selection and preview deployment remain pending.

UI status: Consenza has completed a manually approved premium GenLayer-themed redesign. The app now includes a high-end landing page, refined workspace, unified wallet/network dock, accessible About GenLayer menu, redesigned forms/results, and a single Built By 0xMamareza creator signature. Functional GenLayer integration remains unchanged.

Public deployment status: Consenza is live on Vercel at https://consenza-seven.vercel.app/. The approved GenLayer-themed UI, wallet/network flow, diagnostics gating, and all three production workflows were manually verified from the public site. Claim, Task, and Dispute each completed wallet-signed Studionet transactions and rendered typed read-after-write results.

External rebrand status: GitHub repository, local remote, Vercel project, and production domain updated. The new public domain was smoke-tested without submitting a transaction.

Submission package status: README, checklist, and demo script prepared.

Published repository: https://github.com/0xMamareza/Consenza

## Current Contract Status

- v0.1 deterministic GenLayer contract deployed manually.
- All core methods tested successfully.
- Frontend still runs in mock mode.
- Next major step is deciding whether to connect frontend to this deployed contract or build v0.2 AI/non-deterministic contract first.

## Modules

- Claim Decisions: verify Web3 claims from evidence.
- Task Reviews: review builder and bounty submissions.
- Dispute Resolutions: resolve small evidence-based disputes.

## Current MVP Rule

The current MVP is frontend shell first, contracts later. This phase should only establish the product surface, modular configuration, and documentation needed to support later flows.

## Hard Constraints

- No backend.
- No wallet connection.
- No GenLayerJS integration yet.
- No database.
