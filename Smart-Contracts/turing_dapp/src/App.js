import './App.css';
import { ethers } from 'ethers'
import { useState } from 'react';
import TokenArtifact from "./artifacts/contracts/Token.sol/Token.json"
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const localBlockchainAddress = 'http://localhost:8545'

function App() {

  const [tokenData, setTokenData] = useState({})
  const [amount, setAmount] = useState()
  const [userAccountId, setUserAccountId] = useState()
  const [codinome, setCodinome] = useState("")

  const provider = new ethers.providers.JsonRpcProvider(localBlockchainAddress)
  const signer = provider.getSigner();

  async function _intializeContract(init) {
    const contract = new ethers.Contract(
      tokenAddress,
      TokenArtifact.abi,
      init
    );
    return contract
  }

  async function _getTokenData() {
    const contract = await _intializeContract(signer)
    const name = await contract.name();
    const symbol = await contract.symbol();
    const tokenData = { name, symbol }
    setTokenData(tokenData);
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function sendMDToken() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const contract = await _intializeContract(signer)
      const transaction = await contract.transfer(userAccountId, amount);
      await transaction.wait();
      console.log(`${amount} MDToken has been sent to ${userAccountId}`);
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await _intializeContract(signer)
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const balance = await contract.balanceOf(account);
      console.log("Account Balance: ", balance.toString());
    }
  }

  async function issueTokens() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const contract = await _intializeContract(signer)
      const transaction = await contract.issueToken(amount);
      await transaction.wait();
      alert("Tokens emitidos com sucesso!");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Turing DApp</h1>

        <div className="inputs">
          <input type="text" placeholder="Codinome" value={codinome} onChange={(e) => setCodinome(e.target.value)} />
          <input type="number" placeholder="Quantidade de TUR" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={issueTokens}>Emitir Tokens</button>
          <button onClick={""}>Votar</button>
          <button onClick={""}>Ativar Votação</button>
          <button onClick={""}>Desativar Votação</button>
          <button onClick={""}>Atualizar Status da Votação</button>
          <button onClick={""}>Carregar Rankings</button>
          {/* <p>Status da votação: {votingActive ? "Ativa" : "Inativa"}</p>
          <h2>Rankings:</h2>
          <ul>
          {rankings.map((entry, index) => (
            <li key={index}>{entry.codinome}: {ethers.utils.formatEther(entry.votes)} TUR</li>
            ))}
            </ul> */}

        </div>
      </header>
    </div>
  );
}

export default App;
