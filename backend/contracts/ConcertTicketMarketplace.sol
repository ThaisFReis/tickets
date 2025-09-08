// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConcertTicketMarketplace is ERC721Enumerable, Ownable {
    struct Event {
        uint256 eventId;
        string name;
        uint256 date;
        uint256 ticketPrice;
        uint256 totalSupply;
        uint256 sold;
        address organizer;
        bool isAssignedSeating;
        uint256 totalSeats;
    }

    struct Ticket {
        uint256 eventId;
        uint256 seatId; // 0 for general admission
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => mapping(uint256 => bool)) public seatSold; // eventId => seatId => sold
    uint256 public nextEventId = 1;
    uint256 public nextTokenId = 1;

    event EventCreated(
        uint256 eventId,
        string name,
        uint256 date,
        uint256 ticketPrice,
        uint256 totalSupply,
        address organizer
    );

    event EventCreatedWithAssignedSeating(
        uint256 eventId,
        string name,
        uint256 date,
        uint256 ticketPrice,
        uint256 totalSeats,
        address organizer
    );

    event TicketPurchased(
        uint256 eventId,
        uint256 tokenId,
        address owner,
        uint256 seatId
    );

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {}

    function createEvent(
        string memory _name,
        uint256 _date,
        uint256 _ticketPrice,
        uint256 _totalSupply,
        bool _isAssignedSeating,
        uint256 _totalSeats
    ) public onlyOwner {
        require(_date > block.timestamp, "Event date must be in the future");
        require(_ticketPrice > 0, "Ticket price must be greater than 0");

        if (_isAssignedSeating) {
            require(_totalSeats > 0, "Total seats must be greater than 0");
            events[nextEventId] = Event(nextEventId, _name, _date, _ticketPrice, _totalSeats, 0, msg.sender, true, _totalSeats);
            emit EventCreatedWithAssignedSeating(nextEventId, _name, _date, _ticketPrice, _totalSeats, msg.sender);
        } else {
            require(_totalSupply > 0, "Total supply must be greater than 0");
            events[nextEventId] = Event(nextEventId, _name, _date, _ticketPrice, _totalSupply, 0, msg.sender, false, 0);
            emit EventCreated(nextEventId, _name, _date, _ticketPrice, _totalSupply, msg.sender);
        }
        nextEventId++;
    }

    function buyTicket(uint256 _eventId, uint256 _seatId) public payable {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        Event storage currentEvent = events[_eventId];

        require(block.timestamp < currentEvent.date, "Event has already passed");
        require(msg.value >= currentEvent.ticketPrice, "Insufficient payment");

        if (currentEvent.isAssignedSeating) {
            require(_seatId > 0 && _seatId <= currentEvent.totalSeats, "Invalid seat ID");
            require(!seatSold[_eventId][_seatId], "Seat is already sold");

            seatSold[_eventId][_seatId] = true;
            tickets[nextTokenId] = Ticket(_eventId, _seatId);
            _safeMint(msg.sender, nextTokenId);
            emit TicketPurchased(_eventId, nextTokenId, msg.sender, _seatId);
        } else {
            require(currentEvent.sold < currentEvent.totalSupply, "Event is sold out");
            tickets[nextTokenId] = Ticket(_eventId, 0);
            _safeMint(msg.sender, nextTokenId);
            emit TicketPurchased(_eventId, nextTokenId, msg.sender, 0);
        }
        
        currentEvent.sold++;
        nextTokenId++;
    }

    function getEventDetails(uint256 _eventId) public view returns (Event memory) {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        return events[_eventId];
    }

    function isSeatSold(uint256 _eventId, uint256 _seatId) public view returns (bool) {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        return seatSold[_eventId][_seatId];
    }

    function getAllEvents() public view returns (Event[] memory) {
        uint256 eventCount = nextEventId - 1;
        Event[] memory allEvents = new Event[](eventCount);
        for (uint256 i = 1; i <= eventCount; i++) {
            allEvents[i-1] = events[i];
        }
        return allEvents;
    }

    function getTicketsOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
