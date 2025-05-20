import * as hre from "hardhat";
import { getStorageHex } from "./utils/getStorageHex";

async function main() {
  const factory = await hre.ethers.getContractFactory("A002AlignmentSlot");
  const deployTx = await factory.deploy();
  const deployReceipt = await deployTx.deploymentTransaction()?.wait();

  if (!deployReceipt?.contractAddress) {
    throw new Error("Transaction receipt not found");
  }
  console.log("A002AlignmentSlot deployed to:", deployReceipt.contractAddress);

  // uint8 public firstNum;
  // uint8 public secondNum;
  // bool public thirdBool;
  // address public fourthAddr;
  // 全て 32 bytes に収まるため、1つの slot に格納されている
  const firstSlotHex = await getStorageHex(deployReceipt.contractAddress, 0);
  const firstSlotBytes = hre.ethers.getBytes(firstSlotHex);
  console.log("firstNum:", firstSlotBytes[31]);
  console.log("secondNum:", firstSlotBytes[30]);
  console.log("thirdBool:", firstSlotBytes[29] !== 0);
  console.log("fourthAddr:", hre.ethers.getAddress(`0x${Buffer.from(firstSlotBytes.slice(9, 29)).toString("hex")}`));

  // uint8[3] public fifthNums;
  // 固定長配列の場合、割当 slot 内に収めるだけ収める
  const secondSlotHex = await getStorageHex(deployReceipt.contractAddress, 1);
  const secondSlotBytes = hre.ethers.getBytes(secondSlotHex);
  for (const i of Array(3).keys()) {
    console.log(`fifthNums[${i}]:`, secondSlotBytes[secondSlotBytes.length - 1 - i]);
  }

  // uint8[33] public sixthNums;
  // 固定長配列の場合、割当 slot 内に収めるだけ収める
  // 収まりきらない場合は次の slot に格納される
  // 直前割当 slot 内に一部収められる領域があったとしても無視され、改めて割当 slot から収められる
  const thirdAndForthSlotBytes = hre.ethers.getBytes(hre.ethers.concat([
    await getStorageHex(deployReceipt.contractAddress, 3),
    await getStorageHex(deployReceipt.contractAddress, 2),
  ]));
  for (const i of Array(33).keys()) {
    console.log(`sixthNums[${i}]:`, thirdAndForthSlotBytes[thirdAndForthSlotBytes.length - 1 - i]);
  }
  
  // uint8[] public seventhNums;
  // 動的配列の場合、割当 slot 番号には「配列の長さ」が格納されている
  // 実体は `keccak256(割当 slot 番号)` を起点とする slot 以降に格納されており、以降は固定長配列と同じルールで格納されている
  console.log("seventhNums length:", parseInt(await getStorageHex(deployReceipt.contractAddress, 4)));
  const baseSlotBn = BigInt(hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(4), 32)));
  const seventhNumsBytes = hre.ethers.getBytes(hre.ethers.concat([
    await getStorageHex(deployReceipt.contractAddress, baseSlotBn + 3n),
    await getStorageHex(deployReceipt.contractAddress, baseSlotBn + 2n),
    await getStorageHex(deployReceipt.contractAddress, baseSlotBn + 1n),
    await getStorageHex(deployReceipt.contractAddress, baseSlotBn),
  ]));
  for (const i of Array(100).keys()) {
    console.log(`sixthNums[${i}]:`, seventhNumsBytes[seventhNumsBytes.length - 1 - i]);
  }

  // uint8 public eighthNum;
  // 割当 slot に格納されている
  // 直前割当 slot 内に一部収められる領域があったとしても無視され、改めて割当 slot から収められる
  const sixthSlotHex = await getStorageHex(deployReceipt.contractAddress, 5);
  const sixthSlotBytes = hre.ethers.getBytes(sixthSlotHex);
  console.log("eighthNum:", sixthSlotBytes[31]);

  // struct RankingData {
  //     uint16 score;
  //     bool isFinished;
  // }
  // RankingData public rankingData;
  // 割当 slot に格納されている
  // 直前割当 slot 内に一部収められる領域があったとしても無視され、改めて割当 slot から収められる
  const seventhSlotHex = await getStorageHex(deployReceipt.contractAddress, 6);
  const seventhSlotBytes = hre.ethers.getBytes(seventhSlotHex);
  console.log("rankingData.score:", parseInt(`0x${Buffer.from(seventhSlotBytes.slice(30, 32)).toString("hex")}`));
  console.log("rankingData.isFinished:", seventhSlotBytes[29] !== 0);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
