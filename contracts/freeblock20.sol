// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FreeBlock20 is ERC20, Ownable {
    constructor() ERC20("FreeBlock20", "FB20") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    function getFreeTokens(uint256 amount) public {
        require(amount <= 1000 * (10 ** uint256(decimals())), "Request too much");
        _mint(msg.sender, amount);
    }
}
