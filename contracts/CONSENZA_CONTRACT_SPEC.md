# Consenza Contract Specification

Consenza is the public product name. The deployed Python class remains `VerdictLayer` so the verified contract interface, deployment evidence, and frontend compatibility identifiers stay unchanged.

## Contract Name

VerdictLayer

## Deployed Compatibility Identity

- Python class: `VerdictLayer`
- Contract file: `contracts/verdict_layer.py`
- Contract version: `verdictlayer-v0.1-deterministic`
- Contract address: `0xf7931C9C809b31B516b6C8fF199cA2e7819165d5`

Persistent storage fields:

- `latest_claim_verdict_json`
- `latest_task_verdict_json`
- `latest_dispute_verdict_json`
- `contract_version`

## Purpose

Consenza uses the `VerdictLayer` GenLayer Intelligent Contract to produce structured decisions from Web3 evidence. The contract supports claim checks, task reviews, and dispute resolutions through strict JSON-like result shapes that the frontend can read consistently.

## MVP Storage Strategy

The first contract version stores only the latest result for each module:

- latest claim verdict
- latest task verdict
- latest dispute verdict

Historical verdict storage, indexing, user ownership, and per-case IDs are intentionally out of scope for the first contract.

## Planned Public Write Methods

### `submit_claim_verdict`

Parameters:

- `claim`
- `source_url_1`
- `source_url_2`
- `source_url_3`

Expected behavior: evaluate the claim against the supplied sources and store the latest claim verdict result.

### `submit_task_verdict`

Parameters:

- `task_title`
- `task_requirements`
- `contract_address`
- `transaction_hash`
- `github_repo_url`
- `explanation`

Expected behavior: review the submitted proof against the task requirements and store the latest task verdict result.

### `submit_dispute_verdict`

Parameters:

- `dispute_title`
- `side_a_claim`
- `side_b_claim`
- `evidence`
- `decision_rule`

Expected behavior: resolve the evidence-based dispute according to the decision rule and store the latest dispute verdict result.

## Planned Public View Methods

- `get_contract_version()`
- `get_latest_claim_verdict()`
- `get_latest_task_verdict()`
- `get_latest_dispute_verdict()`

Each view method should return the latest stored result for its module as a strict JSON-like string or contract-compatible structured value.

## Expected Result Shapes

### Claim Verdict Result

```json
{
  "verdict": "true | false | unclear | outdated",
  "confidence": "low | medium | high",
  "summary": "short explanation",
  "sourcesChecked": 0,
  "generatedAt": "ISO timestamp"
}
```

### Task Verdict Result

```json
{
  "status": "accepted | needs_review | incomplete | rejected",
  "score": 0,
  "feedback": "short review feedback",
  "missingItems": ["contract address", "transaction hash"],
  "generatedAt": "ISO timestamp"
}
```

### Dispute Verdict Result

```json
{
  "verdict": "side_a | side_b | split | unclear",
  "confidence": "low | medium | high",
  "reason": "short resolution reason",
  "recommendedResolution": "short recommended next action",
  "generatedAt": "ISO timestamp"
}
```

## v0.1 Deterministic Contract

`contracts/verdict_layer.py` implements the first deterministic, deployable contract version for manual GenLayer Studio testing.

Implemented write methods:

- `submit_claim_verdict(claim, source_url_1, source_url_2, source_url_3)`
- `submit_task_verdict(task_title, task_requirements, contract_address, transaction_hash, github_repo_url, explanation)`
- `submit_dispute_verdict(dispute_title, side_a_claim, side_b_claim, evidence, decision_rule)`

Implemented read methods:

- `get_contract_version()`
- `get_latest_claim_verdict()`
- `get_latest_task_verdict()`
- `get_latest_dispute_verdict()`

Result values are returned as JSON-like strings for MVP simplicity. The v0.1 contract uses deterministic local branching only and stores the latest result per module.

Future v0.2 will replace deterministic logic with GenLayer AI/non-deterministic execution.

## v0.1 Manual Test Status

Manual deployment succeeded in GenLayer Studio.

- `get_contract_version` succeeded.
- `submit_claim_verdict` and `get_latest_claim_verdict` succeeded.
- `submit_task_verdict` and `get_latest_task_verdict` succeeded.
- `submit_dispute_verdict` and `get_latest_dispute_verdict` succeeded.

This confirms the deterministic contract interface is ready for frontend integration planning.

## Future Non-Deterministic AI Execution Plan

The later Python Intelligent Contract should use GenLayer non-deterministic execution to inspect supplied text and source evidence, produce one strict verdict object, and rely on validator agreement for semantic equivalence. The first implementation should keep prompts narrow, require exact enum values, and avoid broad reasoning output that would make validation noisy.

## Equivalence Strategy

- Force strict JSON-like output.
- Compare enums first.
- Keep summaries/reasons short.
- Avoid open-ended freeform output.

For validator comparison, enum fields should be treated as the primary verdict surface. Short explanatory strings should support the decision but should not become the main source of equivalence complexity.

## Implementation Note

This specification documents Consenza's stable contract boundary. The deployed Python implementation remains `contracts/verdict_layer.py` with class name `VerdictLayer` and version `verdictlayer-v0.1-deterministic`.
