import React, { useState, useEffect } from 'react';
import PlayerHand from './PlayerHand';
import { dealCards } from '../services/api';

const GameTable = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const startGame = async () => {
      const playerCount = 4;
      const hands = await dealCards(playerCount);
      setPlayers(hands);
    };

    startGame();
  }, []);

  return (
    <div className="game-table">
      {players.map((hand, index) => (
        <div key={index} className="player-area">
          <h3>玩家 {index + 1}</h3>
          <PlayerHand cards={hand} />
        </div>
      ))}
    </div>
  );
};

export default GameTable;
