// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Token is ERC20 {
    mapping(string => address) private codinomes;
    mapping(address => mapping(address => bool)) hasVoted;
    mapping(string => uint256) balances;

    string[] userNames = [
        "nome1",
        "nome2",
        "nome3",
        "nome4",
        "nome5",
        "nome6",
        "nome7",
        "nome8",
        "nome9",
        "nome10",
        "nome11",
        "nome12",
        "nome13",
        "nome14",
        "nome15",
        "nome16",
        "nome17",
        "nome18",
        "nome19"
    ];

    address[] userAddresses = [
        0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
        0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
        0x90F79bf6EB2c4f870365E785982E1f101E93b906,
        0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
        0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
        0x976EA74026E726554dB657fA54763abd0C3a0aa9,
        0x14dC79964da2C08b23698B3D3cc7Ca32193d9955,
        0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f,
        0xa0Ee7A142d267C1f36714E4a8F75612F20a79720,
        0xBcd4042DE499D14e55001CcbB24a551F3b954096,
        0x71bE63f3384f5fb98995898A86B02Fb2426c5788,
        0xFABB0ac9d68B0B445fB7357272Ff202C5651694a,
        0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec,
        0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097,
        0xcd3B766CCDd6AE721141F452C550Ca635964ce71,
        0x2546BcD3c84621e976D8185a91A922aE77ECEc30,
        0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,
        0xdD2FD4581271e230360230F9337D5c0430Bf44C0,
        0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
    ];

    address private professor;
    address private owner;
    uint256 private totalUsers;
    bool private votingActive;

    event BalancesChanged(address userAddress);

    constructor() ERC20("Turing", "TUR") {
        require(
            userAddresses.length == userNames.length,
            "Tamanho do array de enderecos e nomes incompativel."
        );

        totalUsers = userNames.length;

        for (uint256 i = 0; i < totalUsers; i++) {
            codinomes[userNames[i]] = userAddresses[i];
            balances[userNames[i]] = 0;
        }

        owner = msg.sender;
        professor = 0x502542668aF09fa7aea52174b9965A7799343Df7;

        votingActive = true;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || msg.sender == professor,
            "Nao autorizado"
        );
        _;
    }

    modifier onlyDuringVoting() {
        require(votingActive, "Votacao desativada");
        _;
    }

    modifier onlyRegisteredUser(string memory codinome) {
        require(codinomes[codinome] != address(0), "Codinome nao registrado");
        _;
    }

    function issueToken(
        string memory codinome,
        uint256 amountSaTuring
    ) public onlyAuthorized onlyRegisteredUser(codinome) {
        _mint(codinomes[codinome], amountSaTuring);

        balances[codinome] = balanceOf(codinomes[codinome]);

        emit BalancesChanged(msg.sender);
    }

    function vote(
        string memory codinome,
        uint256 amountSaTuring
    ) external onlyDuringVoting onlyRegisteredUser(codinome) {
        require(
            codinomes[codinome] != msg.sender,
            "Nao pode votar em si mesmo"
        );
        require(
            amountSaTuring <= 2 * 10 ** 18,
            "Excede limite maximo de 2 TUR"
        );
        require(
            !hasVoted[msg.sender][codinomes[codinome]],
            "Ja votou uma vez nesse usuario"
        );

        _mint(codinomes[codinome], amountSaTuring);
        _mint(msg.sender, 0.2 * 10 ** 18);

        hasVoted[msg.sender][codinomes[codinome]] = true;

        balances[codinome] = balanceOf(codinomes[codinome]);

        emit BalancesChanged(codinomes[codinome]); // Emite para o usuário que recebeu o voto
        emit BalancesChanged(msg.sender); // Emite para o votante
    }

    function votingOn() public onlyAuthorized {
        votingActive = true;
    }

    function votingOff() public onlyAuthorized {
        votingActive = false;
    }

    function getUserAddress(
        string memory codinome
    ) public view returns (address) {
        return codinomes[codinome];
    }

    function getUsersBalances()
        public
        view
        returns (string[] memory, uint256[] memory)
    {
        uint256[] memory userBalances = new uint256[](totalUsers);

        for (uint256 i = 0; i < totalUsers; i++) {
            userBalances[i] = balances[userNames[i]];
        }

        return (userNames, userBalances);
    }
}
