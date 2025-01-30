// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Turing is ERC20, Ownable {
    mapping(string => address) private codinomes;
    mapping(address => bool) private hasVoted;
    bool public votingActive = true;
    address private professor = 0x502542668aF09fa7aea52174b9965A7799343Df7;
    
    modifier onlyAuthorized() {
        require(msg.sender == owner() || msg.sender == professor, "Nao autorizado");
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
    
    constructor() ERC20("Turing", "TUR") Ownable(msg.sender) {}
    
    function registerCodinome(string memory codinome, address userAddr) external onlyAuthorized {
        require(userAddr != address(0), "Endereco invalido");
        require(codinomes[codinome] == address(0), "Codinome ja registrado");
        codinomes[codinome] = userAddr;
    }
    
    function issueToken(string memory codinome, uint256 amount) external onlyAuthorized onlyRegisteredUser(codinome) {
        _mint(codinomes[codinome], amount);
    }
    
    function vote(string memory codinome, uint256 amount) external onlyDuringVoting onlyRegisteredUser(codinome) {
        require(codinomes[codinome] != msg.sender, "Nao pode votar em si mesmo");
        require(amount <= 2 * 10**18, "Excede limite maximo de 2 TUR");
        require(!hasVoted[msg.sender], "Ja votou uma vez");
        
        _mint(codinomes[codinome], amount);
        _mint(msg.sender, 0.2 * 10**18);
        hasVoted[msg.sender] = true;
    }
    
    function votingOn() external onlyAuthorized {
        votingActive = true;
    }
    
    function votingOff() external onlyAuthorized {
        votingActive = false;
    }
    
    function getAddressByCodinome(string memory codinome) external view returns (address) {
        return codinomes[codinome];
    }
    
    function hasUserVoted(address user) external view returns (bool) {
        return hasVoted[user];
    }
}
