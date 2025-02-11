// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Token is ERC20 {

    mapping(string => address) private codinomes;
    mapping(address => mapping(address => bool)) hasVoted;
    mapping(string => uint256) balances;

    address private professor;
    address private owner;
    bool private votingActive = true;

    event VotingOn();
    event VotingOff();
    event BalancesChanged(address userAddress);

    constructor() ERC20("Turing", "TUR") {
        codinomes["nome1"] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        codinomes["nome2"] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        codinomes["nome3"] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        codinomes["nome4"] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        codinomes["nome5"] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        codinomes["nome6"] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        codinomes["nome7"] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        codinomes["nome8"] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;
        codinomes["nome9"] = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        codinomes["nome10"] = 0xBcd4042DE499D14e55001CcbB24a551F3b954096;
        codinomes["nome11"] = 0x71bE63f3384f5fb98995898A86B02Fb2426c5788;
        codinomes["nome12"] = 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a;
        codinomes["nome13"] = 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec;
        codinomes["nome14"] = 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097;
        codinomes["nome15"] = 0xcd3B766CCDd6AE721141F452C550Ca635964ce71;
        codinomes["nome16"] = 0x2546BcD3c84621e976D8185a91A922aE77ECEc30;
        codinomes["nome17"] = 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E;
        codinomes["nome18"] = 0xdD2FD4581271e230360230F9337D5c0430Bf44C0;
        codinomes["nome19"] = 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199;

        balances["nome1"] = 0;
        balances["nome2"] = 0;
        balances["nome3"] = 0;
        balances["nome4"] = 0;
        balances["nome5"] = 0;
        balances["nome6"] = 0;
        balances["nome7"] = 0;
        balances["nome8"] = 0;
        balances["nome9"] = 0;
        balances["nome10"] = 0;
        balances["nome11"] = 0;
        balances["nome12"] = 0;
        balances["nome13"] = 0;
        balances["nome14"] = 0;
        balances["nome15"] = 0;
        balances["nome16"] = 0;
        balances["nome17"] = 0;
        balances["nome18"] = 0;
        balances["nome19"] = 0;

        owner = msg.sender;
        professor = 0x502542668aF09fa7aea52174b9965A7799343Df7;
    }
    
    modifier onlyAuthorized() {
        require(msg.sender == owner || msg.sender == professor, "Nao autorizado");
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
    
    function issueToken(string memory codinome, uint256 amountSaTuring) public onlyAuthorized onlyRegisteredUser(codinome) {
        _mint(codinomes[codinome], amountSaTuring);

        balances[codinome] = balanceOf(codinomes[codinome]);

        emit BalancesChanged(msg.sender);
    }
    
    function vote(string memory codinome, uint256 amountSaTuring) external onlyDuringVoting onlyRegisteredUser(codinome) {
        require(codinomes[codinome] != msg.sender, "Nao pode votar em si mesmo");
        require(amountSaTuring <= 2 * 10**18, "Excede limite maximo de 2 TUR");
        require(!hasVoted[msg.sender][codinomes[codinome]], "Ja votou uma vez nesse usuario");
        
        _mint(codinomes[codinome], amountSaTuring);
        _mint(msg.sender, amountSaTuring);

        hasVoted[msg.sender][codinomes[codinome]] = true;

        balances[codinome] = balanceOf(codinomes[codinome]);

        emit BalancesChanged(msg.sender);
    }
    
    function votingOn() public onlyAuthorized {
        votingActive = true;

        emit VotingOn();
    }
    
    function votingOff() public onlyAuthorized {
        votingActive = false;

        emit VotingOff();
    }

    function getUserAddress (string memory codinome) public view returns (address) {
        return codinomes[codinome];
    }
}
