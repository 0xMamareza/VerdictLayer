# Consenza Public Deployment Test Report

These tests were originally completed before the public Consenza rebrand. The deployed contract, transaction evidence, and integration behavior are unchanged.

## Deployment

- Public URL: https://verdict-layer-seven.vercel.app/
- Hosting provider: Vercel
- Frontend type: static Vite application
- Network: GenLayer Studionet
- Approved interface: current GenLayer-themed UI on `main`
- Diagnostics: hidden in public deployment
- Test wallet: burner/dev wallet

## Public Smoke Test

- The public page loaded successfully with the pre-rebrand product branding visible.
- The GenLayer Studionet notice and disconnected-wallet state were displayed.
- Claim, Task, and Dispute showed their GenLayer submit controls disabled without a wallet.
- Module navigation and browser refresh worked.
- Diagnostics remained hidden.
- No layout, blank-screen, or runtime error was observed.
- Status: passed

## Wallet and Network Test

- A burner/dev wallet connected successfully and the correct address was displayed.
- The site did not request a seed phrase or private key.
- An unsupported network was detected and all three submit buttons remained disabled.
- No transaction request appeared automatically.
- The network-switch control appeared and switching to GenLayer Studionet succeeded.
- Supported-network status returned to yes and all three submit buttons became enabled.
- Diagnostics remained hidden and no wallet, browser, or layout error was observed.
- Status: passed

## Public Claim Verification

- Method: `submit_claim_verdict`
- Transaction hash: `0xf075cfbd057b25e14d7fe3884b946f97e8a1889ac164df25eb0f9a3a805f6dec`
- Status: success

Exact typed result:

```json
{
  "verdict": "unclear",
  "confidence": "medium",
  "summary": "The submitted evidence is not enough for a strong final verdict.",
  "sourcesChecked": 2,
  "generatedAt": "contract_execution"
}
```

The wallet-signed Claim submission and typed read-after-write path passed.

The claim produced an unclear/medium result because the deployed deterministic contract did not classify this wording as one of its strong true/high patterns. This was a valid contract result, not an integration failure.

## Public Task Verification

- Method: `submit_task_verdict`
- Transaction hash: `0x82c94dc4c05b0c6345c5416c4ccbe04270fb715d9b1e868eb3b73968f4da52e9`
- Status: success

Exact typed result:

```json
{
  "status": "accepted",
  "score": 100,
  "feedback": "Submission includes strong proof for the task.",
  "missingItems": [],
  "generatedAt": "contract_execution"
}
```

The deployed contract's no-missing-items value was normalized into `string[]` as `[]`. The UI rendered "GenLayer task review", "accepted", `100/100`, and "No key proof gaps detected."

- Status: passed

## Public Dispute Verification

- Method: `submit_dispute_verdict`
- Transaction hash: `0x61c346d17d2a3ad1383a25e74239a11af5040d95fe15ad946f2d3926d4933624`
- Status: success

Exact typed result:

```json
{
  "verdict": "side_a",
  "confidence": "high",
  "reason": "The evidence favors Side A completion.",
  "recommendedResolution": "Favor Side A based on the submitted evidence.",
  "generatedAt": "contract_execution"
}
```

The UI rendered the contract value `side_a` as the human-readable verdict "side a", with high confidence and the correct reason and recommended resolution.

- Status: passed

## Three-Module Public Verification Summary

| Module | Transaction hash | Result | Public status |
| --- | --- | --- | --- |
| Claim | `0xf075cfbd057b25e14d7fe3884b946f97e8a1889ac164df25eb0f9a3a805f6dec` | `unclear` / `medium` | Verified |
| Task | `0x82c94dc4c05b0c6345c5416c4ccbe04270fb715d9b1e868eb3b73968f4da52e9` | `accepted` / `100` | Verified |
| Dispute | `0x61c346d17d2a3ad1383a25e74239a11af5040d95fe15ad946f2d3926d4933624` | `side_a` / `high` | Verified |

## Safety Verification

- A burner/dev wallet was used.
- The site did not request a seed phrase or private key.
- Every transaction required manual wallet approval.
- An unsupported network blocked all submissions.
- Diagnostics remained hidden publicly.
- Rejected-wallet handling was previously verified locally.
- No transaction executed automatically.

## Final Status

Consenza is publicly deployed, and its Claim, Task, and Dispute production workflows have all been manually verified from the live Vercel application using wallet-signed GenLayer Studionet transactions.

## Remaining Submission Work

- Final demo recording
- Final screenshots
- Final submission description
- Final repository review
- Submission delivery
