import './App.css';
import { ethers } from 'ethers'
import { useState, useEffect } from 'react';
import TokenArtifact from "./artifacts/contracts/Token.sol/Token.json"
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const localBlockchainAddress = 'http://localhost:8545'

export default function VotingDApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [codinome, setCodinome] = useState("");
  const [amount, setAmount] = useState("");
  const [votingActive, setVotingActive] = useState(false);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
      if (window.ethereum) {
          const p = new ethers.providers.JsonRpcProvider(localBlockchainAddress)
          setProvider(p);
          setSigner(provider.getSigner());
          const turingContract = new ethers.Contract(tokenAddress, TokenArtifact.abi, provider);
          setContract(turingContract);
      }
  }, []);

  const issueToken = async () => {
      if (contract && signer) {
          const tx = await contract.connect(signer).issueToken(codinome, ethers.utils.parseEther(amount));
          await tx.wait();
          alert("Tokens emitidos com sucesso!");
      }
  };

  const vote = async () => {
      if (contract && signer) {
          const tx = await contract.connect(signer).vote(codinome, ethers.utils.parseEther(amount));
          await tx.wait();
          alert("Voto realizado com sucesso!");
      }
  };

  const toggleVoting = async (status) => {
      if (contract && signer) {
          const tx = status ? await contract.connect(signer).votingOn() : await contract.connect(signer).votingOff();
          await tx.wait();
          setVotingActive(status);
          alert(status ? "Votação ativada!" : "Votação desativada!");
      }
  };

  const fetchVotingStatus = async () => {
      if (contract) {
          const status = await contract.votingActive();
          setVotingActive(status);
      }
  };

  const fetchRankings = async () => {
      if (contract) {
          const rankingList = await contract.getRankings();
          setRankings(rankingList);
      }
  };

  return (
      <header className="App-header">
          <h1>Turing DApp</h1>
          <div className="inputs">
              <input type="text" placeholder="Codinome" value={codinome} onChange={(e) => setCodinome(e.target.value)} />
              <input type="number" placeholder="Quantidade de TUR" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <button onClick={issueToken}>Emitir Tokens</button>
              <button onClick={vote}>Votar</button>
              <button onClick={() => toggleVoting(true)}>Ativar Votação</button>
              <button onClick={() => toggleVoting(false)}>Desativar Votação</button>
              <button onClick={fetchVotingStatus}>Atualizar Status da Votação</button>
              <button onClick={fetchRankings}>Carregar Rankings</button>
              <p>Status da votação: {votingActive ? "Ativa" : "Inativa"}</p>
              <h2>Rankings:</h2>
              <ul>
                  {rankings.map((entry, index) => (
                      <li key={index}>{entry.codinome}: {ethers.utils.formatEther(entry.votes)} TUR</li>
                  ))}
              </ul>
          </div>
      </header>
  );
}
