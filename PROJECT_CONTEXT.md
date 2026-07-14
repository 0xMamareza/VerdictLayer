# VerdictLayer Project Context

## Product Name

VerdictLayer

## Product Summary

VerdictLayer is a GenLayer-powered Web3 MVP for turning messy evidence into structured verdicts. It focuses on claim checks, task reviews, and small dispute decisions that can later be backed by GenLayer Intelligent Contracts.

Current integration mode: local mock contract boundary. No wallet or GenLayerJS yet.

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

Dispute write diagnostics succeeded. All three VerdictLayer modules now have verified browser-based wallet-signed GenLayer write transactions and successful read-after-write results. Production forms still use mock mode.

Production integration status: Claim, Task, and Dispute forms are connected to the verified GenLayer write/read flow behind the genlayer integration mode.

Production Claim integration verified. The real Claim form successfully submitted a browser wallet-signed GenLayer transaction and rendered the typed read-after-write result. Task and Dispute are also production-enabled.

Production integration status: all three forms are connected to real GenLayer behind genlayer mode.

Production Task integration verified. The real Task form successfully submitted a browser wallet-signed GenLayer transaction and rendered the strictly parsed task result. The verified result was accepted with a score of 90, strong-proof feedback, and no missing proof gaps.

Production integration status: Claim, Task, and Dispute forms are connected to real GenLayer behind genlayer mode and are manually verified. Mock mode remains available.

Production Dispute integration verified. Claim, Task, and Dispute production forms have all successfully submitted browser wallet-signed GenLayer Studionet transactions and rendered strictly parsed read-after-write results. Genlayer mode now provides real integration for all three modules, while mock mode remains the deterministic fallback.

Submission package status: README, checklist, and demo script prepared.

Published repository: https://github.com/0xMamareza/VerdictLayer

## Current Contract Status

- v0.1 deterministic GenLayer contract deployed manually.
- All core methods tested successfully.
- Frontend still runs in mock mode.
- Next major step is deciding whether to connect frontend to this deployed contract or build v0.2 AI/non-deterministic contract first.

## Modules

- Claim Verdicts: verify Web3 claims from evidence.
- Task Verdicts: review builder and bounty submissions.
- Dispute Verdicts: resolve small evidence-based disputes.

## Current MVP Rule

The current MVP is frontend shell first, contracts later. This phase should only establish the product surface, modular configuration, and documentation needed to support later flows.

## Hard Constraints

- No backend.
- No wallet connection.
- No GenLayerJS integration yet.
- No database.
