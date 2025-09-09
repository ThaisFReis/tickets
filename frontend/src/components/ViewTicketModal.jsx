import React from 'react';
import PropTypes from 'prop-types';
import { X, ArrowUpRight } from 'lucide-react';
import QrCode from 'qrcode.react';

const ViewTicketModal = ({ ticket, onClose }) => {
    if (!ticket) return null;

    const eventDate = new Date(ticket.eventDate).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/60 p-4">
            <div className="relative glass-ui w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
                    <h3 className="text-xl font-bold uppercase tracking-wider">{ticket.eventName} - {ticket.seatId || 'Floor Ticket'}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center bg-white/90 p-6 rounded-xl">
                        <QrCode 
                            value={`TicketChain-NFT-${ticket.tokenId}`}
                            size={250}
                            bgColor={"#FFFFFF"}
                            fgColor={"#000000"}
                            level={"L"}
                            includeMargin={false}
                            renderAs={"svg"}
                            className="w-full max-w-[250px] rounded-lg aspect-square"
                        />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold uppercase text-glow">{ticket.eventName}</h2>
                            <p className="text-lg text-secondary font-semibold mt-1">{eventDate}</p>
                            <p className="text-md text-muted-foreground mt-1">{ticket.venue || 'Decentralized Arena'}</p>
                        </div>
                        
                        <div className="border-t border-border/50"></div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Ticket Info</h3>
                            <p><span className="font-bold">Type:</span> {ticket.seatId ? 'Seated' : 'Floor'}</p>
                            <p><span className="font-bold">Seat:</span> {ticket.seatId || 'N/A'}</p>
                        </div>

                        <div className="border-t border-border/50"></div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">On-Chain Data</h3>
                            <p className="font-mono text-xs break-all"><span className="font-sans font-bold">Contract:</span> {ticket.contractAddress || '0x1A2b...s0T'}</p>
                            <p className="font-mono text-xs"><span className="font-sans font-bold">Token ID:</span> #{ticket.tokenId}</p>
                            <a href="#" className="inline-flex items-center gap-2 text-secondary hover:text-primary mt-2 text-sm font-semibold uppercase tracking-wider">
                                <span>View on Explorer</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ViewTicketModal.propTypes = {
    ticket: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default ViewTicketModal;
