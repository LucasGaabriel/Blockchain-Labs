//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public professorAddress = 0x502542668aF09fa7aea52174b9965A7799343Df7;
    address[] colegas = [
        0x502542668aF09fa7aea52174b9965A7799343Df7,
        0x877dF854780fEBB8Ed6ec28dE8ba0D16e1c09D30,
        0xfa297702A39213Bc20d0ffDE67D3612F5b290a3b,
        0x90d845c1C46E4895aD5B8Df7c2A4bE2EdBa954F6,
        0x3D6ff9A2915f3a15b85552674592eA96606ae547,
        0xb8Dd9A18376EF7B2E610E6EEFc397e726307Ef77,
        0x075717A35c62E2B626b44fe5CAa020a706802656,
        0x46875D285479d48005EBd8BDa025c641BE75FbDb,
        0x285a1f898C1bD77Fa6FB0cdD707e9Bff37Ccb020,
        0x106808f0C3F7241Bae984285699A6eD2348C5530,
        0xE6e4fe2a82E590c1CC177fdB5De02770108Dcfc4,
        0xe60BEb6accAE9F82994B0b7a954b288F0C3a5350,
        0x9A141D16a786188D2b19B30739626C8A6D5181a9,
        0x0311eC51E01EF658673E0E9556Fc8b3f4aFc57Fa,
        0xbb54B5BEACceB50B37ba0bCC5d25d5911d793923,
        0xd72FBb85Cc0c36aC0E476B27f6FBd252bae8624A,
        0x642333d7525A5064b6DE453b10BB8e3E11C06867,
        0xD3abe362B84500ECF98A4131bf0b5BA5AFe261f5,
        0xB866D88eA70ee477a5e16d1e7920A802fA07FeEB,
        0xc7060367b9B2A52E1cd4b48e455dAfA5E21dF18e,
        0x256Da363b243D1f24bDca8931a81840Ecb693A7f,
        0xe2529c1bcEc81d5A130920c7B5B0E56Dbd2Cdb99,
        0xcfc4422426b110c66EcA4300622715fFfC67CDE6,
        0x24355169Feaa83BDc07Df0D4bC5305508687D612,
        0xB1E0DE1F33428a004953F02E294975A99d61811F,
        0x50f95d81Eee3c9E3d03A7A9C51e31359bA1F2172
    ];

    string private _name = "Madfinger Token";
    string private _symbol = "MDT";

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 private _totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     * The `public` modifier makes a function callable from outside the contract.
     */
    constructor() ERC20(_name, _symbol) {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        _mint(msg.sender, _totalSupply);
        owner = msg.sender;
    }

    function issueToken(uint256 amount) public {
        require(msg.sender == owner || msg.sender == professorAddress, 
            "Apenas o deployer ou a professora podem emitir tokens.");

        for (uint256 i = 0; i < colegas.length; i++) {
            _mint(colegas[i], amount);
        }
    }
}