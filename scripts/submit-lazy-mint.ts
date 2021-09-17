import { createTypeData, signTypedData } from "./sign";

import Axios from "axios";
import { ethers } from "ethers";

export type Part = {
  account: string;
  value: string;
};

type LazyMint = {
  "@type": "ERC721";
  contract: string;
  tokenId: string;
  uri: string;
  creators: Part[];
  royalties: Part[];
  signatures: string[];
};

export const ERC721Types = {
  Part: [
    { name: "account", type: "address" },
    { name: "value", type: "uint96" },
  ],
  Mint721: [
    { name: "tokenId", type: "uint256" },
    { name: "tokenURI", type: "string" },
    { name: "creators", type: "Part[]" },
    { name: "royalties", type: "Part[]" },
  ],
};

async function generateTokenId(type: "ERC721" | "ERC1155", minter: string): Promise<string> {
  console.log("generating tokenId for", getAddress(type), minter);
  const res = await Axios.get(
    `https://api-staging.rarible.com/protocol/v0.1/ethereum/nft/collections/${getAddress(
      type
    )}/generate_token_id?minter=${minter}`
  );
  return res.data.tokenId;
}

async function putLazyMint(form: LazyMint) {
  try {
    const res = await Axios.post("https://api-staging.rarible.com/protocol/v0.1/ethereum/nft/mints", form);
    return res.data;
  } catch (err) {
    console.log(err.response.data);
    throw Error("Can't post lazy mint");
  }
}

export async function signAndPutLazyMint(form: Omit<LazyMint, "signatures">): Promise<any> {
  const signed = await signLazyMint(form);
  return putLazyMint(signed);
}

async function signLazyMint(form: Omit<LazyMint, "signatures">): Promise<LazyMint> {
  const signature = await signLazyMintMessage(form, form.creators[0].account, 4, getAddress(form["@type"]));
  return { ...form, signatures: [signature] } as any;
}

function getAddress(type: "ERC721" | "ERC1155"): string {
  if (!process.env.COLLECTION_CONTRACT) {
    throw Error("Specify COLLECTION_CONTRACT");
  }
  return process.env.COLLECTION_CONTRACT;
}

async function signLazyMintMessage(
  form: Omit<LazyMint, "signatures">,
  account: string,
  chainId: number,
  verifyingContract: string
) {
  const typeName = form["@type"] === "ERC721" ? "Mint721" : "Mint1155";
  const data = createTypeData(
    {
      name: typeName,
      version: "1",
      chainId,
      verifyingContract,
    },
    typeName,
    { ...form, tokenURI: form.uri },
    ERC721Types
  );
  return signTypedData(account, data);
}

export async function createTestLazyMint(): Promise<Omit<LazyMint, "signatures">> {
  if (!process.env.PRIV_KEY_CREATOR) {
    throw Error("Specify PRIV_KEY_CREATOR");
  }

  const wallet = new ethers.Wallet(process.env.PRIV_KEY_CREATOR);
  const creator = wallet.address;
  console.log("creator is", creator);

  const tokenId = await generateTokenId("ERC721", creator);
  console.log("generated tokenId", tokenId);
  return {
    "@type": "ERC721",
    contract: getAddress("ERC721"),
    tokenId: tokenId,
    uri: "/ipfs/QmTWR82f5Xbf3HvC7ZjK5L78RREERyDdK7yfZCTFmNiewB",
    creators: [{ account: creator, value: "10000" }],
    royalties: [],
  };
}

export async function main(): Promise<any> {
  const form = await createTestLazyMint();
  console.log(await signAndPutLazyMint(form));
}

export const printNextTokenId = async() => {
  if (!process.env.PRIV_KEY_CREATOR) {
    throw Error("Specify PRIV_KEY_CREATOR");
  }

  const wallet = new ethers.Wallet(process.env.PRIV_KEY_CREATOR);
  const creator = wallet.address;
  console.log("creator is", creator);

  const tokenId = await generateTokenId("ERC721", creator);
  console.log(await tokenId)
}
// main();
printNextTokenId()

