import { Wallet } from "ethers";
import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  const proposals = process.argv.slice(2); // This line allows arguments from the terminal when deployed, the first two output are node modules and location
  //(use yarn run ts-node --files .\scripts\Deployment.ts "arg1" "arg2" arg3")
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const provider = ethers.getDefaultProvider("goerli");
  // const wallet = ethers.Wallet.createRandom();
  // const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? ""); // Creates new wallet from private key
  const signer = wallet.connect(provider)
  console.log(`this address has balance ${signer.address} wei`)
  const balance = await signer.getBalance();
  console.log(`this address has balance ${balance} wei`)
  // const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  await ballotContract.deployed();
  console.log(`Deployed at: ${ballotContract.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});