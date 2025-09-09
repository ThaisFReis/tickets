const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");


describe("ConcertTicketMarketplace", function () {
  let ConcertTicketMarketplace;
  let concertTicketMarketplace;
  let owner;
  let addr1;
  let eventDate;
  const ticketPrice = ethers.parseEther("0.1");

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    ConcertTicketMarketplace = await ethers.getContractFactory("ConcertTicketMarketplace");
    concertTicketMarketplace = await ConcertTicketMarketplace.deploy("MyTickets", "MTK");
    eventDate = (await time.latest()) + 3600; // 1 hour from now
  });

  describe("Event Creation with Tiers", function () {
    it("Should allow the owner to create an event with multiple ticket tiers", async function () {
      const eventName = "Multi-Tier Concert";
      const ticketTypeNames = ["VIP", "General Admission"];
      const ticketTypePrices = [ethers.parseEther("0.5"), ethers.parseEther("0.2")];
      const ticketTypeQuantities = [50, 200];

      // The new createEvent function will take arrays for tier details
      await expect(concertTicketMarketplace.createEvent(
        eventName,
        eventDate,
        ticketTypeNames,
        ticketTypePrices,
        ticketTypeQuantities
      )).to.emit(concertTicketMarketplace, "EventCreated").withArgs(1, eventName, eventDate, owner.address);

      // Verify the details of the first ticket tier (VIP)
      const vipTier = await concertTicketMarketplace.getTicketTier(1, 1); // eventId 1, typeId 1
      expect(vipTier.name).to.equal("VIP");
      expect(vipTier.price).to.equal(ticketTypePrices[0]);
      expect(vipTier.quantity).to.equal(ticketTypeQuantities[0]);
      expect(vipTier.sold).to.equal(0);

      // Verify the details of the second ticket tier (General Admission)
      const gaTier = await concertTicketMarketplace.getTicketTier(1, 2); // eventId 1, typeId 2
      expect(gaTier.name).to.equal("General Admission");
      expect(gaTier.price).to.equal(ticketTypePrices[1]);
      expect(gaTier.quantity).to.equal(ticketTypeQuantities[1]);
      expect(gaTier.sold).to.equal(0);
    });
  });

  describe("Ticket Sales with Tiers", function () {
    const eventName = "Multi-Tier Concert";
    const ticketTypeNames = ["VIP", "GA"];
    const ticketTypePrices = [ethers.parseEther("0.5"), ethers.parseEther("0.2")];
    const ticketTypeQuantities = [2, 5]; // Low quantity for testing sold out scenarios

    beforeEach(async function() {
      // Create a new multi-tier event for each test
      await concertTicketMarketplace.createEvent(
        eventName,
        eventDate,
        ticketTypeNames,
        ticketTypePrices,
        ticketTypeQuantities
      );
    });

    it("Should allow a user to buy multiple tickets for a specific tier and seats", async function () {
      const eventId = 1;
      const typeId = 1; // VIP
      const seatIds = [1, 2];
      const totalPrice = ticketTypePrices[0] * BigInt(seatIds.length);

      await expect(concertTicketMarketplace.connect(addr1).buyTicket(eventId, typeId, seatIds, { value: totalPrice }))
        .to.emit(concertTicketMarketplace, "TicketPurchased")
        // We expect one event per ticket purchased
        .withArgs(eventId, 1, addr1.address, typeId, seatIds[0])
        .and.to.emit(concertTicketMarketplace, "TicketPurchased")
        .withArgs(eventId, 2, addr1.address, typeId, seatIds[1]);

      const vipTier = await concertTicketMarketplace.getTicketTier(eventId, typeId);
      expect(vipTier.sold).to.equal(seatIds.length);

      expect(await concertTicketMarketplace.getSeatOwner(eventId, typeId, seatIds[0])).to.equal(addr1.address);
      expect(await concertTicketMarketplace.getSeatOwner(eventId, typeId, seatIds[1])).to.equal(addr1.address);
    });

    it("Should fail if a user tries to buy an already sold seat", async function () {
      const eventId = 1;
      const typeId = 1; // VIP
      const seatIds = [1];
      const totalPrice = ticketTypePrices[0];

      // First purchase
      await concertTicketMarketplace.connect(addr1).buyTicket(eventId, typeId, seatIds, { value: totalPrice });

      // Second attempt on the same seat
      await expect(concertTicketMarketplace.connect(owner).buyTicket(eventId, typeId, seatIds, { value: totalPrice }))
        .to.be.revertedWith("Seat is already sold");
    });

    it("Should fail if the sent value is insufficient", async function () {
      const eventId = 1;
      const typeId = 1; // VIP
      const seatIds = [1, 2];
      const insufficientValue = ticketTypePrices[0]; // Price for 1, but buying 2

      await expect(concertTicketMarketplace.connect(addr1).buyTicket(eventId, typeId, seatIds, { value: insufficientValue }))
        .to.be.revertedWith("Insufficient payment");
    });

    it("Should fail if trying to buy more tickets than available for that tier", async function () {
      const eventId = 1;
      const typeId = 1; // VIP (quantity: 2)
      const seatIds = [1, 2, 3]; // Trying to buy 3
      const totalPrice = ticketTypePrices[0] * BigInt(seatIds.length);

      await expect(concertTicketMarketplace.connect(addr1).buyTicket(eventId, typeId, seatIds, { value: totalPrice }))
        .to.be.revertedWith("Not enough tickets available for this tier");
    });
  });
});
