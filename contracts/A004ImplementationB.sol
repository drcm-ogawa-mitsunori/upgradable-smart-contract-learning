// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract A004ImplementationB {
  address private _addr;
  uint256 private _num1;
  bool private _flag;
  uint256 private _num2;

  function getAddr() external view returns (address) {
    return _addr;
  }

  function setAddr(address addr) external {
    _addr = addr;
  }

  function getNum1() external view returns (uint256) {
    return _num1;
  }
  
  function setNum1(uint256 num) external {
    _num1 = num;
  }

  function getNum2() external view returns (uint256) {
    return _num2;
  }
  
  function setNum2(uint256 num) external {
    _num2 = num;
  }

  function getFlag() external view returns (bool) {
    return _flag;
  }

  function setFlag(bool flag) external {
    _flag = flag;
  }
}
