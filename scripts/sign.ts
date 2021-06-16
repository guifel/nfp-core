import { ethers } from "ethers";
import { signTypedData_v4 } from "eth-sig-util";

export type TypedData = Array<Record<string, any>>;
const DOMAIN_TYPE: TypedData = [
  {
    type: "string",
    name: "name",
  },
  {
    type: "string",
    name: "version",
  },
  {
    type: "uint256",
    name: "chainId",
  },
  {
    type: "address",
    name: "verifyingContract",
  },
];

export type DomainData = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export function createTypeData(
    domainData: DomainData,
    primaryType: string,
    message: any,
    types: Record<string, TypedData>
  ) {
    return {
      types: Object.assign(
        {
          EIP712Domain: DOMAIN_TYPE
        },
        types
      ),
      domain: domainData,
      primaryType: primaryType,
      message: message
    };
  }

export async function signTypedData(from: string, data: any) {
  if (!process.env.PRIV_KEY_CREATOR) {
    throw Error("Specify PRIV_KEY_CREATOR");
  }

  const wallet = new ethers.Wallet(process.env.PRIV_KEY_CREATOR);
  const account = wallet.address;
  return signTypedData_v4(Buffer.from(process.env.PRIV_KEY_CREATOR, "hex"), { data });
}
