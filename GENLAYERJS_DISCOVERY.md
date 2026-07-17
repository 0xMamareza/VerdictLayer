# GenLayerJS Discovery

## Installed Package

- Package: `genlayer-js`
- Version: `1.1.8`

## Confirmed Import Paths

- `createClient` from `genlayer-js`
- `studionet` from `genlayer-js/chains`
- `testnetBradbury` from `genlayer-js/chains`
- `TransactionStatus` from `genlayer-js/types`

## Confirmed Network Exports

- `studionet`
- `testnetBradbury`

The package also exposes `localnet` and `testnetAsimov` from `genlayer-js/chains`, but Consenza discovery currently records only the planned `studionet` and `testnetBradbury` options.

## Transaction Status

`TransactionStatus` imports successfully from `genlayer-js/types`.

## Scope

No wallet, contract calls, transactions, network switching, or runtime GenLayer integration were implemented in this step.

## Next Planned Step

Create wallet detection/connect UI while keeping mock mode active.
