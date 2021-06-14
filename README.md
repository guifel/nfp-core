# NFP
NFP core contracts based on [Rarible v2 tokens](https://github.com/rariblecom/protocol-contracts).

Build: 
```
npm i
npm run compile
```

Deploy & verify:
```
export ETH_RPC_RINKEBY=...
export ETH_RPC_MAINNET=...
export export PRIV_KEY=...
npx hardhat run --network <mainnet|rinkeby> scripts/deploy.ts
npx hardhat verify --network mainnet <CONTRACT ADDRESS>
```


