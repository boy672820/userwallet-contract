pragma solidity ^0.4.11;

contract AbstractSweeperListTest {
    function sweeperOf(address _token) returns (address);
}

contract UserWalletTest {
  AbstractSweeperListTest sweeperList;
 
  function UserWalletTest(address _sweeperList) {
    sweeperList = AbstractSweeperListTest(_sweeperList);
  }

  function () public payable { }

  function sweep(address _token, uint _amount) returns (bool) {
      (_amount);
      return sweeperList.sweeperOf(_token).delegatecall(msg.data);
  }
}
