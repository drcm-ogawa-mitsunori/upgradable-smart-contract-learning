import * as hre from "hardhat";

export const getStorageHex = async (contractAddress: string, slot: number | bigint) => {
  const provider = hre.ethers.provider;
  const storageHex = await provider.getStorage(contractAddress, slot);
  console.log(`Slot${slot}:`, storageHex);
  return storageHex;
}
