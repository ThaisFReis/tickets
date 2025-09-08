const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const tokenName = "MyTickets";
  const tokenSymbol = "MTK";

  const ConcertTicketMarketplace = await ethers.getContractFactory("ConcertTicketMarketplace");
  const concertTicketMarketplace = await ConcertTicketMarketplace.deploy(tokenName, tokenSymbol);

  await concertTicketMarketplace.waitForDeployment();

  const contractAddress = await concertTicketMarketplace.getAddress();
  console.log("ConcertTicketMarketplace deployed to:", contractAddress);

  // --- Seed the contract with some events ---
  console.log("Seeding the contract with initial events...");

  const now = Math.floor(Date.now() / 1000);
  const oneDay = 86400;

  // Event 1: General Admission
  let tx = await concertTicketMarketplace.createEvent(
    "Rock Fest 2025",
    now + oneDay * 10, // 10 days from now
    ethers.parseEther("0.05"),
    100, // totalSupply
    false,
    0
  );
  await tx.wait();
  console.log("Created General Admission Event: Rock Fest 2025");

  // Event 2: Assigned Seating
  tx = await concertTicketMarketplace.createEvent(
    "Jazz Night",
    now + oneDay * 20, // 20 days from now
    ethers.parseEther("0.1"),
    0,
    true,
    150 // totalSeats
  );
  await tx.wait();
  console.log("Created Assigned Seating Event: Jazz Night");

  // --- Save deployment artifacts for the frontend ---

  // 1. Save the contract address
  const addressPath = path.join(__dirname, "..", "deployment-address.json");
  fs.writeFileSync(
    addressPath,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );
  console.log(`Contract address saved to ${addressPath}`);

  // 2. Save the contract ABI
  const abiDir = path.join(__dirname, "..", "artifacts", "contracts", "ConcertTicketMarketplace.sol");
  const abiSrcPath = path.join(abiDir, "ConcertTicketMarketplace.json");
  const abiDestPath = path.join(__dirname, "..", "..", "frontend", "src", "contract-abi.json");
  
  const abiFile = fs.readFileSync(abiSrcPath, "utf8");
  const abiJson = JSON.parse(abiFile);

  fs.writeFileSync(
    abiDestPath,
    JSON.stringify(abiJson.abi, undefined, 2)
  );
  console.log(`Contract ABI saved to ${abiDestPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
