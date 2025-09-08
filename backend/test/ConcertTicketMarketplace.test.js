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

  describe("Event Creation", function () {
    it("Should allow the owner to create a general admission event", async function () {
        const totalSupply = 100;
        const eventName = "Rock Concert";
        await expect(concertTicketMarketplace.createEvent(eventName, eventDate, ticketPrice, totalSupply, false, 0))
            .to.emit(concertTicketMarketplace, "EventCreated")
            .withArgs(1, eventName, eventDate, ticketPrice, totalSupply, owner.address);
    });

    it("Should allow the owner to create an assigned seating event", async function () {
        const eventName = "Classical Concert";
        const totalSeats = 200;
        await expect(concertTicketMarketplace.createEvent(eventName, eventDate, ticketPrice, 0, true, totalSeats))
            .to.emit(concertTicketMarketplace, "EventCreatedWithAssignedSeating")
            .withArgs(1, eventName, eventDate, ticketPrice, totalSeats, owner.address);
    });
  });

  describe("Ticket Sales (General Admission)", function () {
    const totalSupply = 2;
    beforeEach(async function () {
      await concertTicketMarketplace.createEvent("Rock Concert", eventDate, ticketPrice, totalSupply, false, 0);
    });

    it("Should allow a user to buy a general admission ticket", async function () {
      await expect(concertTicketMarketplace.connect(addr1).buyTicket(1, 0, { value: ticketPrice }))
        .to.emit(concertTicketMarketplace, "TicketPurchased")
        .withArgs(1, 1, addr1.address, 0);

      const event = await concertTicketMarketplace.getEventDetails(1);
      expect(event.sold).to.equal(1);
      expect(await concertTicketMarketplace.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if the event is sold out", async function () {
        await concertTicketMarketplace.connect(addr1).buyTicket(1, 0, { value: ticketPrice });
        await concertTicketMarketplace.connect(owner).buyTicket(1, 0, { value: ticketPrice });

        await expect(concertTicketMarketplace.connect(addr1).buyTicket(1, 0, { value: ticketPrice }))
            .to.be.revertedWith("Event is sold out");
    });

    it("Should fail if the event has already passed", async function () {
        await time.increaseTo(eventDate + 1);
        await expect(concertTicketMarketplace.connect(addr1).buyTicket(1, 0, { value: ticketPrice }))
            .to.be.revertedWith("Event has already passed");
    });

    it("Should fail with insufficient payment", async function () {
        const insufficientAmount = ethers.parseEther("0.05");
        await expect(concertTicketMarketplace.connect(addr1).buyTicket(1, 0, { value: insufficientAmount }))
            .to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Ticket Sales (Assigned Seating)", function () {
    const totalSeats = 100;
    const seatId = 5;

    beforeEach(async function () {
      await concertTicketMarketplace.createEvent("Classical Concert", eventDate, ticketPrice, 0, true, totalSeats);
    });

    it("Should allow a user to buy a specific seat", async function () {
      await expect(concertTicketMarketplace.connect(addr1).buyTicket(1, seatId, { value: ticketPrice }))
        .to.emit(concertTicketMarketplace, "TicketPurchased")
        .withArgs(1, 1, addr1.address, seatId);

      expect(await concertTicketMarketplace.isSeatSold(1, seatId)).to.be.true;
      expect(await concertTicketMarketplace.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail if a seat is already sold (double-booking)", async function () {
      await concertTicketMarketplace.connect(addr1).buyTicket(1, seatId, { value: ticketPrice });

      await expect(concertTicketMarketplace.connect(owner).buyTicket(1, seatId, { value: ticketPrice }))
        .to.be.revertedWith("Seat is already sold");
    });

    it("Should fail if the seat ID is invalid (out of bounds)", async function () {
      const invalidSeatId = totalSeats + 1;
      await expect(concertTicketMarketplace.connect(addr1).buyTicket(1, invalidSeatId, { value: ticketPrice }))
        .to.be.revertedWith("Invalid seat ID");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
        // Create a general admission event
        await concertTicketMarketplace.createEvent("Rock Concert", eventDate, ticketPrice, 100, false, 0);
        // Create an assigned seating event
        await concertTicketMarketplace.createEvent("Classical Concert", eventDate, ticketPrice, 0, true, 200);
        
        // addr1 buys a ticket for each event
        await concertTicketMarketplace.connect(addr1).buyTicket(1, 0, { value: ticketPrice }); // Token ID 1
        await concertTicketMarketplace.connect(addr1).buyTicket(2, 10, { value: ticketPrice }); // Token ID 2
    });

    it("Should return all ticket token IDs owned by a specific address", async function () {
        const ownedTickets = await concertTicketMarketplace.getTicketsOfOwner(addr1.address);
        expect(ownedTickets).to.have.lengthOf(2);
        expect(ownedTickets[0]).to.equal(1);
        expect(ownedTickets[1]).to.equal(2);
    });
  });
});
