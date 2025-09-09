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

  // Event 1: Multi-tier Rock Fest
  let tx = await concertTicketMarketplace.createEvent(
    "Rock Fest 2025",
    now + oneDay * 10, // 10 days from now
    ["General Admission", "VIP"],
    [ethers.parseEther("0.05"), ethers.parseEther("0.15")],
    [200, 50]
  );
  await tx.wait();
  console.log("Created Multi-Tier Event: Rock Fest 2025");

  // Event 2: Multi-tier Jazz Night
  tx = await concertTicketMarketplace.createEvent(
    "Jazz Night",
    now + oneDay * 20, // 20 days from now
    ["Standard", "Balcony"],
    [ethers.parseEther("0.02"), ethers.parseEther("0.04")],
    [100, 50]
  );
  await tx.wait();
  console.log("Created Multi-Tier Event: Jazz Night");

  // --- Add 10 More Events ---
  console.log("Seeding 10 additional events...");

  const additionalEvents = [
    {
      name: "Indie Pop Showcase",
      date: now + oneDay * 30,
      tiers: { names: ["Pista", "Mezanino"], prices: ["0.03", "0.06"], quantities: [300, 100] }
    },
    {
      name: "Symphony of the Stars",
      date: now + oneDay * 45,
      tiers: { names: ["Plateia A", "Plateia B", "Camarote"], prices: ["0.1", "0.07", "0.2"], quantities: [150, 250, 40] }
    },
    {
      name: "Summer Reggae Festival",
      date: now + oneDay * 60,
      tiers: { names: ["Entrada Única"], prices: ["0.04"], quantities: [1500] }
    },
    {
      name: "Teatro: A Comédia da Vida",
      date: now + oneDay * 70,
      tiers: { names: ["Assento Marcado"], prices: ["0.025"], quantities: [200] }
    },
    {
      name: "Metal Legends United",
      date: now + oneDay * 80,
      tiers: { names: ["Pista Premium", "Pista Comum"], prices: ["0.09", "0.06"], quantities: [400, 1000] }
    },
    {
      name: "Workshop de Fotografia com Ana Dias",
      date: now + oneDay * 90,
      tiers: { names: ["Vaga"], prices: ["0.15"], quantities: [30] }
    },
    {
      name: "Stand-up Comedy Night",
      date: now + oneDay * 100,
      tiers: { names: ["Mesa (4 pessoas)", "Individual"], prices: ["0.12", "0.035"], quantities: [50, 100] }
    },
    {
      name: "Exposição de Arte Digital 'Futurismo'",
      date: now + oneDay * 110,
      tiers: { names: ["Entrada"], prices: ["0.01"], quantities: [500] }
    },
    {
      name: "Lançamento do Livro 'Crônicas de Gelo'",
      date: now + oneDay * 120,
      tiers: { names: ["Entrada + Livro", "Apenas Entrada"], prices: ["0.05", "0.015"], quantities: [100, 200] }
    },
    {
      name: "Final do Campeonato de eSports",
      date: now + oneDay * 130,
      tiers: { names: ["Arena", "VIP Experience"], prices: ["0.06", "0.18"], quantities: [2000, 150] }
    }
  ];

  for (const event of additionalEvents) {
    tx = await concertTicketMarketplace.createEvent(
      event.name,
      event.date,
      event.tiers.names,
      event.tiers.prices.map(p => ethers.parseEther(p)),
      event.tiers.quantities
    );
    await tx.wait();
    console.log(`Created Event: ${event.name}`);
  }
  console.log("Finished seeding additional events.");

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
