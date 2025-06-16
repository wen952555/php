import React, { useState, useEffect } from 'react';
import PlayerHand from './PlayerHand';
import { dealCards, aiArrangeCards } from '../services/api';

const GameTable = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [arrangedCards, setArrangedCards] = useState({
    head: [],
    middle: [],
    tail: []
  });

  // 初始化游戏
  useEffect(() => {
    const startGame = async () => {
      const playerCount = 4;
      const hands = await dealCards(playerCount);
      setPlayers(hands);
      
      // 自动为当前玩家使用AI分牌
      if (hands.length > 0) {
        handleAiArrange(hands[currentPlayer]);
      }
    };

    startGame();
  }, []);

  // AI分牌处理
  const handleAiArrange = async (cards) => {
    const result = await aiArrangeCards(cards);
    setArrangedCards({
      head: result.head,
      middle: result.middle,
      tail: result.tail
    });
  };

  // 屏幕高度计算
  const getSectionStyle = (heightPercent) => ({
    height: `${heightPercent}vh`,
    width: '100%',
    border: '2px solid #0f0',
    boxSizing: 'border-box',
    overflow: 'hidden'
  });

  return (
    <div className="game-container" style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#003300',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 第1道: 玩家状态 (10%) */}
      <div style={getSectionStyle(10)}>
        <h3 style={{ color: 'white', textAlign: 'center' }}>玩家状态</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {players.map((_, index) => (
            <div key={index} style={{ 
              color: currentPlayer === index ? '#ff0' : 'white',
              fontWeight: currentPlayer === index ? 'bold' : 'normal'
            }}>
              玩家 {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 第2道: 头道 (25%) */}
      <div style={getSectionStyle(25)}>
        <h3 style={{ color: 'white', textAlign: 'center' }}>头道 (3张)</h3>
        <PlayerHand cards={arrangedCards.head} />
      </div>

      {/* 第3道: 中道 (25%) */}
      <div style={getSectionStyle(25)}>
        <h3 style={{ color: 'white', textAlign: 'center' }}>中道 (5张)</h3>
        <PlayerHand cards={arrangedCards.middle} />
      </div>

      {/* 第4道: 尾道 (25%) */}
      <div style={getSectionStyle(25)}>
        <h3 style={{ color: 'white', textAlign: 'center' }}>尾道 (5张)</h3>
        <PlayerHand cards={arrangedCards.tail} />
      </div>

      {/* 第5道: 按钮区 (15%) */}
      <div style={{
        ...getSectionStyle(15),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button onClick={() => handleAiArrange(players[currentPlayer])}
          style={{ padding: '10px 20px', fontSize: '16px' }}>
          AI分牌
        </button>
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>
          提交牌型
        </button>
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>
          下一局
        </button>
      </div>
    </div>
  );
};

export default GameTable;
