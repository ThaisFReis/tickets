import React, { useState } from "react";
import PropTypes from "prop-types";
import TicketCard from "../components/TicketCard";
import ViewTicketModal from "../components/ViewTicketModal";

const ProfilePage = ({ tickets, userAddress }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const now = new Date();

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm-px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-12">
          <h1 className="text-6xl font-extrabold uppercase">My Tickets</h1>
          <p className="text-muted-foreground font-mono text-lg mt-2">
            {userAddress}
          </p>
        </div>

        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.tokenId}
                ticket={ticket}
                onSelectTicket={() => setSelectedTicket(ticket)}
                isPast={new Date(ticket.eventDate) < now}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            You don't have any tickets yet.
          </p>
        )}
      </main>
      <ViewTicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
};

ProfilePage.propTypes = {
  tickets: PropTypes.array.isRequired,
  userAddress: PropTypes.string.isRequired,
};

export default ProfilePage;
