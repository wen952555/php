import React from 'react';

const Card = ({ suit, rank }) => {
  const getCardImage = () => {
    // 使用GitHub raw路径访问图片
    return `https://raw.githubusercontent.com/your-username/your-repo/main/images/${rank}_of_${suit}.svg`;
  };

  return (
    <div className="card">
      <img 
        src={getCardImage()} 
        alt={`${rank} of ${suit}`} 
        style={{ width: '80px', height: '120px' }}
      />
    </div>
  );
};

export default Card;
