import ethereumLogo from "/assets/images/eth-logo.svg";

function Card({ card, onClick }) {
  return (
    <div
      className={`memory-card${card.isFlipped ? " flip" : ""}`}
      onClick={onClick}
      style={{ order: card.order }}
      data-testid={card.id}
    >
      <img className="front-face" src={card.image} alt="Card" />
      <img className="back-face" src={ethereumLogo} alt="Ethereum Logo" />
    </div>
  );
}

export default Card;
