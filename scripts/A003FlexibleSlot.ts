import * as hre from "hardhat";
import { getStorageHex } from "./utils/getStorageHex";

async function main() {
  const factory = await hre.ethers.getContractFactory("A003FlexibleSlot");
  const deployTx = await factory.deploy();
  const deployReceipt = await deployTx.deploymentTransaction()?.wait();

  if (!deployReceipt?.contractAddress) {
    throw new Error("Transaction receipt not found");
  }
  console.log("A003FlexibleSlot deployed to:", deployReceipt.contractAddress);
  const a003FlexibleSlot = await hre.ethers.getContractAt("A003FlexibleSlot", deployReceipt.contractAddress);

  // slot 10 に address を入れて、他の型で取得してみる
  const slot10 = hre.ethers.zeroPadValue(hre.ethers.toBeHex(10n), 32);
  await a003FlexibleSlot.setAddr(slot10, "0x6037298B1AF2D485e73A8431a0e7d592010ac09A");
  console.log("----- Slot10 setAddr: 0x6037298B1AF2D485e73A8431a0e7d592010ac09A");
  await getStorageHex(deployReceipt.contractAddress, 10);
  console.log("Slot10 getAddr:", await a003FlexibleSlot.getAddr(slot10));
  console.log("Slot10 getNum:", await a003FlexibleSlot.getNum(slot10));
  console.log("Slot10 getFlag:", await a003FlexibleSlot.getFlag(slot10));

  // slot 20 に uint256 を入れて、他の型で取得してみる
  const slot20 = hre.ethers.zeroPadValue(hre.ethers.toBeHex(20n), 32);
  await a003FlexibleSlot.setNum(slot20, 123456789n);
  console.log("----- Slot20 setNum: 123456789");
  await getStorageHex(deployReceipt.contractAddress, 20);
  console.log("Slot20 getAddr:", await a003FlexibleSlot.getAddr(slot20));
  console.log("Slot20 getNum:", await a003FlexibleSlot.getNum(slot20));
  console.log("Slot20 getFlag:", await a003FlexibleSlot.getFlag(slot20));

  // slot 30 に bool を入れて、他の型で取得してみる
  const slot30 = hre.ethers.zeroPadValue(hre.ethers.toBeHex(30n), 32);
  await a003FlexibleSlot.setFlag(slot30, true);
  console.log("----- Slot30 setFlag: true");
  await getStorageHex(deployReceipt.contractAddress, 30);
  console.log("Slot30 getAddr:", await a003FlexibleSlot.getAddr(slot30));
  console.log("Slot30 getNum:", await a003FlexibleSlot.getNum(slot30));
  console.log("Slot30 getFlag:", await a003FlexibleSlot.getFlag(slot30));
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
