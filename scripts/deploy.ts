import { Contract, ContractFactory } from "ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";

async function main(): Promise<void> {
  const Nfp: ContractFactory = await ethers.getContractFactory("NFP");
  const nfp: Contract = await Nfp.deploy();
  await nfp.deployed();

  console.log("NFP deployed to: ", nfp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
