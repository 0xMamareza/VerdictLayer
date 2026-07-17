# Consenza Demo Script

## 30-Second Intro

Consenza provides onchain decisions for claims, tasks, and disputes. Users submit evidence, review completed work, and resolve disputes through wallet-signed GenLayer workflows.

The frontend currently runs in local mock mode, while the v0.1 deterministic GenLayer contract has already been deployed and tested manually in GenLayer Studio.

## Frontend Walkthrough

### Claim Decisions Mock Flow

Open Claim Decisions, enter a Web3 claim, add at least one source URL, and generate a mock decision. Show the returned result, confidence, summary, source count, and generated time.

### Task Reviews Mock Flow

Open Task Reviews, enter task requirements and submission proof, then generate a mock review. Show the status, score, feedback, missing items, and generated time.

### Dispute Resolutions Mock Flow

Open Dispute Resolutions, enter both sides of the dispute, evidence, and a decision rule. Generate a mock resolution and show the returned result, confidence, reason, and recommended resolution.

## Contract Walkthrough

Open Consenza's deployed `VerdictLayer` contract in GenLayer Studio.

Show:

- The deployed contract address.
- `get_contract_version`.
- `submit_claim_verdict` and `get_latest_claim_verdict`.
- `submit_task_verdict` and `get_latest_task_verdict`.
- `submit_dispute_verdict` and `get_latest_dispute_verdict`.

Point to `contracts/DEPLOYMENT_REPORT.md` for the recorded deployment transaction and accepted method outputs.

## Closing Explanation

This version is deterministic so the method interface and manual deployment path can be verified first.

The next version will use GenLayer AI/non-deterministic execution for richer evidence interpretation, then the frontend can replace the mock client with real contract calls.
