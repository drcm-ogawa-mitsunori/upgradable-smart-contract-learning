// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract A002AlignmentSlot {
    struct RankingData {
        uint16 score;
        bool isFinished;
    }

    uint8 public firstNum;
    uint8 public secondNum;
    bool public thirdBool;
    address public fourthAddr;
    uint8[3] public fifthNums;
    uint8[33] public sixthNums;
    uint8[] public seventhNums;
    uint8 public eighthNum;

    RankingData public rankingData;

    constructor() {
        firstNum = 7;
        secondNum = 8;
        thirdBool = true;
        fourthAddr = address(0x170c025B622060eC23d2b8120F1A082aA8726858);
        fifthNums[0] = 11;
        fifthNums[1] = 22;
        fifthNums[2] = 33;

        for (uint8 i = 0; i < 33; i++) {
            sixthNums[i] = i + 10;
        }

        for (uint8 i = 0; i < 100; i++) {
            seventhNums.push(i + 100);
        }

        eighthNum = 250;

        rankingData.score = 100;
        rankingData.isFinished = true;
    }
}
