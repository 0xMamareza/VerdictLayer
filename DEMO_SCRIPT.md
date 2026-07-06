# VerdictLayer Demo Script

## 30-Second Intro

VerdictLayer is a GenLayer-powered Web3 product for turning messy evidence into structured verdicts. It covers three early modules: Claim Verdicts, Task Verdicts, and Dispute Verdicts.

The frontend currently runs in local mock mode, while the v0.1 deterministic GenLayer contract has already been deployed and tested manually in GenLayer Studio.

## Frontend Walkthrough

### Claim Verdicts Mock Flow

Open the Claim Verdicts module, enter a Web3 claim, add at least one source URL, and generate a mock verdict. Show the verdict, confidence, summary, source count, and generated time.

### Task Verdicts Mock Flow

Open the Task Verdicts module, enter task requirements and submission proof, then generate a mock review. Show the status, score, feedback, missing items, and generated time.

### Dispute Verdicts Mock Flow

Open the Dispute Verdicts module, enter both sides of the dispute, evidence, and a decision rule. Generate a mock resolution and show the verdict, confidence, reason, and recommended resolution.

## Contract Walkthrough

Open the deployed VerdictLayer contract in GenLayer Studio.

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
