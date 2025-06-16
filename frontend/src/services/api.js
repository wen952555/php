const API_BASE = 'https://9525.ip-ddns.com/api';

export const dealCards = async (playerCount) => {
  const response = await fetch(`${API_BASE}/deal.php?players=${playerCount}`);
  return response.json();
};

export const evaluateHand = async (hand) => {
  const response = await fetch(`${API_BASE}/evaluate.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards: hand })
  });
  return response.json();
};
