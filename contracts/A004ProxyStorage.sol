// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract A004ProxyStorage {
  function getAddr(address implementationAddress) external returns (address) {
    (bool success, bytes memory data) = implementationAddress.delegatecall(abi.encodeWithSignature("getAddr()"));
    require(success == true, "delegatecall failed");
    return abi.decode(data, (address));
  }

  function setAddr(address implementationAddress,address addr) external {
    (bool success, ) = implementationAddress.delegatecall(abi.encodeWithSignature("setAddr(address)", addr));
    require(success == true, "delegatecall failed");
  }

  function getNum1(address implementationAddress) external returns (uint256) {
    (bool success, bytes memory data) = implementationAddress.delegatecall(abi.encodeWithSignature("getNum1()"));
    require(success == true, "delegatecall failed");
    return abi.decode(data, (uint256));
  }
  
  function setNum1(address implementationAddress, uint256 num) external {
    (bool success, ) = implementationAddress.delegatecall(abi.encodeWithSignature("setNum1(uint256)", num));
    require(success == true, "delegatecall failed");
  }

  function getNum2(address implementationAddress) external returns (uint256) {
    (bool success, bytes memory data) = implementationAddress.delegatecall(abi.encodeWithSignature("getNum2()"));
    require(success == true, "delegatecall failed");
    return abi.decode(data, (uint256));
  }
  
  function setNum2(address implementationAddress, uint256 num) external {
    (bool success, ) = implementationAddress.delegatecall(abi.encodeWithSignature("setNum2(uint256)", num));
    require(success == true, "delegatecall failed");
  }

  function getFlag(address implementationAddress) external returns (bool) {
    (bool success, bytes memory data) = implementationAddress.delegatecall(abi.encodeWithSignature("getFlag()"));
    require(success == true, "delegatecall failed");
    return abi.decode(data, (bool));
  }

  function setFlag(address implementationAddress, bool flag) external {
    (bool success, ) = implementationAddress.delegatecall(abi.encodeWithSignature("setFlag(bool)", flag));
    require(success == true, "delegatecall failed");
  }
}
