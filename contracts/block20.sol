// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract block20 {
    IERC20 public tokenContract;
    uint256 public price;
    address payable public owner;

    event Sold(address buyer, uint256 amount);
    event Purchased(address seller, uint256 amount);

    constructor(IERC20 _tokenContract, uint256 _price) {
        tokenContract = _tokenContract;
        price = _price;
        owner = payable(msg.sender);
    }

    // Ensure the contract can receive ETH
    receive() external payable {}

    function buyTokens() external payable {
        uint256 tokenAmount = msg.value / price;
        uint256 contractTokenBalance = tokenContract.balanceOf(address(this));
        require(tokenAmount > 0, "You need to send some ether");
        require(tokenAmount <= contractTokenBalance, "Not enough tokens in the reserve");

        tokenContract.transfer(msg.sender, tokenAmount);
        emit Sold(msg.sender, tokenAmount);
    }

    function sellTokens(uint256 tokenAmount) external {
        require(tokenAmount > 0, "You need to sell at least some tokens");
        uint256 etherAmount = tokenAmount * price;
        require(address(this).balance >= etherAmount, "Not enough ether in the reserve");

        // Make sure the contract is approved to transfer the tokens on behalf of the seller
        require(tokenContract.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");

        // Send ether to the seller. It's important to do this last to prevent re-entrancy attacks
        (bool sent, ) = msg.sender.call{value: etherAmount}("");
        require(sent, "Failed to send Ether");

        emit Purchased(msg.sender, tokenAmount);
    }

    function withdrawETH() external {
        require(msg.sender == owner, "Only owner can withdraw ether");
        owner.transfer(address(this).balance);
    }

    function withdrawTokens(uint256 tokenAmount) external {
        require(msg.sender == owner, "Only owner can withdraw tokens");
        require(tokenContract.transfer(owner, tokenAmount), "Failed to transfer tokens");
    }

    // Function to update the token price
    function setPrice(uint256 _price) external {
        require(msg.sender == owner, "Only owner can set price");
        price = _price;
    }
}

