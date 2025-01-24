# setup our Dapp

Try running some of the following tasks to get started
```shell
npm install
```
## To start our contract
compile the contract
```shell
npx hardhat compile
```

start our local node
```shell
npx hardhat node
```

deploy contract
```shell
npx hardhat run --network localhost scripts/deploy.js
```

Start React app
```shell
npm start
```
---
Rodar esse comando em caso de erro no `npm start`:
- Linux
```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

- Windows (CMD)
```cmd
set NODE_OPTIONS=--openssl-legacy-provider
```

- Windows (PowerShell)
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
```
