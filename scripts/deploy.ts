import { Contract, ContractFactory } from "ethers";
import "@nomiclabs/hardhat-waffle";
import hre, { ethers } from "hardhat";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  if (!process.env.OWNERS) {
    throw Error("Specify OWNERS");
  }

  const owners = process.env.OWNERS.split(",");
  const Nfp: ContractFactory = await ethers.getContractFactory("NFP");
  const nfp: Contract = await Nfp.deploy(owners);
  await nfp.deployed();

  for (let i = 0; i < 4; i++) {
    try {
      await hre.run("verify:verify", {
        address: nfp.address,
        constructorArguments: [owners],
      });
    } catch (err) {
      console.log(err);
      await sleep(10000);
      continue;
    }
    console.log("verified");
    break;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
