import * as hre from "hardhat";
import { getStorageHex } from "./getStorageHex";

export const getDynamicUintArray = async (contractAddress: string, slot: number | bigint, variableName: string) => {
  const lengthHex = await getStorageHex(contractAddress, slot);
  let length = parseInt(lengthHex);
  console.log(`${variableName} length:`, length);
  const baseSlotHath = hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(slot), 32));
  const baseSlotHathBn = BigInt(baseSlotHath);

  const provider = hre.ethers.provider;
  for (const i of Array(parseInt(length.toString())).fill(0).keys()) {
    const data = await provider.getStorage(contractAddress, baseSlotHathBn + BigInt(i));
    console.log(`${variableName} index[${i}]:`, parseInt(data));
  }
}
