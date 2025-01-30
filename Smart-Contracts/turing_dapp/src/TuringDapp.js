import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/Turing.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

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
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
            setSigner(web3Provider.getSigner());
            const turingContract = new ethers.Contract(contractAddress, contractABI, web3Provider);
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
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Turing Voting DApp</h1>
            <div className="flex flex-col gap-4">
                <input type="text" placeholder="Codinome" value={codinome} onChange={(e) => setCodinome(e.target.value)} className="border p-2" />
                <input type="number" placeholder="Quantidade de TUR" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2" />
                <button onClick={issueToken} className="bg-blue-500 text-white p-2 rounded">Emitir Tokens</button>
                <button onClick={vote} className="bg-green-500 text-white p-2 rounded">Votar</button>
                <button onClick={() => toggleVoting(true)} className="bg-yellow-500 text-white p-2 rounded">Ativar Votação</button>
                <button onClick={() => toggleVoting(false)} className="bg-red-500 text-white p-2 rounded">Desativar Votação</button>
                <button onClick={fetchVotingStatus} className="bg-gray-500 text-white p-2 rounded">Atualizar Status da Votação</button>
                <button onClick={fetchRankings} className="bg-purple-500 text-white p-2 rounded">Carregar Rankings</button>
                <p className="text-lg font-semibold">Status da votação: {votingActive ? "Ativa" : "Inativa"}</p>
                <h2 className="text-lg font-semibold">Rankings:</h2>
                <ul>
                    {rankings.map((entry, index) => (
                        <li key={index} className="border p-2">{entry.codinome}: {ethers.utils.formatEther(entry.votes)} TUR</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
