# Consenza Contracts

`contracts/verdict_layer.py` is Consenza's first deployable deterministic GenLayer contract. Its Python class remains `VerdictLayer` for compatibility with the deployed interface and evidence.

It supports all three Consenza modules:

- Claim Decisions
- Task Reviews
- Dispute Resolutions

This version does not use AI, non-deterministic calls, wallet logic, or external APIs. It stores only the latest JSON-like result string for each module.

The contract is intended for manual GenLayer Studio deployment first, so the deployment flow can be verified before adding GenLayerJS frontend integration.

## Manual Deployment Status

`contracts/verdict_layer.py` has been deployed and tested manually in GenLayer Studio. All three write methods and all four read methods were tested successfully.

Detailed evidence is stored in `contracts/DEPLOYMENT_REPORT.md`.
