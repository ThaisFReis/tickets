const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// --- 1. Define Event Categories ---
const eventCategories = {
  show: [
    "Rock",
    "Pop",
    "Indie",
    "Electronic",
    "Jazz",
    "Symphony",
    "Reggae",
    "Metal",
  ],
  workshop: ["Tech", "Culinary", "Photography", "Writing"],
  culture: ["Theatre", "Stand-up", "Art", "Book Launch"],
  esports: ["Tournament"],
};

// --- 2. Define Event Locations ---
const eventLocations = [
  {
    name: "Starlight Amphitheater",
    seating: {
      "General Admission Flor": 700,
      "Premium Floor": 500,
      "Mezzanine 1": 800,
      "Mezzanine 2": 900,
      "VIP Box": 100,
      "General Admission Lawn": 1000,
    },
  },
  {
    name: "The Velvet Note",
    seating: {
      Standard: 150,
      Balcony: 50,
    },
  },
  {
    name: "Sector 7G",
    seating: {
      "General Admission": 2000,
    },
  },
  {
    name: "Neo-Kyoto Convention Center",
    seating: {
      "Workshop Pass": 50,
      "Auditorium Seat": 300,
    },
  },
  {
    name: "The Grand Theatre",
    seating: {
      Orchestra: 400,
      Mezzanine: 300,
      Balcony: 250,
    },
  },
];

// --- 3. Rewrite the Events Section ---
const eventsToCreate = [
  {
    name: "Synthwave Revival",
    location: "Starlight Amphitheater",
    date: "2025-10-20",
    time: "21:00",
    category: "show",
    subcategory: "Electronic",
    ticketPrices: {
      "General Admission Flor": "3",
      "Premium Floor": "4.5",
      "Mezzanine 1": "2",
      "Mezzanine 2": "1",
      "VIP Box": "10",
      "General Admission Lawn": "0.5",
    },
  },
  {
    name: "Jazz in the Dark",
    location: "The Velvet Note",
    date: "2025-11-15",
    time: "20:00",
    category: "show",
    subcategory: "Jazz",
    ticketPrices: {
      Standard: "0.04",
      Balcony: "0.07",
    },
  },
  {
    name: "Holografik Beats",
    location: "Sector 7G",
    date: "2025-12-31",
    time: "22:00",
    category: "show",
    subcategory: "Electronic",
    ticketPrices: {
      "General Admission": "0.1",
    },
  },
  {
    name: "Web3 & The Metaverse Workshop",
    location: "Neo-Kyoto Convention Center",
    date: "2026-01-20",
    time: "09:00",
    category: "workshop",
    subcategory: "Tech",
    ticketPrices: {
      "Workshop Pass": "0.15",
    },
  },
  {
    name: "The Quantum Paradox",
    location: "The Grand Theatre",
    date: "2026-02-10",
    time: "19:30",
    category: "culture",
    subcategory: "Theatre",
    ticketPrices: {
      Orchestra: "0.06",
      Mezzanine: "0.04",
      Balcony: "0.025",
    },
  },
  {
    name: "Orbital Odyssey",
    location: "Starlight Amphitheater",
    date: "2026-03-05",
    time: "20:00",
    category: "show",
    subcategory: "Rock",
    ticketPrices: {
      "General Admission Flor": "3",
      "Premium Floor": "4.5",
      "Mezzanine 1": "2",
      "Mezzanine 2": "1",
      "VIP Box": "10",
      "General Admission Lawn": "0.5",
    },
  },
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const tokenName = "MyTickets";
  const tokenSymbol = "MTK";

  const ConcertTicketMarketplace = await ethers.getContractFactory(
    "ConcertTicketMarketplace"
  );
  const concertTicketMarketplace = await ConcertTicketMarketplace.deploy(
    tokenName,
    tokenSymbol
  );

  await concertTicketMarketplace.waitForDeployment();

  const contractAddress = await concertTicketMarketplace.getAddress();
  console.log("ConcertTicketMarketplace deployed to:", contractAddress);

  // --- Seed the contract with the new events ---
  console.log("Seeding the contract with initial events...");

  for (const event of eventsToCreate) {
    // Find the location details
    const locationDetails = eventLocations.find(
      (l) => l.name === event.location
    );
    if (!locationDetails) {
      console.error(
        `Location "${event.location}" not found for event "${event.name}". Skipping.`
      );
      continue;
    }

    // Prepare data for the smart contract
    const tierNames = Object.keys(event.ticketPrices);
    const tierPrices = tierNames.map((tier) =>
      ethers.parseEther(event.ticketPrices[tier])
    );
    const tierQuantities = tierNames.map(
      (tier) => locationDetails.seating[tier]
    );

    // Combine date and time and convert to Unix timestamp
    const eventTimestamp = Math.floor(
      new Date(`${event.date}T${event.time}`).getTime() / 1000
    );

    try {
      const tx = await concertTicketMarketplace.createEvent(
        event.name,
        eventTimestamp,
        tierNames,
        tierPrices,
        tierQuantities
      );
      await tx.wait();
      console.log(`Created Event: ${event.name}`);
    } catch (error) {
      console.error(`Failed to create event "${event.name}":`, error);
    }
  }
  console.log("Finished seeding events.");

  // --- Save deployment artifacts for the frontend ---

  // 1. Save the contract address
  const addressPath = path.join(__dirname, "..", "deployment-address.json");
  fs.writeFileSync(
    addressPath,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );
  console.log(`Contract address saved to ${addressPath}`);

  // 2. Save the contract ABI
  const abiDir = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "ConcertTicketMarketplace.sol"
  );
  const abiSrcPath = path.join(abiDir, "ConcertTicketMarketplace.json");
  const abiDestPath = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "contract-abi.json"
  );

  const abiFile = fs.readFileSync(abiSrcPath, "utf8");
  const abiJson = JSON.parse(abiFile);

  fs.writeFileSync(abiDestPath, JSON.stringify(abiJson.abi, undefined, 2));
  console.log(`Contract ABI saved to ${abiDestPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
