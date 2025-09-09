// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConcertTicketMarketplace is ERC721Enumerable, Ownable {
    struct TicketType {
        uint256 typeId;
        string name;
        uint256 price;
        uint256 quantity;
        uint256 sold;
    }

    struct Event {
        uint256 eventId;
        string name;
        uint256 date;
        address organizer;
        mapping(uint256 => TicketType) ticketTiers;
        uint256 nextTypeId;
        mapping(uint256 => mapping(uint256 => address)) seatOwners; // typeId => seatId => owner
    }

    struct Ticket {
        uint256 eventId;
        uint256 typeId;
        uint256 seatId;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    uint256 public nextEventId = 1;
    uint256 public nextTokenId = 1;

    event EventCreated(
        uint256 eventId,
        string name,
        uint256 date,
        address organizer
    );

    event TicketPurchased(
        uint256 eventId,
        uint256 tokenId,
        address owner,
        uint256 typeId,
        uint256 seatId
    );

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {}

    function createEvent(
        string memory _name,
        uint256 _date,
        string[] memory _ticketTypeNames,
        uint256[] memory _ticketTypePrices,
        uint256[] memory _ticketTypeQuantities
    ) public onlyOwner {
        require(_date > block.timestamp, "Event date must be in the future");
        require(_ticketTypeNames.length == _ticketTypePrices.length, "Array lengths must match");
        require(_ticketTypeNames.length == _ticketTypeQuantities.length, "Array lengths must match");

        Event storage newEvent = events[nextEventId];
        newEvent.eventId = nextEventId;
        newEvent.name = _name;
        newEvent.date = _date;
        newEvent.organizer = msg.sender;
        newEvent.nextTypeId = 1;

        for (uint256 i = 0; i < _ticketTypeNames.length; i++) {
            require(_ticketTypePrices[i] > 0, "Price must be greater than 0");
            require(_ticketTypeQuantities[i] > 0, "Quantity must be greater than 0");
            
            uint256 typeId = newEvent.nextTypeId;
            newEvent.ticketTiers[typeId] = TicketType(
                typeId,
                _ticketTypeNames[i],
                _ticketTypePrices[i],
                _ticketTypeQuantities[i],
                0
            );
            newEvent.nextTypeId++;
        }

        emit EventCreated(nextEventId, _name, _date, msg.sender);
        nextEventId++;
    }

    function buyTicket(
        uint256 _eventId,
        uint256 _typeId,
        uint256[] memory _seatIds
    ) public payable {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        Event storage currentEvent = events[_eventId];
        TicketType storage ticketTier = currentEvent.ticketTiers[_typeId];

        require(block.timestamp < currentEvent.date, "Event has already passed");
        require(ticketTier.price > 0, "Invalid ticket tier"); // Check if tier exists

        uint256 totalCost = ticketTier.price * _seatIds.length;
        require(msg.value >= totalCost, "Insufficient payment");

        require(
            ticketTier.sold + _seatIds.length <= ticketTier.quantity,
            "Not enough tickets available for this tier"
        );

        for (uint256 i = 0; i < _seatIds.length; i++) {
            uint256 seatId = _seatIds[i];
            require(
                currentEvent.seatOwners[_typeId][seatId] == address(0),
                "Seat is already sold"
            );

            currentEvent.seatOwners[_typeId][seatId] = msg.sender;
            tickets[nextTokenId] = Ticket(_eventId, _typeId, seatId);
            _safeMint(msg.sender, nextTokenId);
            emit TicketPurchased(
                _eventId,
                nextTokenId,
                msg.sender,
                _typeId,
                seatId
            );
            nextTokenId++;
        }

        ticketTier.sold += _seatIds.length;
    }

    function getEventDetails(
        uint256 _eventId
    ) public view returns (string memory name, uint256 date, address organizer) {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        Event storage currentEvent = events[_eventId];
        return (currentEvent.name, currentEvent.date, currentEvent.organizer);
    }

    function getTicketTier(
        uint256 _eventId,
        uint256 _typeId
    ) public view returns (TicketType memory) {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        require(_typeId > 0 && _typeId < events[_eventId].nextTypeId, "Tier not found");
        return events[_eventId].ticketTiers[_typeId];
    }

    function getSeatOwner(
        uint256 _eventId,
        uint256 _typeId,
        uint256 _seatId
    ) public view returns (address) {
        require(_eventId > 0 && _eventId < nextEventId, "Event not found");
        return events[_eventId].seatOwners[_typeId][_seatId];
    }

    function getTicketsOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal override(ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
