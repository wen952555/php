document.addEventListener('DOMContentLoaded', () => {
    const player1HandEl = document.getElementById('player1-hand');
    const player2HandEl = document.getElementById('player2-hand');
    const player3HandEl = document.getElementById('player3-hand');
    const landlordCardsAreaEl = document.getElementById('landlord-cards-area');

    const player1CardCountEl = document.querySelector('#player1-area .card-count');
    const player2CardCountEl = document.querySelector('#player2-area .card-count');
    const player3CardCountEl = document.querySelector('#player3-area .card-count');

    // Backend URL - confirmed by user
    const backendBaseUrl = 'https://9525.ip-ddns.com'; 
    // Assuming the PHP files are directly in doudizhu_backend, and doudizhu_backend is served at the root of backendBaseUrl
    // If doudizhu_backend is a subdirectory visible under backendBaseUrl, then it would be:
    // const apiUrl = `${backendBaseUrl}/doudizhu_backend/api_deal.php`;
    // Let's assume for now the user will place api_deal.php at a path that resolves correctly with this:
    const apiUrl = `${backendBaseUrl}/doudizhu_backend/api_deal.php`;


    function createCardElement(card) {
        const cardImg = document.createElement('img');
        cardImg.classList.add('card-image'); // New class for styling images
        cardImg.src = `images/${card.imageFilename}`; // Assuming images are in doudizhu/images/
        cardImg.alt = card.displayName;
        cardImg.title = card.displayName; // Tooltip for hover
        
        // You might want to store card data directly on the element for later use
        // e.g., cardImg.dataset.suit = card.suit;
        //       cardImg.dataset.rank = card.rank;
        //       cardImg.dataset.value = card.value;
        // For now, keeping it simple. The `card` object itself is available when adding listeners.
        return cardImg;
    }

    function updatePlayerHand(handElement, cardCountElement, cards) {
        if (!handElement || !cardCountElement) return;

        // Clear previous cards/placeholders
        handElement.innerHTML = ''; 
        
        if (Array.isArray(cards)) {
            cards.forEach(cardData => { // Renamed 'card' to 'cardData' for clarity
                const cardElement = createCardElement(cardData);
                
                // Store card data on the element for easy access
                cardElement.dataset.suit = cardData.suit;
                cardElement.dataset.rank = cardData.rank;
                cardElement.dataset.value = cardData.value;
                cardElement.dataset.displayName = cardData.displayName;
                cardElement.dataset.imageFilename = cardData.imageFilename;

                // Add click listener for selection
                // Only allow selection for cards in actual hand areas, not landlord area etc.
                if (handElement.classList.contains('hand-area')) { // Check if it's a player's hand
                    cardElement.addEventListener('click', () => {
                        cardElement.classList.toggle('selected');
                        console.log(`牌 ${cardData.displayName} 选择状态切换. 选中: ${cardElement.classList.contains('selected')}`);
                    });
                }
                handElement.appendChild(cardElement);
            });
            cardCountElement.textContent = `${cards.length} 张`; // "X cards"
        } else {
            cardCountElement.textContent = '0 张';
        }
    }
    
    function updateLandlordCards(landlordAreaElement, cards) {
        if (!landlordAreaElement) return;
        // Clear previous cards/placeholders (remove the "底牌 (Landlord's Cards):" label first if it's inside)
        const label = landlordAreaElement.querySelector('.area-label');
        landlordAreaElement.innerHTML = ''; // Clear all
        if (label) landlordAreaElement.appendChild(label); // Add label back

        if (Array.isArray(cards)) {
            cards.forEach(card => {
                landlordAreaElement.appendChild(createCardElement(card));
            });
        }
    }

    async function fetchAndDisplayInitialDeal() {
        console.log(`从后端获取初始发牌: ${apiUrl}`);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Details: ${errorText}`);
            }
            const result = await response.json();

            if (result.success && result.data) {
                console.log('收到发牌数据:', result.data);
                updatePlayerHand(player1HandEl, player1CardCountEl, result.data.player1Hand);
                updatePlayerHand(player2HandEl, player2CardCountEl, result.data.player2Hand);
                updatePlayerHand(player3HandEl, player3CardCountEl, result.data.player3Hand);
                updateLandlordCards(landlordCardsAreaEl, result.data.landlordCards);
                console.log('前端已更新所发牌数据。');
            } else {
                throw new Error(result.message || '从后端获取有效发牌数据失败。');
            }
        } catch (error) {
            console.error('获取或显示初始发牌时出错:', error);
            // Display error to user?
            if (player1HandEl) player1HandEl.textContent = `加载牌时出错: ${error.message}`;
            if (player1CardCountEl) player1CardCountEl.textContent = 'Error';
            if (player2CardCountEl) player2CardCountEl.textContent = 'Error';
            if (player3CardCountEl) player3CardCountEl.textContent = 'Error';
        }
    }

    // Initial setup
    console.log('斗地主前端脚本已加载。');
    fetchAndDisplayInitialDeal();

    // --- Player Action Button Listeners ---
    const playButton = document.getElementById('btn-play');
    const passButton = document.getElementById('btn-pass');
    const bidButton = document.getElementById('btn-bid'); // Assuming #btn-bid exists
    const hintButton = document.getElementById('btn-hint'); // Assuming #btn-hint exists

    if (playButton) {
        playButton.addEventListener('click', () => {
            console.log('出牌按钮点击');
            
            // For now, assume Player 1 is the active player
            // Later, this needs to be dynamic based on actual game turn
            const activePlayerHandEl = player1HandEl; 
            const activePlayerCardCountEl = player1CardCountEl;
            
            if (!activePlayerHandEl) {
                console.error('Active player hand element not found.');
                return;
            }

            const selectedCardsElements = activePlayerHandEl.querySelectorAll('.card-image.selected');
            
            if (selectedCardsElements.length === 0) {
                console.log('没有选中的牌可以出。');
                // Optionally, provide user feedback (e.g., alert or message on UI)
                // alert('请先选择要出的牌！(Please select cards to play!)');
                return;
            }

            const playedCardsData = [];
            selectedCardsElements.forEach(cardEl => {
                playedCardsData.push({
                    displayName: cardEl.dataset.displayName,
                    suit: cardEl.dataset.suit,
                    rank: cardEl.dataset.rank,
                    value: cardEl.dataset.value,
                    imageFilename: cardEl.dataset.imageFilename
                });
            });

            console.log('选中的牌:', playedCardsData);

            // Move cards to common played area
            const commonPlayedAreaEl = document.getElementById('common-played-area');
            if (commonPlayedAreaEl) {
                // Clear previous cards in played area (or decide on accumulation later)
                // For now, let's clear it to show only the latest play
                const playedAreaLabel = commonPlayedAreaEl.querySelector('.area-label');
                commonPlayedAreaEl.innerHTML = ''; // Clear previous
                if (playedAreaLabel) commonPlayedAreaEl.appendChild(playedAreaLabel); // Add label back


                selectedCardsElements.forEach(cardEl => {
                    cardEl.classList.remove('selected'); // Unselect before moving
                    commonPlayedAreaEl.appendChild(cardEl); // Move the element
                });
            }

            // Update card count for the player
            if (activePlayerCardCountEl && activePlayerHandEl) {
                const remainingCards = activePlayerHandEl.querySelectorAll('.card-image').length;
                activePlayerCardCountEl.textContent = `${remainingCards} 张`;
            }
            
            console.log('出牌成功 (仅前端操作)。');
        });
    }

    if (passButton) {
        passButton.addEventListener('click', () => {
            console.log('不要按钮点击。功能待实现。');
            // alert('Pass! (功能待实现 - Functionality to be implemented)');
        });
    }

    if (bidButton) {
        bidButton.addEventListener('click', () => {
            console.log('叫地主按钮点击。功能待实现。');
            // alert('Bid! (功能待实现 - Functionality to be implemented)');
        });
    }
    
    if (hintButton) {
        hintButton.addEventListener('click', () => {
            console.log('提示按钮点击。功能待实现。');
            // alert('Hint! (功能待实现 - Functionality to be implemented)');
        });
    }
});
