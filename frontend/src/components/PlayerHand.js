import React from 'react';
import Card from './Card';

const PlayerHand = ({ cards }) => {
  return (
    <div className="player-hand">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          suit={card.suit} 
          rank={card.rank} 
        />
      ))}
    </div>
  );
};

export default PlayerHand;
