import React from "react";
import "../style/style.css";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";

// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = '31337';
const HARDHAT_URL = 'http://localhost:8545/'

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
    constructor(props) {
        super(props);

        // We store multiple things in Dapp's state.
        // You don't need to follow this pattern, but it's an useful example.
        this.initialState = {
            // The info of the token (i.e. It's Name and symbol)
            tokenData: undefined,
            // The user's address and balance
            selectedAddress: undefined,
            balance: undefined,
            // The ID about transactions being sent, and any possible error with them
            txBeingSent: undefined,
            transactionError: undefined,
            networkError: undefined,

            provider: null,
            signer: null,
            contract: null,
            codinome: "",
            amount: "",
            votingActive: true,
            userNames: [],
            userBalances: []
        };

        this.state = this.initialState;
    }

    setCodinome(value) {
        this.setState({ codinome: value });
    }

    setAmount(value) {
        this.setState({ amount: value });
    }

    setVotingActive(value) {
        this.setState({ votingActive: value });
    }

    setContract(value) {
        this.setState({ contract: value });
    }

    setSigner(value) {
        this.setState({ signer: value });
    }

    setProvider(value) {
        this.setState({ provider: value });
    }

    render() {
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install a wallet.
        if (window.ethereum === undefined) {
            return <NoWalletDetected />;
        }

        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.
        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

        // If the token data or the user's balance hasn't loaded yet, we show
        // a loading component.
        if (!this.state.tokenData || !this.state.balance) {
            return <Loading />;
        }

        const issueToken = async () => {
            if (this.state.contract && this.state.signer) {
                const tx = await this.state.contract.connect(this.state.signer).issueToken(this.state.codinome, ethers.utils.parseEther(this.state.amount));
                await tx.wait();
                alert("Tokens emitidos com sucesso!");
            }
        };

        const vote = async () => {
            if (this.state.contract && this.state.signer) {
                const tx = await this.state.contract.connect(this.state.signer).vote(this.state.codinome, ethers.utils.parseEther(this.state.amount));
                await tx.wait();
                alert("Voto realizado com sucesso!");
            }
        };

        const toggleVoting = async (status) => {
            if (this.state.contract && this.state.signer) {
                const tx = status ? await this.state.contract.connect(this.state.signer).votingOn() : await this.state.contract.connect(this.state.signer).votingOff();
                await tx.wait();
                this.setVotingActive(status);
                alert(status ? "Votação ativada!" : "Votação desativada!");
            }
        };

        return (
            <div className="App-conteiner">
                <h1 className="title">Turing DApp</h1>
                <div className="content">
                    <div className="inputs">
                        <select id="selector" className="form-control" aria-label="Default select example" value={this.state.codinome} onChange={(e) => this.setCodinome(e.target.value)}>
                            <option value="">Codinomes</option>
                            <option value="nome1">Nome 1</option>
                            <option value="nome2">Nome 2</option>
                            <option value="nome3">Nome 3</option>
                            <option value="nome4">Nome 4</option>
                            <option value="nome5">Nome 5</option>
                            <option value="nome6">Nome 6</option>
                            <option value="nome7">Nome 7</option>
                            <option value="nome8">Nome 8</option>
                            <option value="nome9">Nome 9</option>
                            <option value="nome10">Nome 10</option>
                            <option value="nome11">Nome 11</option>
                            <option value="nome12">Nome 12</option>
                            <option value="nome13">Nome 13</option>
                            <option value="nome14">Nome 14</option>
                            <option value="nome15">Nome 15</option>
                            <option value="nome16">Nome 16</option>
                            <option value="nome17">Nome 17</option>
                            <option value="nome18">Nome 18</option>
                            <option value="nome19">Nome 19</option>
                        </select>
                        <input className="form-control " type="number" placeholder="Quantidade de TUR" value={this.state.amount} onChange={(e) => this.setAmount(e.target.value)} />
                        <button className="btn btn-primary" onClick={issueToken}>Emitir Tokens</button>
                        <button className="btn btn-primary" onClick={vote}>Votar</button>
                        <button className="btn btn-success" onClick={() => toggleVoting(true)}>Ativar Votação</button>
                        <button className="btn btn-danger" onClick={() => toggleVoting(false)}>Desativar Votação</button>
                        <p className="status">Status da votação: <b>{this.state.votingActive ? "Ativa" : "Inativa"}</b></p>
                    </div>
                    <div className="ranking">
                        <h2>Ranking</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Saldo (TUR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...this.state.userNames.map((name, index) => ({
                                    name,
                                    balance: this.state.userBalances[index]
                                }))]
                                    .sort((a, b) => b.balance.sub(a.balance)) // Ordena do maior para o menor saldo
                                    .map(({ name, balance }, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{name}</td>
                                            <td>{ethers.utils.formatUnits(balance, 18)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if (window.ethereum) {
            const p = new ethers.providers.JsonRpcProvider(HARDHAT_URL)
            this.setProvider(p);
            this.setSigner(p.getSigner());
            const turingContract = new ethers.Contract(contractAddress.Token, TokenArtifact.abi, p);
            this.setContract(turingContract);

            // Escutar evento BalancesChanged
            turingContract.on("BalancesChanged", async (userAddress) => {
                // console.log(`Saldo atualizado para: ${userAddress}`);
                await this.updateBalances();
            });
        }
    }

    componentWillUnmount() {
        // We poll the user's balance, so we have to stop doing that when Dapp
        // gets unmounted
        this._stopPollingData();

        if (this.state.contract) {
            this.state.contract.removeAllListeners("BalancesChanged");
        }
    }

    async updateBalances() {
        try {
            const [userNames, userBalances] = await this.state.contract.getUsersBalances();
            this.setState({ userNames, userBalances });
        } catch (error) {
            console.error("Erro ao buscar saldos:", error);
        }
    }

    async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Once we have the address, we can initialize the application.

        // First we check the network
        this._checkNetwork();

        this._initialize(selectedAddress);

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state 
            if (newAddress === undefined) {
                return this._resetState();
            }

            this._initialize(newAddress);
        });
    }

    _initialize(userAddress) {
        // This method initializes the dapp

        // We first store the user's address in the component's state
        this.setState({
            selectedAddress: userAddress,
        });

        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.

        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        this._initializeEthers();
        this._getTokenData();
        this._startPollingData();
    }

    async _initializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        // Then, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this._token = new ethers.Contract(
            contractAddress.Token,
            TokenArtifact.abi,
            this._provider.getSigner(0)
        );
    }

    // The next two methods are needed to start and stop polling data. While
    // the data being polled here is specific to this example, you can use this
    // pattern to read any data from your contracts.
    //
    // Note that if you don't need it to update in near real time, you probably
    // don't need to poll it. If that's the case, you can just fetch it when you
    // initialize the app, as we do with the token data.
    _startPollingData() {
        this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

        // We run it once immediately so we don't have to wait for it
        this._updateBalance();
    }

    _stopPollingData() {
        clearInterval(this._pollDataInterval);
        this._pollDataInterval = undefined;
    }

    // The next two methods just read from the contract and store the results
    // in the component state.
    async _getTokenData() {
        const name = await this._token.name();
        const symbol = await this._token.symbol();

        this.setState({ tokenData: { name, symbol } });
    }

    async _updateBalance() {
        if (this.state.selectedAddress !== undefined) {
            const balance = await this._token.balanceOf(this.state.selectedAddress);
            this.setState({ balance });
        }
    }

    // This method sends an ethereum transaction to transfer tokens.
    // While this action is specific to this application, it illustrates how to
    // send a transaction.
    async _transferTokens(to, amount) {
        // Sending a transaction is a complex operation:
        //   - The user can reject it
        //   - It can fail before reaching the ethereum network (i.e. if the user
        //     doesn't have ETH for paying for the tx's gas)
        //   - It has to be mined, so it isn't immediately confirmed.
        //     Note that some testing networks, like Hardhat Network, do mine
        //     transactions immediately, but your dapp should be prepared for
        //     other networks.
        //   - It can fail once mined.
        //
        // This method handles all of those things, so keep reading to learn how to
        // do it.

        try {
            // If a transaction fails, we save that error in the component's state.
            // We only save one such error, so before sending a second transaction, we
            // clear it.
            this._dismissTransactionError();

            // We send the transaction, and save its hash in the Dapp's state. This
            // way we can indicate that we are waiting for it to be mined.
            const tx = await this._token.transfer(to, amount);
            this.setState({ txBeingSent: tx.hash });

            // We use .wait() to wait for the transaction to be mined. This method
            // returns the transaction's receipt.
            const receipt = await tx.wait();

            // The receipt, contains a status flag, which is 0 to indicate an error.
            if (receipt.status === 0) {
                // We can't know the exact error that made the transaction fail when it
                // was mined, so we throw this generic one.
                throw new Error("Transaction failed");
            }

            // If we got here, the transaction was successful, so you may want to
            // update your state. Here, we update the user's balance.
            await this._updateBalance();
        } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({ transactionError: error });
        } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: undefined });
        }
    }

    // This method just clears part of the state.
    _dismissTransactionError() {
        this.setState({ transactionError: undefined });
    }

    // This method just clears part of the state.
    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }

    // This is an utility method that turns an RPC error into a human readable
    // message.
    _getRpcErrorMessage(error) {
        if (error.data) {
            return error.data.message;
        }

        return error.message;
    }

    // This method resets the state
    _resetState() {
        this.setState(this.initialState);
    }

    async _switchChain() {
        const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
        });
        await this._initialize(this.state.selectedAddress);
    }

    // This method checks if the selected network is Localhost:8545
    _checkNetwork() {
        if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
            this._switchChain();
        }
    }
}
