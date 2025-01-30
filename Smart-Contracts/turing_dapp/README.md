# Setup DApp

Install the packages
```shell
npm install
```

Compile the contract
```shell
npx hardhat compile
```

Start local node
```shell
npx hardhat node
```

Deploy contract
```shell
npx hardhat run --network localhost scripts/deploy.js
```

Start react app
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