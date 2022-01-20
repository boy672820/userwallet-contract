// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

abstract contract AbstractGreeterList {
  function sweeperOf(address _token) virtual public view returns (address);
}

contract GreeterWallet {
  AbstractGreeterList greeterList;
  
  constructor(address _greeterList) {
    greeterList = AbstractGreeterList(_greeterList);
  }

  function sweep(address _token, uint256 _amount) external returns (bool) {
    greeterList.sweeperOf(_token).delegatecall(msg.data);
  }

  function viewSweeperOf() external view returns (AbstractGreeterList) {
    return greeterList;
  }
}

contract Greeter is AbstractGreeterList {
  address public owner;
  address public authorizedCaller;

  mapping (address => address) sweepers;

  event LogNewWallet(address receiver);

  constructor() {
    owner = msg.sender;
    authorizedCaller = msg.sender;
  }

  modifier onlyAdmins() {
    if (msg.sender != authorizedCaller && msg.sender != owner) revert();
    _;
  }

  function makeGreeter()
    onlyAdmins
    public
    returns (address wallet) {
    wallet = address(new GreeterWallet(address(this)));
    emit LogNewWallet(wallet);
  }

  function sweeperOf(address _token) public override view returns (address) {
    address sweeper = sweepers[_token];

    // if (sweeper == "0x0000000000000000000000000000000000000000") sweeper = defaultSweeper;

    return sweeper;
  }

}