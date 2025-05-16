import * as hre from "hardhat";

const getStorageHex = async (contractAddress: string, slot: number | bigint) => {
  const provider = hre.ethers.provider;
  const storageHex = await provider.getStorage(contractAddress, slot);
  console.log(`Slot${slot}:`, storageHex);
  return storageHex;
}

const getLongString = async (contractAddress: string, slot: number, variableName: string) => {
  const lengthHex = await getStorageHex(contractAddress, slot);
  let length = BigInt(lengthHex);
  console.log(`${variableName} length:`, length);
  const baseSlotHath = hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(slot), 32));
  const baseSlotHathBn = BigInt(baseSlotHath);

  const provider = hre.ethers.provider;
  const list: string[] = [];
  let i = 0n;
  while (length > 0) {
    const data = await provider.getStorage(contractAddress, baseSlotHathBn + i);
    list.push(data.substring(2));
    length -= 64n;
    i += 1n;
  }
  console.log(`${variableName}:`, hre.ethers.toUtf8String(`0x${list.join("")}`));
}

const getDynamicUintArray = async (contractAddress: string, slot: number | bigint, variableName: string) => {
  const lengthHex = await getStorageHex(contractAddress, slot);
  let length = BigInt(lengthHex);
  console.log(`${variableName} length:`, length);
  const baseSlotHath = hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(slot), 32));
  const baseSlotHathBn = BigInt(baseSlotHath);

  const provider = hre.ethers.provider;
  for (const i of Array(parseInt(length.toString())).fill(0).keys()) {
    const data = await provider.getStorage(contractAddress, baseSlotHathBn + BigInt(i));
    console.log(`${variableName} index[${i}]:`, BigInt(data));
  }
}

const getProfile = async (contractAddress: string, slot: bigint, variableName: string) => {
  const profileName = hre.ethers.toUtf8String((await getStorageHex(contractAddress, slot)).substring(0, 64));
  console.log(`${variableName}.name:`, profileName);
  const profileAge = BigInt(await getStorageHex(contractAddress, slot + 1n));
  console.log(`${variableName}.age:`, profileAge);
  await getDynamicUintArray(contractAddress, slot + 2n, `${variableName}.scores`);
}

const getDynamicProfileArray = async (contractAddress: string, slot: number, variableName: string) => {
  const lengthHex = await getStorageHex(contractAddress, slot);
  let length = BigInt(lengthHex);
  console.log(`${variableName} length:`, length);
  const baseSlotHath = hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(slot), 32));
  const baseSlotHathBn = BigInt(baseSlotHath);

  const provider = hre.ethers.provider;
  for (const i of Array(parseInt(length.toString())).fill(0).keys()) {
    const nameHex = await provider.getStorage(contractAddress, baseSlotHathBn + BigInt(i * 3));
    console.log(`${variableName} index[${i}].name:`, hre.ethers.toUtf8String(nameHex));
    const ageHex = await provider.getStorage(contractAddress, baseSlotHathBn + BigInt(i * 3 + 1));
    console.log(`${variableName} index[${i}].age:`, BigInt(ageHex));
    await getDynamicUintArray(contractAddress, baseSlotHathBn + BigInt(i * 3 + 2), `${variableName} index[${i}].scores`);
  }
}

async function main() {
  const factory = await hre.ethers.getContractFactory("A001SimpleStorage");
  const deployTx = await factory.deploy();
  const deployReceipt = await deployTx.deploymentTransaction()?.wait();

  if (!deployReceipt?.contractAddress) {
    throw new Error("Transaction receipt not found");
  }
  console.log("A001SimpleStorage deployed to:", deployReceipt.contractAddress);

  const provider = hre.ethers.provider;

  // uint256 public firstNum;
  const firstNum = BigInt(await getStorageHex(deployReceipt.contractAddress, 0));
  console.log("firstNum:", firstNum);

  // address public secondAddr;
  const secondAddr = hre.ethers.getAddress(`0x${(await getStorageHex(deployReceipt.contractAddress, 1)).substring(26)}`);
  console.log("secondAddr:", secondAddr);

  // uint256 public thirdNum;
  const thirdNum = BigInt(await getStorageHex(deployReceipt.contractAddress, 2));
  console.log("thirdNum:", thirdNum);

  // string public fourthStr;
  const fourthStr = hre.ethers.toUtf8String((await getStorageHex(deployReceipt.contractAddress, 3)).substring(0, 64));
  console.log("fourthStr:", fourthStr);

  // string public fifthStr;
  const fifthStr = await getLongString(deployReceipt.contractAddress, 4, "fifthStr");

  // uint256[3] public sixthNums;
  const sixthNumsFirst = BigInt(await getStorageHex(deployReceipt.contractAddress, 5));
  console.log("sixthNums[0]:", sixthNumsFirst);
  const sixthNumsSecond = BigInt(await getStorageHex(deployReceipt.contractAddress, 6));
  console.log("sixthNums[0]:", sixthNumsSecond);
  const sixthNumsThird = BigInt(await getStorageHex(deployReceipt.contractAddress, 7));
  console.log("sixthNums[0]:", sixthNumsThird);

  // uint256[] public seventhNums;
  await getDynamicUintArray(deployReceipt.contractAddress, 8, "seventhNums");

  // Profile public profile;
  await getProfile(deployReceipt.contractAddress, 9n, "profile");

  // Profile[] public profiles;
  await getDynamicProfileArray(deployReceipt.contractAddress, 12, "profiles");

  // mapping(uint256 => address) public numToAddr;
  const numToAddrFirstHex = await getStorageHex(deployReceipt.contractAddress, BigInt(hre.ethers.keccak256(hre.ethers.concat([
    hre.ethers.zeroPadValue(hre.ethers.toBeHex(55n), 32),
    hre.ethers.zeroPadValue(hre.ethers.toBeHex(13n), 32),
  ]))));
  console.log("numToAddr[55]:", hre.ethers.getAddress(`0x${numToAddrFirstHex.substring(26)}`));
  const numToAddrSecondHex = await getStorageHex(deployReceipt.contractAddress, BigInt(hre.ethers.keccak256(hre.ethers.concat([
    hre.ethers.zeroPadValue(hre.ethers.toBeHex(66n), 32),
    hre.ethers.zeroPadValue(hre.ethers.toBeHex(13n), 32),
  ]))));
  console.log("numToAddr[66]:", hre.ethers.getAddress(`0x${numToAddrSecondHex.substring(26)}`));

  // mapping(address => Profile) public addressToProfile;
  const addressToProfileSlotFirst = BigInt(hre.ethers.keccak256(hre.ethers.concat([
    hre.ethers.zeroPadValue("0xF95b7855f6808fDA0CD940272d1416e89b338cc2".toLowerCase(), 32),
    hre.ethers.zeroPadValue(hre.ethers.toBeHex(14n), 32),
  ])));
  await getProfile(deployReceipt.contractAddress, addressToProfileSlotFirst, "addressToProfile[0xF95b7855f6808fDA0CD940272d1416e89b338cc2]");
  const addressToProfileSlotSecond = BigInt(hre.ethers.keccak256(hre.ethers.concat([
    hre.ethers.zeroPadValue("0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428".toLowerCase(), 32),
    hre.ethers.zeroPadValue(hre.ethers.toBeHex(14n), 32),
  ])));
  await getProfile(deployReceipt.contractAddress, addressToProfileSlotSecond, "addressToProfile[0xFfeeBF9dCE4e736314eA2d16984016d4Ae46b428]");
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
