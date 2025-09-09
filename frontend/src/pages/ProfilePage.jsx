import React from 'react';
import PropTypes from 'prop-types';

const ProfilePage = ({ tickets }) => {
    const now = new Date();
    const upcomingTickets = tickets.filter(t => new Date(t.eventDate) >= now);
    const pastTickets = tickets.filter(t => new Date(t.eventDate) < now);

    const TicketCard = ({ ticket, isPast }) => (
        <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg flex ${isPast ? 'filter grayscale' : ''}`}>
            <img src={ticket.eventImage} alt={ticket.eventName} className="w-1/3 object-cover" />
            <div className="p-4 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-lg">{ticket.eventName}</h4>
                    <p className="text-sm text-gray-400">{new Date(ticket.eventDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                    <p className="text-violet-400 font-bold">{ticket.seatId}</p>
                    <a 
                      href="#" 
                      onClick={e => e.preventDefault()}
                      className="text-xs text-blue-400 hover:underline mt-1 block"
                    >
                      Ver no Etherscan
                    </a>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <h2 className="text-4xl font-bold mb-8">Meus Ingressos NFT</h2>

            <div>
                <h3 className="text-2xl font-semibold mb-4 border-b-2 border-violet-500 pb-2">Próximos Eventos</h3>
                {upcomingTickets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingTickets.map(t => <TicketCard key={t.tokenId} ticket={t} isPast={false} />)}
                    </div>
                ) : <p className="text-gray-400">Você não possui ingressos para eventos futuros.</p>}
            </div>

            <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-4 border-b-2 border-violet-500 pb-2">Eventos Passados</h3>
                 {pastTickets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastTickets.map(t => <TicketCard key={t.tokenId} ticket={t} isPast={true} />)}
                    </div>
                ) : <p className="text-gray-400">Você não possui ingressos para eventos passados.</p>}
            </div>
        </div>
    );
};

ProfilePage.propTypes = {
    tickets: PropTypes.array.isRequired,
};

export default ProfilePage;
