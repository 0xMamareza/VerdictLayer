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
