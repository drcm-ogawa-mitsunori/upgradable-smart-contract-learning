import * as hre from "hardhat";
import { A004ProxyStorage } from "../typechain-types";
import { getStorageHex } from "./utils/getStorageHex";

const deployContract = async (contractName: "A004ProxyStorage" | "A004ImplementationA" | "A004ImplementationB") => {
  const factory = await hre.ethers.getContractFactory(contractName);
  const deployTx = await factory.deploy();
  const deployReceipt = await deployTx.deploymentTransaction()?.wait();

  if (!deployReceipt?.contractAddress) {
    throw new Error(`Deploy ${contractName} Transaction receipt not found`);
  }
  console.log(`${contractName} deployed to:`, deployReceipt.contractAddress);
  return deployReceipt.contractAddress;
}

const checkProxyStorageData = async (a004ProxyStorage: A004ProxyStorage, proxyStorageAddress: string, implementationAddress: string, implementationContractName: "ImplementationA" | "ImplementationB") => {
  // ProxyStorage の getXXX は delegatecall を呼び出しており、 delegatecall の先では storage の変更有無が不明なので solc では pure or view を付与する事ができない
  // そのため ethers.js では reader function として認識されず、自前で data を作って call する必要がある
  const provider = hre.ethers.provider;

  const num1Result = await provider.call({
    to: proxyStorageAddress,
    data: a004ProxyStorage.interface.encodeFunctionData("getNum1", [implementationAddress]),
  });
  const decodedNum1Result = hre.ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], num1Result);
  console.log(`ProxyStorage -> ${implementationContractName} getNum:`, decodedNum1Result[0].toString());

  const addrResult = await provider.call({
    to: proxyStorageAddress,
    data: a004ProxyStorage.interface.encodeFunctionData("getAddr", [implementationAddress]),
  });
  const decodedAddrResult = hre.ethers.AbiCoder.defaultAbiCoder().decode(["address"], addrResult);
  console.log(`ProxyStorage -> ${implementationContractName} getAddr:`, decodedAddrResult[0]);

  const num2Result = await provider.call({
    to: proxyStorageAddress,
    data: a004ProxyStorage.interface.encodeFunctionData("getNum2", [implementationAddress]),
  });
  const decodedNum2Result = hre.ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], num2Result);
  console.log(`ProxyStorage -> ${implementationContractName} getNum:`, decodedNum2Result[0].toString());

  const flagResult = await provider.call({
    to: proxyStorageAddress,
    data: a004ProxyStorage.interface.encodeFunctionData("getFlag", [implementationAddress]),
  });
  const decodedFlagResult = hre.ethers.AbiCoder.defaultAbiCoder().decode(["bool"], flagResult);
  console.log(`ProxyStorage -> ${implementationContractName} getFlag:`, decodedFlagResult[0]);
}

async function main() {
  const implementationAAddress = await deployContract("A004ImplementationA");
  const implementationBAddress = await deployContract("A004ImplementationB");
  const proxyStorageAddress = await deployContract("A004ProxyStorage");
  const a004ProxyStorage = await hre.ethers.getContractAt("A004ProxyStorage", proxyStorageAddress);

  // ImplementationA を使って ProxyStorage の storage slot に値を入れる
  await a004ProxyStorage.setNum1(implementationAAddress, 1234n);
  await a004ProxyStorage.setAddr(implementationAAddress, "0x6037298B1AF2D485e73A8431a0e7d592010ac09A");
  await a004ProxyStorage.setNum2(implementationAAddress, 5678n);
  await a004ProxyStorage.setFlag(implementationAAddress, true);

  // ImplementationA を介して ProxyStorage の値を見る
  await checkProxyStorageData(a004ProxyStorage, proxyStorageAddress, implementationAAddress, "ImplementationA");

  // ImplementationB を介して ProxyStorage の値を見る
  await checkProxyStorageData(a004ProxyStorage, proxyStorageAddress, implementationBAddress, "ImplementationB");

  // ProxyStorage の slot を直接見る
  await getStorageHex(proxyStorageAddress, 0);
  await getStorageHex(proxyStorageAddress, 1);
  await getStorageHex(proxyStorageAddress, 2);
  await getStorageHex(proxyStorageAddress, 3);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
