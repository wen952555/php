import React from 'react';
import Card from './Card';

const PlayerHand = ({ cards }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '5px',
      height: 'calc(100% - 40px)',
      overflow: 'auto',
      padding: '10px'
    }}>
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
