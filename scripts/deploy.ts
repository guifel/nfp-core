import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

async function main(): Promise<void> {

  // We get the contract to deploy
  const Nfp: ContractFactory = await ethers.getContractFactory("NFP");
  const nfp: Contract = await Nfp.deploy();
  await nfp.deployed();

  console.log("NFP deployed to: ", nfp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
