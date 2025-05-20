import * as hre from "hardhat";
import { getStorageHex } from "./getStorageHex";

export const getLongString = async (contractAddress: string, slot: number, variableName: string) => {
  const lengthHex = await getStorageHex(contractAddress, slot);
  let length = parseInt(lengthHex);
  console.log(`${variableName} length:`, length);
  const baseSlotHath = hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(slot), 32));
  const baseSlotHathBn = BigInt(baseSlotHath);

  const provider = hre.ethers.provider;
  const list: string[] = [];
  let i = 0n;
  while (length > 0) {
    const data = await provider.getStorage(contractAddress, baseSlotHathBn + i);
    list.push(data.substring(2));
    length -= 64;
    i += 1n;
  }
  console.log(`${variableName}:`, hre.ethers.toUtf8String(`0x${list.join("")}`));
}
