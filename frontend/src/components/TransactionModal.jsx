import React from "react";
import PropTypes from "prop-types";
import { HelpCircle, CheckCircle2 } from "lucide-react";
import { ethers } from "ethers";

const TransactionModal = ({
  modalState,
  setModalState,
  purchaseDetails,
  onConfirm,
}) => {
  if (modalState === "closed") return null;

  const formatPrice = (priceInWeiString) => {
    if (!priceInWeiString || priceInWeiString === "0") return "0.0";
    try {
      return ethers.formatEther(priceInWeiString);
    } catch (e) {
      console.error("Error formatting price:", e);
      return "0.0";
    }
  };

  const getPurchaseDescription = () => {
    if (!purchaseDetails) return "";
    const { seats, event } = purchaseDetails;
    const quantity = seats.length > 0 ? seats.length : 1; // Assuming quantity 1 for standing
    const ticketType = seats.length > 0 ? "Seated Ticket(s)" : "Floor Ticket";
    return `You are about to purchase ${quantity}x ${ticketType} for ${event.name}`;
  };

  const renderContent = () => {
    switch (modalState) {
      case "confirm":
        return (
          <div className="p-10 text-center">
            <div className="flex h-fit w-full gap-2 items-center justify-center mb-6">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
              <h3 className="text-2xl font-bold uppercase text-primary-foreground">
                Confirm Purchase
              </h3>
            </div>

            <p className="mb-6 text-md text-foreground">
              {getPurchaseDescription()} for a total of{" "}
              {formatPrice(purchaseDetails?.totalPrice)} ETH.
            </p>
            <button
              onClick={onConfirm}
              type="button"
              className="y2k-btn text-sm inline-flex items-center px-8 py-3 text-center mr-2"
            >
              Confirm
            </button>
            <button
              onClick={() => setModalState("closed")}
              type="button"
              className="text-muted-foreground bg-transparent hover:bg-white/10 rounded-full border border-border text-sm font-medium px-8 py-3"
            >
              Cancel
            </button>
          </div>
        );
      case "processing":
        return (
          <div className="p-8 text-center">
            <div className="spinner w-16 h-16 border-4 border-t-primary border-border rounded-full mx-auto mb-4 animate-spin"></div>
            <h3 className="mb-5 text-2xl font-bold uppercase">Processing...</h3>
            <p className="mb-6 text-md text-muted-foreground">
              Your transaction is being confirmed on the blockchain. Please
              wait.
            </p>
            <a
              href="#"
              className="text-primary hover:underline text-sm font-medium uppercase tracking-wider"
            >
              View on Block Explorer
            </a>
          </div>
        );
      case "success":
        return (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 p-1 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-14 h-14 text-primary" />
            </div>
            <h3 className="mb-5 text-2xl font-bold uppercase">Success!</h3>
            <p className="mb-6 text-md text-muted-foreground">
              Your tickets have been minted and are now in your wallet.
            </p>
            <button
              onClick={() => setModalState("closed")}
              className="y2k-btn text-sm inline-flex items-center px-8 py-3 text-center"
            >
              View My Tickets
            </button>
          </div>
        );
      // You can add a 'failed' case here as well if needed
      default:
        return null;
    }
  };

  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-black/60">
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative glass-ui modal-content">{renderContent()}</div>
      </div>
    </div>
  );
};

TransactionModal.propTypes = {
  modalState: PropTypes.string.isRequired,
  setModalState: PropTypes.func.isRequired,
  purchaseDetails: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
};

export default TransactionModal;
