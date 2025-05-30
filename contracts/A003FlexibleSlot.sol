// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract A003FlexibleSlot {
  struct Addr {
    address value;
  }

  struct Num {
    uint256 value;
  }

  struct Flag {
    bool value;
  }

  function setAddr(bytes32 slot, address addrValue) external {
    Addr storage addr;
    assembly {
      addr.slot := slot
    }
    addr.value = addrValue;
  }

  function getAddr(bytes32 slot) external view returns (address) {
    Addr storage addr;
    assembly {
      addr.slot := slot
    }
    return addr.value;
  }

  function setNum(bytes32 slot, uint256 numValue) external {
    Num storage num;
    assembly {
      num.slot := slot
    }
    num.value = numValue;
  }

  function getNum(bytes32 slot) external view returns (uint256) {
    Num storage num;
    assembly {
      num.slot := slot
    }
    return num.value;
  }

  function setFlag(bytes32 slot, bool flagValue) external {
    Flag storage flag;
    assembly {
      flag.slot := slot
    }
    flag.value = flagValue;
  }

  function getFlag(bytes32 slot) external view returns (bool) {
    Flag storage flag;
    assembly {
      flag.slot := slot
    }
    return flag.value;
  }
}
