//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RedCandleToken is ERC20 {
    uint constant _initial_supply = 1000 * (10 ** 18);

    constructor() ERC20("RedCandleToken", "RCT") {
        _mint(msg.sender, _initial_supply);
    }
}
