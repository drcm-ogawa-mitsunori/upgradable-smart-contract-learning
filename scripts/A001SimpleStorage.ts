import * as hre from "hardhat";
import { getStorageHex } from "./utils/getStorageHex";
import { getDynamicUintArray } from "./utils/getDynamicUintArray";
import { getLongString } from "./utils/getLongString";

const getProfile = async (contractAddress: string, slot: bigint, variableName: string) => {
  const profileName = hre.ethers.toUtf8String((await getStorageHex(contractAddress, slot)).substring(0, 64));
  console.log(`${variableName}.name:`, profileName);
  const profileAge = parseInt(await getStorageHex(contractAddress, slot + 1n));
  console.log(`${variableName}.age:`, profileAge);
  await getDynamicUintArray(contractAddress, slot + 2n, `${variableName}.scores`);
}

const getDynamicProfileArray = async (contractAddress: string, slot: number, variableName: string) => {
  const lengthHex = await getStorageHex(contractAddress, slot);
  let length = parseInt(lengthHex);
  console.log(`${variableName} length:`, length);
  const baseSlotHath = hre.ethers.keccak256(hre.ethers.zeroPadValue(hre.ethers.toBeHex(slot), 32));
  const baseSlotHathBn = BigInt(baseSlotHath);

  const provider = hre.ethers.provider;
  for (const i of Array(parseInt(length.toString())).fill(0).keys()) {
    const nameHex = await provider.getStorage(contractAddress, baseSlotHathBn + BigInt(i * 3));
    console.log(`${variableName} index[${i}].name:`, hre.ethers.toUtf8String(nameHex));
    const ageHex = await provider.getStorage(contractAddress, baseSlotHathBn + BigInt(i * 3 + 1));
    console.log(`${variableName} index[${i}].age:`, parseInt(ageHex));
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
  // 32 bytes に収まる変数なので slot 0 のみに格納されている
  const firstNum = parseInt(await getStorageHex(deployReceipt.contractAddress, 0));
  console.log("firstNum:", firstNum);

  // address public secondAddr;
  // 32 bytes に収まる変数なので slot 1 のみに格納されている
  const secondAddr = hre.ethers.getAddress(`0x${(await getStorageHex(deployReceipt.contractAddress, 1)).substring(26)}`);
  console.log("secondAddr:", secondAddr);

  // uint256 private thirdNum;
  // 32 bytes に収まる変数なので slot 2 のみに格納されている
  // private でも関係なく取得できる
  const thirdNum = parseInt(await getStorageHex(deployReceipt.contractAddress, 2));
  console.log("thirdNum:", thirdNum);

  // string public fourthStr;
  // string は末尾 1 byte に「 string として使用している slot bytes (hex) 文字列の長さ」が格納されている
  // 長さが `40` 未満の場合、同一 slot 内に格納されており、つまり割り当てられた slot 3 の前半 31 bytes に文字列が格納されている
  const fourthStr = hre.ethers.toUtf8String((await getStorageHex(deployReceipt.contractAddress, 3)).substring(0, 64)); // `0x` + 62文字を切り出している
  console.log("fourthStr:", fourthStr);

  // string public fifthStr;
  // string は末尾 1 byte に「 string として使用している slot bytes (hex) 文字列の長さ」が格納されている
  // 長さが `40` 以上の場合は `keccak256(base slot number)` を起点とする slot 以降に格納されている
  const fifthStr = await getLongString(deployReceipt.contractAddress, 4, "fifthStr");

  // uint256[3] public sixthNums;
  // 32 bytes に収まる変数の固定長配列は、最初の割当 slot 番号から順番に格納されている
  const sixthNumsFirst = parseInt(await getStorageHex(deployReceipt.contractAddress, 5));
  console.log("sixthNums[0]:", sixthNumsFirst);
  const sixthNumsSecond = parseInt(await getStorageHex(deployReceipt.contractAddress, 6));
  console.log("sixthNums[1]:", sixthNumsSecond);
  const sixthNumsThird = parseInt(await getStorageHex(deployReceipt.contractAddress, 7));
  console.log("sixthNums[2]:", sixthNumsThird);

  // uint256[] public seventhNums;
  // 動的配列の場合、割当 slot 番号には「配列の長さ」が格納されている
  // 実体は `keccak256(割当 slot 番号)` を起点とする slot 以降に格納されている
  await getDynamicUintArray(deployReceipt.contractAddress, 8, "seventhNums");

  // struct Profile {
  //     string name;
  //     uint256 age;
  //     uint256[] scores;
  // }
  // Profile public profile;
  // 構造体の場合、宣言された順番に slot 番号が割り当てられる
  await getProfile(deployReceipt.contractAddress, 9n, "profile");

  // Profile[] public profiles;
  // 構造体と動的配列の複合型
  await getDynamicProfileArray(deployReceipt.contractAddress, 12, "profiles");

  // mapping(uint256 => address) public numToAddr;
  // `key -> 32 bytes に収まる変数` mapping の場合、それぞれの値は `keccak256(key + 割当 slot 番号)` に格納されている
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
  // `key -> 配列や構造体` mapping の場合、それぞれの起点となる slot 番号は `keccak256(key + 割当 slot 番号)` となり、そこから配列や構造体ルールに従った slot に値が格納されている
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
