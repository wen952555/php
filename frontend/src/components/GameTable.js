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

  // 横幅样式函数
  const bannerStyle = (heightPercent, borderColor = '#0f0') => ({
    height: `${heightPercent}vh`,
    width: '100%',
    border: `3px solid ${borderColor}`,
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    background: 'rgba(0, 20, 0, 0.7)',
    boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
    marginBottom: '5px'
  });

  // 横幅标题样式
  const bannerTitle = {
    position: 'absolute',
    top: '5px',
    left: '10px',
    color: '#0f0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textShadow: '0 0 3px #000'
  };

  return (
    <div className="game-container" style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#001a00',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* 第1道: 玩家状态横幅 (10%) - 亮绿色边框 */}
      <div style={bannerStyle(10, '#0f0')}>
        <div style={bannerTitle}>玩家状态</div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
          paddingTop: '30px'
        }}>
          {players.map((_, index) => (
            <div key={index} style={{ 
              color: currentPlayer === index ? '#ff0' : '#0f0',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              textShadow: '0 0 3px #000',
              border: currentPlayer === index ? '2px solid #ff0' : 'none',
              padding: '5px 15px',
              borderRadius: '5px',
              background: currentPlayer === index ? 'rgba(255, 255, 0, 0.2)' : 'transparent'
            }}>
              玩家 {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 第2道: 头道横幅 (25%) - 青色边框 */}
      <div style={bannerStyle(25, '#0ff')}>
        <div style={bannerTitle}>头道 (3张)</div>
        <PlayerHand cards={arrangedCards.head} />
      </div>

      {/* 第3道: 中道横幅 (25%) - 黄色边框 */}
      <div style={bannerStyle(25, '#ff0')}>
        <div style={bannerTitle}>中道 (5张)</div>
        <PlayerHand cards={arrangedCards.middle} />
      </div>

      {/* 第4道: 尾道横幅 (25%) - 橙色边框 */}
      <div style={bannerStyle(25, '#ff8000')}>
        <div style={bannerTitle}>尾道 (5张)</div>
        <PlayerHand cards={arrangedCards.tail} />
      </div>

      {/* 第5道: 按钮区横幅 (15%) - 红色边框 */}
      <div style={{
        ...bannerStyle(15, '#f00'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={bannerTitle}>操作区</div>
        <button 
          onClick={() => handleAiArrange(players[currentPlayer])}
          style={{ 
            padding: '12px 25px', 
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to bottom, #0a0, #030)',
            color: '#fff',
            border: '2px solid #0f0',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.7)'
          }}>
          AI分牌
        </button>
        <button style={{ 
            padding: '12px 25px', 
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to bottom, #00a, #003)',
            color: '#fff',
            border: '2px solid #00f',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0, 0, 255, 0.7)'
          }}>
          提交牌型
        </button>
        <button style={{ 
            padding: '12px 25px', 
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to bottom, #a00, #300)',
            color: '#fff',
            border: '2px solid #f00',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.7)'
          }}>
          下一局
        </button>
      </div>
    </div>
  );
};

export default GameTable;
