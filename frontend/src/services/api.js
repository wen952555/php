const API_BASE = 'https://9525.ip-ddns.com/api';

// 原有API保持不变...

// 新增AI分牌API
export const aiArrangeCards = async (cards) => {
  const response = await fetch(`${API_BASE}/ai_arrange.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards })
  });
  return response.json();
};
