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
      "General Admission Flor": { capacity: 700, type: "standing" },
      "Premium Floor": { capacity: 500, type: "standing" },
      "Mezzanine 1": { capacity: 800, type: "seated" },
      "Mezzanine 2": { capacity: 900, type: "seated" },
      "VIP Box": { capacity: 100, type: "seated" },
      "General Admission Lawn": { capacity: 1000, type: "seated" },
    },
  },
  {
    name: "Neo-Kyoto Convention Center",
    seating: {
      "Workshop Pass": { capacity: 50, type: "standing" },
      "Auditorium Seat": { capacity: 300, type: "seated" },
    },
  },
  {
    name: "The Grand Theatre",
    seating: {
      Orchestra: { capacity: 400, type: "seated" },
      Mezzanine: { capacity: 300, type: "seated" },
      Balcony: { capacity: 250, type: "seated" },
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
    tierQuantities: {
      "General Admission Flor": 700,
      "Premium Floor": 500,
      "Mezzanine 1": 800,
      "Mezzanine 2": 2,
      "VIP Box": 100,
      "General Admission Lawn": 1000,
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
    tierQuantities: {
      "Workshop Pass": 50,
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
    tierQuantities: {
      Orchestra: 400,
      Mezzanine: 300,
      Balcony: 250,
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
    tierQuantities: {
      "General Admission Flor": 700,
      "Premium Floor": 500,
      "Mezzanine 1": 800,
      "Mezzanine 2": 900,
      "VIP Box": 100,
      "General Admission Lawn": 1000,
    },
  },
  {
    name: "Jazz Under the Stars",
    location: "The Grand Theatre",
    date: "2026-04-12",
    time: "19:00",
    category: "show",
    subcategory: "Jazz",
    ticketPrices: {
      Orchestra: "0.08",
      Mezzanine: "0.05",
      Balcony: "0.03",
    },
    tierQuantities: {
      Orchestra: 400,
      Mezzanine: 300,
      Balcony: 250,
    },
  },
  {
    name: "Realms of Steel",
    location: "Starlight Amphitheater",
    date: "2026-05-20",
    time: "18:00",
    category: "show",
    subcategory: "Metal",
    ticketPrices: {
      "General Admission Flor": "2.5",
      "Premium Floor": "4",
      "Mezzanine 1": "1.5",
      "Mezzanine 2": "1",
      "VIP Box": "8",
      "General Admission Lawn": "0.4",
    },
    tierQuantities: {
      "General Admission Flor": 700,
      "Premium Floor": 500,
      "Mezzanine 1": 800,
      "Mezzanine 2": 900,
      "VIP Box": 100,
      "General Admission Lawn": 1000,
    },
  },
  {
    name: "Capturing the Moment: A Photography Workshop",
    location: "Neo-Kyoto Convention Center",
    date: "2026-06-15",
    time: "10:00",
    category: "workshop",
    subcategory: "Photography",
    ticketPrices: {
      "Workshop Pass": "0.2",
    },
    tierQuantities: {
      "Workshop Pass": 5,
    },
  },
  {
    name: "Chronicles of Laughter",
    location: "Neo-Kyoto Convention Center",
    date: "2026-07-22",
    time: "20:00",
    category: "culture",
    subcategory: "Stand-up",
    ticketPrices: {
      "Auditorium Seat": "0.04",
    },
    tierQuantities: {
      "Auditorium Seat": 300,
    },
  },
  {
    name: "Indie Echoes Fest",
    location: "The Grand Theatre",
    date: "2026-08-01",
    time: "17:00",
    category: "show",
    subcategory: "Indie",
    ticketPrices: {
      Orchestra: "0.05",
      Mezzanine: "0.035",
      Balcony: "0.02",
    },
    tierQuantities: {
      Orchestra: 400,
      Mezzanine: 300,
      Balcony: 1,
    },
  },
  {
    name: "Cybernetic Showdown",
    location: "Neo-Kyoto Convention Center",
    date: "2026-09-18",
    time: "12:00",
    category: "esports",
    subcategory: "Tournament",
    ticketPrices: {
      "Auditorium Seat": "0.1",
    },
    tierQuantities: {
      "Auditorium Seat": 300,
    },
  },
    {
    name: "Echoes of the Void",
    location: "The Grand Theatre",
    date: "2026-10-31",
    time: "22:00",
    category: "show",
    subcategory: "Electronic",
    ticketPrices: {
      "Orchestra": "0.1",
    },
    tierQuantities: {
      "Orchestra": 2,
    }
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
      (tier) => event.tierQuantities?.[tier] ?? locationDetails.seating[tier].capacity
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
