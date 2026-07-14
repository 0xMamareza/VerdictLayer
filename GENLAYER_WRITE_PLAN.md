# GenLayer Write Transaction Plan

## A. Current Verified State

- Read-only browser diagnostics work against the deployed VerdictLayer contract.
- Wallet detection/connect UI exists.
- GenLayer network detection and switching UI exists.
- Write transactions are not implemented yet.
- Mock mode remains active.

## B. Installed SDK Write API Findings

- Package: `genlayer-js@1.1.8`
- Client import: `createClient` from `genlayer-js`
- Chain imports: `studionet` and `testnetBradbury` from `genlayer-js/chains`
- Status import: `TransactionStatus` from `genlayer-js/types`
- Browser wallet client shape:

```ts
const writeClient = createClient({
  chain: studionet,
  account: address as `0x${string}`,
  provider: window.ethereum,
});
```

- SDK network switching shape:

```ts
await client.connect("studionet");
```

Available network names documented by the SDK: `localnet`, `studionet`, `testnetAsimov`, `testnetBradbury`.

- `writeContract` type shape:

```ts
await writeClient.writeContract({
  address: contractAddress,
  functionName: "method_name",
  args: [],
  value: BigInt(0),
});
```

The installed type declaration requires `value: bigint`. `account` is optional in the method arguments if the client was created with an account.

- `waitForTransactionReceipt` type shape:

```ts
await readClient.waitForTransactionReceipt({
  hash: txHash,
  status: TransactionStatus.ACCEPTED,
});
```

It accepts `hash`, optional `status`, optional `interval`, and optional `retries`, and returns a `GenLayerTransaction`.

- Discoverable `TransactionStatus` values:
  - `UNINITIALIZED`
  - `PENDING`
  - `PROPOSING`
  - `COMMITTING`
  - `REVEALING`
  - `ACCEPTED`
  - `UNDETERMINED`
  - `FINALIZED`
  - `CANCELED`
  - `APPEAL_REVEALING`
  - `APPEAL_COMMITTING`
  - `READY_TO_FINALIZE`
  - `VALIDATORS_TIMEOUT`
  - `LEADER_TIMEOUT`

## C. Contract Write Method Mapping

| Frontend module | Contract method | Args order | Read-after-write method |
| --- | --- | --- | --- |
| Claim Verdicts | `submit_claim_verdict` | `claim`, `source_url_1`, `source_url_2`, `source_url_3` | `get_latest_claim_verdict` |
| Task Verdicts | `submit_task_verdict` | `task_title`, `task_requirements`, `contract_address`, `transaction_hash`, `github_repo_url`, `explanation` | `get_latest_task_verdict` |
| Dispute Verdicts | `submit_dispute_verdict` | `dispute_title`, `side_a_claim`, `side_b_claim`, `evidence`, `decision_rule` | `get_latest_dispute_verdict` |

## D. Proposed Write Transaction Lifecycle

1. Validate form input locally.
2. Confirm wallet is connected.
3. Confirm wallet is on target GenLayer network.
4. Create GenLayer write client.
5. Call `writeContract` with correct method and args.
6. Show transaction submitted state.
7. Wait for transaction receipt.
8. Treat `ACCEPTED` or `FINALIZED` as success if supported by SDK status values.
9. Read latest verdict result.
10. Display result in the existing result card.
11. If any step fails, show readable error and keep user input intact.

## E. UI State Requirements

- `idle`
- `validating`
- `wallet_required`
- `wrong_network`
- `submitting_transaction`
- `waiting_for_receipt`
- `reading_result`
- `success`
- `error`

## F. Risk Checklist

- User rejects wallet request.
- Wrong network.
- No test GEN.
- Contract address missing.
- Method signature mismatch.
- Transaction pending too long.
- Receipt status unexpected.
- Read-after-write stale result.
- SDK bundle size.
- Public website must not expose private secrets.

## G. Implementation Phases

1. Create write client helper only.
2. Add dev-only write diagnostics for one method.
3. Test Claim write from diagnostics.
4. Wire Claim form to real client behind env flag.
5. Wire Task form.
6. Wire Dispute form.
7. Add production safety copy.
8. Deploy public website.

## Dev-Only Claim Write Diagnostics

A dev-only diagnostics path for `submit_claim_verdict` has been implemented. It is isolated from the production Claim, Task, and Dispute forms, which still use mock runtime behavior.

The diagnostics transaction requires:

- Connected wallet.
- Supported GenLayer network.
- Configured public contract address.

After the Claim write receipt is received, the diagnostics panel reads `get_latest_claim_verdict` and displays the latest raw Claim result.

Task and Dispute diagnostics are also implemented and verified. Production form writes are not implemented yet.

## Claim Write Diagnostics Test Status

The dev-only Claim write transaction was manually tested successfully. The transaction hash is recorded in `GENLAYER_WRITE_TEST_REPORT.md`.

The read-after-write step returned the updated latest Claim result from `get_latest_claim_verdict`.

Claim, Task, and Dispute diagnostics write paths are verified, while production form writes are not implemented yet.

## Dev-Only Task Write Diagnostics

A dev-only diagnostics path for `submit_task_verdict` has been implemented. It is isolated from the production Claim, Task, and Dispute forms, which still use mock runtime behavior.

The diagnostics transaction requires:

- Connected wallet.
- Supported GenLayer network.
- Configured public contract address.

After the Task write receipt is received, the diagnostics panel reads `get_latest_task_verdict` and displays the latest raw Task result.

The dev-only Task write transaction was manually tested successfully. Its transaction hash is recorded in `GENLAYER_WRITE_TEST_REPORT.md`, and the read-after-write step returned the updated latest Task result.

The Dispute diagnostics path is also implemented and verified. Production form writes are not implemented yet.

## Dev-Only Dispute Write Diagnostics

A dev-only diagnostics path for `submit_dispute_verdict` has been implemented. It is isolated from the production Claim, Task, and Dispute forms, which still use mock runtime behavior.

The diagnostics transaction requires:

- Connected wallet.
- Supported GenLayer network.
- Configured public contract address.

After the Dispute write receipt is received, the diagnostics panel reads `get_latest_dispute_verdict` and displays the latest raw Dispute result.

The dev-only Dispute write transaction was manually tested successfully. Its transaction hash is recorded in `GENLAYER_WRITE_TEST_REPORT.md`, and the read-after-write step returned the updated latest Dispute result.

All three diagnostics write paths are now verified. Production form writes are still not implemented.

The next implementation phase is to connect the production Claim, Task, and Dispute forms to the verified real client behind the existing integration-mode boundary.

## Production Claim Form Integration

The production Claim form now routes through the real GenLayer write/read flow when integration mode is `genlayer`, while it continues using deterministic local logic when integration mode is `mock`.

Task and Dispute production forms temporarily remain mock-driven. The Claim flow enforces wallet and supported-network checks before submission, and its UI displays transaction lifecycle status plus the submitted transaction hash.

## Production Claim Form Test Status

The production Claim integration was manually tested successfully. Its transaction hash is recorded in `GENLAYER_PRODUCTION_TEST_REPORT.md`.

Wallet and supported-network validation worked, the transaction lifecycle and hash were displayed in the Claim UI, and strict typed result parsing succeeded after the read-after-write step.

Task and Dispute production forms remain mock. The next staged migration is Task production integration.
