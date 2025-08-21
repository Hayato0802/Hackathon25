// アプリケーションの状態管理
const appState = {
    inventory: JSON.parse(localStorage.getItem('foodInventory')) || [],
    userPoints: JSON.parse(localStorage.getItem('userPoints')) || { give: 150, take: 30 },
    transactions: JSON.parse(localStorage.getItem('transactions')) || transactionHistory
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkExpiringItems();
    updateUI();
    
    // GeoJSONデータを初期化
    initializeGeoJSONData();
});

function initializeApp() {
    // 初回アクセス時のダミーデータ設定
    if (appState.inventory.length === 0) {
        const dummyInventory = [
            { id: Date.now(), name: 'トマト', quantity: '5個', expiryDate: addDays(new Date(), 2), icon: '🍅' },
            { id: Date.now() + 1, name: '卵', quantity: '10個', expiryDate: addDays(new Date(), 7), icon: '🥚' },
            { id: Date.now() + 2, name: '牛乳', quantity: '1本', expiryDate: addDays(new Date(), 3), icon: '🥛' }
        ];
        appState.inventory = dummyInventory;
        saveToLocalStorage();
    }
}

function setupEventListeners() {
    // タブ切り替え
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // 食品登録
    document.getElementById('register-btn').addEventListener('click', registerFood);
    document.getElementById('food-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            registerFood();
        }
    });

    // 音声入力（デモ用）
    document.getElementById('voice-input-btn').addEventListener('click', () => {
        showNotification('音声入力機能は開発中です', 'info');
        // デモ用にサンプルテキストを入力
        document.getElementById('food-input').value = 'りんご2個、バナナ3本 明日まで';
    });

    // フィルター
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            displayInventory(e.target.dataset.filter);
        });
    });

    // モーダル
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });

    // デモボタン
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', showDemoFeature);
    });
}

function switchTab(tabName) {
    // タブボタンの更新
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // タブコンテンツの更新
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    // タブごとの初期化処理
    switch(tabName) {
        case 'inventory':
            displayInventory('all');
            break;
        case 'share':
            displayShareableItems();
            displayMatchingUsers();
            displayTransactionHistory();
            break;
        case 'recipe':
            displayRecipeSuggestions();
            break;
        case 'stats':
            updateStatistics();
            break;
    }
}

// 食品登録機能
function registerFood() {
    const input = document.getElementById('food-input').value.trim();
    if (!input) {
        showNotification('食品情報を入力してください', 'warning');
        return;
    }

    const parsedItems = parseFoodInput(input);
    displayParsedItems(parsedItems);
    
    // 在庫に追加
    parsedItems.forEach(item => {
        appState.inventory.push({
            id: Date.now() + Math.random(),
            ...item,
            registeredDate: new Date()
        });
    });

    saveToLocalStorage();
    showNotification('食品を登録しました！', 'success');
    document.getElementById('food-input').value = '';
    
    // 期限チェック
    setTimeout(() => checkExpiringItems(), 1000);
}

// 食品入力の解析（簡易版AI解析のシミュレーション）
function parseFoodInput(input) {
    const items = [];
    const patterns = [
        /(\S+?)\s*(\d+)\s*個/g,
        /(\S+?)\s*(\d+)\s*本/g,
        /(\S+?)\s*(\d+)\s*パック/g,
        /(\S+?)\s*(\d+)\s*枚/g
    ];

    // 期限の解析
    let expiryDate = null;
    if (input.includes('明日')) {
        expiryDate = addDays(new Date(), 1);
    } else if (input.includes('今日')) {
        expiryDate = new Date();
    } else if (input.includes('明後日')) {
        expiryDate = addDays(new Date(), 2);
    } else if (match = input.match(/(\d+)日/)) {
        expiryDate = addDays(new Date(), parseInt(match[1]));
    }

    // 食品の解析
    patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern);
        while ((match = regex.exec(input)) !== null) {
            const foodName = match[1];
            const quantity = match[2] + match[0].match(/個|本|パック|枚/)[0];
            
            // 食品マスタから情報取得
            const masterData = foodMaster[foodName] || { category: 'その他', defaultDays: 7, icon: '🍽️' };
            
            items.push({
                name: foodName,
                quantity: quantity,
                expiryDate: expiryDate || addDays(new Date(), masterData.defaultDays),
                icon: masterData.icon,
                category: masterData.category
            });
        }
    });

    // パターンにマッチしない場合のフォールバック
    if (items.length === 0) {
        const words = input.split(/\s+/);
        const foodName = words[0];
        const masterData = foodMaster[foodName] || { category: 'その他', defaultDays: 7, icon: '🍽️' };
        
        items.push({
            name: foodName,
            quantity: '1個',
            expiryDate: expiryDate || addDays(new Date(), masterData.defaultDays),
            icon: masterData.icon,
            category: masterData.category
        });
    }

    return items;
}

// 解析結果の表示
function displayParsedItems(items) {
    const resultDiv = document.getElementById('parse-result');
    resultDiv.innerHTML = '<h3>登録内容の確認</h3>';
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'parsed-item';
        itemDiv.innerHTML = `
            <div>
                <span>${item.icon}</span>
                <strong>${item.name}</strong>
                <span>${item.quantity}</span>
            </div>
            <div>
                <span class="item-meta">期限: ${formatDate(item.expiryDate)}</span>
            </div>
        `;
        resultDiv.appendChild(itemDiv);
    });
}

// 在庫表示
function displayInventory(filter = 'all') {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';

    let filteredItems = [...appState.inventory];
    const today = new Date();

    switch(filter) {
        case 'expiring':
            filteredItems = filteredItems.filter(item => {
                const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
            });
            break;
        case 'expired':
            filteredItems = filteredItems.filter(item => {
                return getDaysUntilExpiry(item.expiryDate) < 0;
            });
            break;
    }

    filteredItems.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    filteredItems.forEach(item => {
        const itemDiv = createInventoryItemElement(item);
        inventoryList.appendChild(itemDiv);
    });

    if (filteredItems.length === 0) {
        inventoryList.innerHTML = '<p style="text-align: center; color: #6c757d;">該当する食品がありません</p>';
    }
}

// 在庫アイテムの要素作成
function createInventoryItemElement(item) {
    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
    const urgencyClass = daysUntilExpiry < 0 ? 'urgent' : daysUntilExpiry <= 3 ? 'warning' : 'safe';
    const urgencyText = daysUntilExpiry < 0 ? '期限切れ' : `あと${daysUntilExpiry}日`;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'inventory-item';
    itemDiv.innerHTML = `
        <div class="item-info">
            <h3>${item.icon} ${item.name}</h3>
            <div class="item-meta">
                <span>数量: ${item.quantity}</span>
                <span>期限: ${formatDate(item.expiryDate)}</span>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <span class="expiry-badge ${urgencyClass}">${urgencyText}</span>
            <button class="action-btn" onclick="shareItem('${item.id}')">おすそ分け</button>
            <button class="action-btn" onclick="useItem('${item.id}')">使用</button>
        </div>
    `;
    return itemDiv;
}

// おすそ分け可能なアイテム表示
function displayShareableItems() {
    const shareableDiv = document.getElementById('shareable-items');
    shareableDiv.innerHTML = '';

    const shareableItems = appState.inventory.filter(item => {
        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
        return daysUntilExpiry >= 0;
    });

    shareableItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h3>${item.icon} ${item.name}</h3>
                <div class="item-meta">
                    <span>数量: ${item.quantity}</span>
                    <span>期限: ${formatDate(item.expiryDate)}</span>
                </div>
            </div>
            <button class="primary-btn" onclick="startMatching('${item.id}')">マッチング開始</button>
        `;
        shareableDiv.appendChild(itemDiv);
    });
}

// マッチングユーザー表示
function displayMatchingUsers() {
    const matchingDiv = document.getElementById('matching-list');
    matchingDiv.innerHTML = '';

    // 自分の在庫を取得
    const myInventory = appState.inventory.map(item => item.name);

    // マッチ度を計算してユーザーをソート
    const usersWithMatch = dummyUsers.map(user => {
        // マッチ度計算
        const matchingNeeds = user.needs.filter(need => myInventory.includes(need));
        const matchingOffers = user.offers.filter(offer => {
            // 自分が欲しそうな食材（仮定）
            return true; // 実際は自分のニーズリストと照合
        });
        
        const needsMatchScore = (matchingNeeds.length / user.needs.length) * 100;
        const giveBalance = user.givePoints - user.takePoints;
        const distanceScore = user.distance.includes('km') ? 
            50 - (parseFloat(user.distance) * 10) : 
            100 - (parseInt(user.distance) / 100);
        
        const totalMatchScore = Math.round(
            (needsMatchScore * 0.5) + 
            (Math.min(giveBalance / 10, 50) * 0.3) + 
            (distanceScore * 0.2)
        );

        return {
            ...user,
            matchingNeeds,
            matchingOffers,
            matchScore: totalMatchScore
        };
    });

    // マッチ度でソート
    usersWithMatch.sort((a, b) => b.matchScore - a.matchScore);

    usersWithMatch.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'matching-item enhanced';
        
        // マッチ度に応じた推薦理由を生成
        let recommendReason = '';
        if (user.matchingNeeds.length > 0) {
            recommendReason = `あなたの「${user.matchingNeeds.join('、')}」を探しています！`;
        }
        
        // マッチ度によるハイライト
        const matchHighlight = user.matchScore >= 80 ? 'high-match' : 
                              user.matchScore >= 60 ? 'medium-match' : 'low-match';
        
        userDiv.innerHTML = `
            <div class="match-header ${matchHighlight}">
                <div class="match-score-badge">
                    <span class="score">${user.matchScore}%</span>
                    <span class="label">マッチ</span>
                </div>
                <div class="user-profile">
                    <span class="avatar">${user.avatar}</span>
                    <div class="user-info">
                        <div class="user-name">${user.name} ${user.rank}</div>
                        <div class="user-meta">
                            <span class="distance">📍 ${user.distance}</span>
                            <span class="rating">⭐ ${user.rating} (${user.reviews}件)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${recommendReason ? `<div class="recommend-reason">💡 ${recommendReason}</div>` : ''}
            
            <div class="match-details-enhanced">
                <div class="needs-offers-grid">
                    <div class="needs-section">
                        <h4>欲しい食材</h4>
                        <div class="food-tags">
                            ${user.needs.map(need => 
                                `<span class="food-tag ${myInventory.includes(need) ? 'available' : ''}">
                                    ${foodMaster[need]?.icon || '🍽️'} ${need}
                                </span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="offers-section">
                        <h4>提供できる食材</h4>
                        <div class="food-tags">
                            ${user.offers.map(offer => 
                                `<span class="food-tag offer">
                                    ${foodMaster[offer]?.icon || '🍽️'} ${offer}
                                </span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="user-badges">
                    ${user.badges.map(badge => `<span class="badge">🏅 ${badge}</span>`).join('')}
                </div>
                
                <div class="user-message">
                    <p>💬 ${user.message}</p>
                    <div class="user-preferences">
                        <span>⏰ ${user.responseTime}</span>
                        <span>📅 ${user.preferredTime}</span>
                    </div>
                </div>
                
                <div class="points-display">
                    <span class="give-points">Give: ${user.givePoints}pt</span>
                    <span class="take-points">Take: ${user.takePoints}pt</span>
                </div>
            </div>
            
            <div class="match-actions-enhanced">
                <button class="action-btn map-btn" onclick="showMap(${user.id})">
                    📍 地図
                </button>
                <button class="action-btn chat-btn" onclick="openChat(${user.id})">
                    🤝 調整
                </button>
                <button class="action-btn accept-btn" onclick="acceptMatch(${user.id})">
                    ✅ マッチング
                </button>
                <button class="action-btn decline-btn" onclick="declineMatch(${user.id})">
                    ❌ 見送る
                </button>
            </div>
        `;
        matchingDiv.appendChild(userDiv);
    });

    // マッチング候補が見つかったことを通知
    setTimeout(() => {
        if (usersWithMatch.length > 0 && usersWithMatch[0].matchScore >= 80) {
            showNotification('🎉 最適なマッチング候補が見つかりました！', 'success');
        }
    }, 500);
}

// 取引履歴表示
function displayTransactionHistory() {
    const historyDiv = document.getElementById('transaction-history');
    historyDiv.innerHTML = '';

    appState.transactions.forEach(transaction => {
        const transDiv = document.createElement('div');
        transDiv.className = 'matching-item';
        transDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div class="match-user">${transaction.type === 'give' ? '提供' : '受取'}: ${transaction.item}</div>
                    <div class="match-details">
                        相手: ${transaction.partner} | ${transaction.date}
                    </div>
                </div>
                <span style="color: ${transaction.type === 'give' ? '#28a745' : '#dc3545'}; font-weight: bold;">
                    ${transaction.points > 0 ? '+' : ''}${transaction.points}pt
                </span>
            </div>
        `;
        historyDiv.appendChild(transDiv);
    });
}

// レシピ提案表示
function displayRecipeSuggestions() {
    const ingredientsDiv = document.querySelector('.ingredient-tags');
    const recipesDiv = document.getElementById('recipe-suggestions');
    
    // 利用可能な食材表示
    ingredientsDiv.innerHTML = '';
    const availableIngredients = new Set();
    appState.inventory.forEach(item => {
        if (getDaysUntilExpiry(item.expiryDate) >= 0) {
            availableIngredients.add(item.name);
            const tag = document.createElement('span');
            tag.className = 'ingredient-tag';
            tag.textContent = `${item.icon} ${item.name}`;
            ingredientsDiv.appendChild(tag);
        }
    });

    // マッチするレシピ表示
    recipesDiv.innerHTML = '';
    const matchingRecipes = recipes.filter(recipe => {
        return recipe.ingredients.some(ing => availableIngredients.has(ing));
    });

    matchingRecipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe-card';
        const availableCount = recipe.ingredients.filter(ing => availableIngredients.has(ing)).length;
        
        recipeDiv.innerHTML = `
            <div class="recipe-header">
                <h3 class="recipe-name">${recipe.name}</h3>
                <span class="recipe-time">⏱️ ${recipe.time}</span>
            </div>
            <div class="recipe-ingredients">
                必要な材料: ${recipe.ingredients.join(', ')}
                <span style="color: #28a745;"> (${availableCount}/${recipe.ingredients.length}個保有)</span>
            </div>
            <p>${recipe.description}</p>
            <span class="recipe-difficulty difficulty-${recipe.difficulty}">
                ${recipe.difficulty === 'easy' ? '簡単' : '普通'}
            </span>
        `;
        recipesDiv.appendChild(recipeDiv);
    });
}

// 統計更新
function updateStatistics() {
    // ダミーデータの更新（実際はサーバーから取得）
    const stats = {
        co2Reduction: (appState.transactions.filter(t => t.type === 'give').length * 0.5).toFixed(1),
        savedItems: appState.transactions.filter(t => t.type === 'give').length,
        savedMoney: appState.transactions.filter(t => t.type === 'take').length * 150
    };

    document.querySelector('.stat-value').textContent = `${stats.co2Reduction} kg`;
    document.querySelectorAll('.stat-value')[1].textContent = `${stats.savedItems} 個`;
    document.querySelectorAll('.stat-value')[2].textContent = `¥${stats.savedMoney.toLocaleString()}`;
}

// 期限チェックと通知
function checkExpiringItems() {
    const expiringItems = appState.inventory.filter(item => {
        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
        return daysUntilExpiry >= 0 && daysUntilExpiry <= 2;
    });

    expiringItems.forEach(item => {
        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
        showNotification(
            `${item.name}があと${daysUntilExpiry}日で期限切れです。レシピを見るか、おすそ分けしませんか？`,
            'warning'
        );
    });
}

// アイテムアクション
function shareItem(itemId) {
    switchTab('share');
    showNotification('おすそ分けタブに移動しました', 'info');
}

function useItem(itemId) {
    const itemIndex = appState.inventory.findIndex(item => item.id == itemId);
    if (itemIndex !== -1) {
        const item = appState.inventory[itemIndex];
        appState.inventory.splice(itemIndex, 1);
        saveToLocalStorage();
        showNotification(`${item.name}を使用しました`, 'success');
        displayInventory(document.querySelector('.filter-btn.active').dataset.filter);
    }
}

function startMatching(itemId) {
    const item = appState.inventory.find(i => i.id == itemId);
    if (item) {
        showNotification(`${item.name}のマッチングを開始しました！`, 'success');
        // 実際はここでサーバーにリクエストを送信
    }
}

function acceptMatch(userId) {
    const user = dummyUsers.find(u => u.id === userId);
    if (user) {
        // マッチング成立アニメーション
        showMatchSuccessAnimation();
        
        // ポイント更新
        appState.userPoints.give += 10;
        updateUserPoints();
        
        // 取引履歴追加
        appState.transactions.unshift({
            id: Date.now(),
            type: 'give',
            item: 'トマト 2個',
            partner: user.name,
            date: formatDate(new Date()),
            points: 10,
            status: '調整中',
            rating: null
        });
        saveToLocalStorage();
        
        setTimeout(() => {
            showNotification(`${user.name}とのマッチングが成立しました！受け渡しの調整をしましょう`, 'success');
            displayTransactionHistory();
            
            // 自動で調整画面を開く
            setTimeout(() => {
                openChat(userId);
                // 調整完了後に評価を促す
                currentTransactionId = Date.now();
            }, 1000);
        }, 2500);
    }
}

function declineMatch(userId) {
    showNotification('マッチングを辞退しました', 'info');
}

// デモ機能表示
function showDemoFeature(e) {
    const featureName = e.target.parentElement.querySelector('h4').textContent;
    openModal(`
        <h2>${featureName} - デモ画面</h2>
        <div style="text-align: center; padding: 40px;">
            <p style="font-size: 48px; margin-bottom: 20px;">📱</p>
            <p>この機能は将来実装予定です</p>
            <p style="color: #6c757d; margin-top: 20px;">
                ServiceNowのAI機能と連携して<br>
                より高度な食品管理を実現します
            </p>
        </div>
    `);
}

// ユーティリティ関数
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    const notificationArea = document.getElementById('notification-area');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function openModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function updateUserPoints() {
    document.querySelector('.user-points').textContent = 
        `Give: ${appState.userPoints.give}pt / Take: ${appState.userPoints.take}pt`;
    
    // ランク更新
    const balance = appState.userPoints.give - appState.userPoints.take;
    let rank = '🥉 ブロンズGiver';
    if (balance >= 300) rank = '💎 プラチナGiver';
    else if (balance >= 150) rank = '🥇 ゴールドGiver';
    else if (balance >= 50) rank = '🥈 シルバーGiver';
    
    document.querySelector('.user-rank').textContent = rank;
}

function saveToLocalStorage() {
    localStorage.setItem('foodInventory', JSON.stringify(appState.inventory));
    localStorage.setItem('userPoints', JSON.stringify(appState.userPoints));
    localStorage.setItem('transactions', JSON.stringify(appState.transactions));
}

function updateUI() {
    updateUserPoints();
    displayInventory('all');
}

// 調整機能
let currentChatUser = null;
let selectedLocation = null;
let selectedTime = null;
let adjustmentMessages = [];
let currentTransactionId = null;

function openChat(userId) {
    const user = dummyUsers.find(u => u.id === userId);
    if (!user) return;
    
    currentChatUser = user;
    document.getElementById('chat-user-name').textContent = user.name;
    document.getElementById('chat-modal').style.display = 'block';
    
    // 初期化
    selectedLocation = null;
    selectedTime = null;
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    
    // AIアシスタントのメッセージ
    updateSystemMessage(`${user.name}との受け渡し調整を始めます。ご希望の場所と時間を選択してください。`);
}

function closeChat() {
    document.getElementById('chat-modal').style.display = 'none';
}

function selectLocation(location) {
    selectedLocation = location;
    document.querySelectorAll('.location-options .option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    const locationNames = {
        'station': '駅前',
        'supermarket': 'スーパー入口',
        'park': '公園',
        'box': '受け渡しボックス'
    };
    
    updateSystemMessage(`${locationNames[location]}を選択しました。次は時間を選んでください。`);
    
    // 受け渡しボックスを選んだ場合の特別メッセージ
    if (location === 'box') {
        setTimeout(() => {
            updateSystemMessage('受け渡しボックスなら24時間いつでも受け取り可能です！QRコードで簡単に開錠できます。');
        }, 1000);
    }
}

function selectTime(time) {
    selectedTime = time;
    document.querySelectorAll('.time-options .option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    const timeNames = {
        'morning': '午前（9-12時）',
        'afternoon': '午後（12-17時）',
        'evening': '夕方（17-20時）'
    };
    
    updateSystemMessage(`${timeNames[time]}を選択しました。「調整内容を確定」ボタンを押してください。`);
}

function sendTemplate(templateType) {
    const templates = {
        'thanks': 'ありがとうございます',
        'please': 'よろしくお願いします',
        'looking': '楽しみにしています',
        'confirm': '確認しました'
    };
    
    const message = templates[templateType];
    adjustmentMessages.push({
        type: 'user',
        text: message,
        time: new Date()
    });
    
    // システムからの返信
    setTimeout(() => {
        const responses = {
            'thanks': 'こちらこそ、ありがとうございます！',
            'please': 'はい、こちらこそよろしくお願いします。',
            'looking': '私も楽しみにしています！',
            'confirm': '承知いたしました。'
        };
        
        updateSystemMessage(`${currentChatUser.name}さんから: 「${responses[templateType]}」`);
    }, 800);
}

function updateSystemMessage(message) {
    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML = `
        <div class="system-message">
            <div class="ai-avatar">🤖</div>
            <div class="message-content">${message}</div>
        </div>
    `;
    
    // 過去のメッセージも表示
    adjustmentMessages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'system-message';
        msgDiv.innerHTML = `
            <div class="ai-avatar">${msg.type === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">${msg.text}</div>
        `;
        messagesDiv.appendChild(msgDiv);
    });
}

function confirmAdjustment() {
    if (!selectedLocation || !selectedTime) {
        updateSystemMessage('場所と時間を両方選択してください。');
        return;
    }
    
    const locationNames = {
        'station': '駅前',
        'supermarket': 'スーパー入口',
        'park': '公園',
        'box': '受け渡しボックス'
    };
    
    const timeNames = {
        'morning': '午前（9-12時）',
        'afternoon': '午後（12-17時）',
        'evening': '夕方（17-20時）'
    };
    
    // 確定メッセージ
    updateSystemMessage(`✅ 調整が完了しました！\n\n📍 場所: ${locationNames[selectedLocation]}\n⏰ 時間: ${timeNames[selectedTime]}\n\n${currentChatUser.name}さんに通知しました。`);
    
    // QRコード表示（ボックスの場合）
    if (selectedLocation === 'box') {
        setTimeout(() => {
            showBoxQRCode();
        }, 1500);
    }
    
    // 2秒後に閉じる
    setTimeout(() => {
        closeChat();
        showNotification('受け渡しの調整が完了しました！', 'success');
        
        // 評価画面を表示
        setTimeout(() => {
            showRatingModal(currentChatUser.id);
        }, 1000);
    }, 3000);
}

// リアルタイム通知シミュレーション
function simulateNewMatch() {
    // ランダムなタイミングで新規マッチング通知
    setTimeout(() => {
        const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        showMatchNotification(randomUser);
    }, 10000 + Math.random() * 20000);
}

function showMatchNotification(user) {
    const notification = document.getElementById('new-match-notification');
    const content = document.getElementById('notification-content');
    
    content.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px; margin: 15px 0;">
            <span style="font-size: 36px;">${user.avatar}</span>
            <div>
                <strong>${user.name}</strong>があなたの食材を探しています！<br>
                <span style="color: #6c757d;">距離: ${user.distance}</span>
            </div>
        </div>
        <p style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
            "${user.message}"
        </p>
    `;
    
    notification.style.display = 'block';
    
    // 音を鳴らす（実際はオーディオファイル）
    console.log('♪ 通知音');
    
    // 5秒後に自動で消える
    setTimeout(() => {
        if (notification.style.display !== 'none') {
            dismissNotification();
        }
    }, 8000);
}

function viewMatch() {
    dismissNotification();
    switchTab('share');
}

function dismissNotification() {
    const notification = document.getElementById('new-match-notification');
    notification.style.display = 'none';
}

// 初期化処理の更新
document.addEventListener('DOMContentLoaded', () => {
    // 通知シミュレーション開始
    simulateNewMatch();
});

// 地図表示機能（モック）
function showMap(userId) {
    const user = dummyUsers.find(u => u.id === userId);
    if (!user) return;
    
    openModal(`
        <h2>📍 ${user.name}の位置</h2>
        <div class="map-mock"></div>
        <div style="margin-top: 15px;">
            <p><strong>推奨受け渡し場所:</strong></p>
            <ul>
                <li>○○駅 北口（徒歩5分）</li>
                <li>△△スーパー 駐車場（徒歩8分）</li>
                <li>□□公園 入口（徒歩10分）</li>
            </ul>
        </div>
        <button class="primary-btn" style="margin-top: 20px;" onclick="closeModal()">閉じる</button>
    `);
}

// マッチング成立時のアニメーション
function showMatchSuccessAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 80px; animation: pulse 1s ease-in-out;">🎉</div>
            <h1 style="font-size: 48px; margin: 20px 0;">マッチング成立！</h1>
            <p style="font-size: 24px; opacity: 0.9;">+10 ポイント獲得</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 500);
    }, 2000);
}

// 受け渡しボックスのQRコード表示
function showBoxQRCode() {
    openModal(`
        <h2>📦 受け渡しボックス利用方法</h2>
        <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                <div style="width: 200px; height: 200px; background: #333; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                    QRコード<br>（デモ画面）
                </div>
                <p style="margin-top: 15px; font-weight: 600;">ボックス番号: A-123</p>
            </div>
        </div>
        <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4>🔐 利用手順</h4>
            <ol style="text-align: left; margin: 10px 0;">
                <li>最寄りの受け渡しボックスへ移動</li>
                <li>QRコードをスキャン</li>
                <li>ボックスが自動で開錠</li>
                <li>食品を入れて/受け取って完了</li>
            </ol>
        </div>
        <div style="background: #d4edda; padding: 15px; border-radius: 8px;">
            <p><strong>メリット:</strong></p>
            <ul style="text-align: left; margin: 5px 0;">
                <li>24時間いつでも利用可能</li>
                <li>対面の必要なし</li>
                <li>冷蔵・冷凍対応</li>
                <li>セキュリティ万全</li>
            </ul>
        </div>
        <button class="primary-btn" style="margin-top: 20px;" onclick="closeModal()">閉じる</button>
    `);
}

// カレンダー予約表示（将来機能）
function showCalendarBooking() {
    openModal(`
        <h2>📅 カレンダー予約（開発中）</h2>
        <div style="text-align: center; padding: 20px;">
            <div style="background: #f8f9fa; padding: 30px; border-radius: 12px;">
                <p style="font-size: 48px; margin-bottom: 20px;">📆</p>
                <p>お互いの空き時間を自動でマッチング</p>
                <p style="color: #6c757d; margin-top: 10px;">
                    カレンダー連携により、最適な受け渡し時間を<br>
                    AIが自動で提案します
                </p>
            </div>
            <div style="margin-top: 20px; text-align: left;">
                <h4>機能イメージ:</h4>
                <ul>
                    <li>Googleカレンダー連携</li>
                    <li>空き時間の自動検出</li>
                    <li>最適な時間をAIが提案</li>
                    <li>ワンクリックで予約確定</li>
                </ul>
            </div>
        </div>
        <button class="primary-btn" style="margin-top: 20px;" onclick="closeModal()">閉じる</button>
    `);
}

// 評価システム
function showRatingModal(userId) {
    const user = dummyUsers.find(u => u.id === userId);
    if (!user) return;
    
    openModal(`
        <h2>⭐ 取引の評価</h2>
        <div style="text-align: center; margin: 20px 0;">
            <h3>${user.name}との取引はいかがでしたか？</h3>
        </div>
        <div id="rating-stars" style="font-size: 48px; text-align: center; margin: 20px 0;">
            <span class="star" onclick="setRating(1)" style="cursor: pointer;">☆</span>
            <span class="star" onclick="setRating(2)" style="cursor: pointer;">☆</span>
            <span class="star" onclick="setRating(3)" style="cursor: pointer;">☆</span>
            <span class="star" onclick="setRating(4)" style="cursor: pointer;">☆</span>
            <span class="star" onclick="setRating(5)" style="cursor: pointer;">☆</span>
        </div>
        <div style="margin: 20px 0;">
            <h4>良かった点（複数選択可）</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 15px 0;">
                <button class="tag-btn" onclick="toggleTag(this)">時間通り</button>
                <button class="tag-btn" onclick="toggleTag(this)">品質良好</button>
                <button class="tag-btn" onclick="toggleTag(this)">親切な対応</button>
                <button class="tag-btn" onclick="toggleTag(this)">清潔</button>
                <button class="tag-btn" onclick="toggleTag(this)">連絡がスムーズ</button>
            </div>
        </div>
        <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>評価の重要性:</strong></p>
            <ul style="text-align: left; margin: 5px 0;">
                <li>信頼できるコミュニティの構築</li>
                <li>マッチング精度の向上</li>
                <li>安心・安全な取引の促進</li>
            </ul>
        </div>
        <button class="primary-btn" style="margin-top: 20px;" onclick="submitRating()">評価を送信</button>
    `);
    
    // スタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        .star { transition: color 0.2s ease; }
        .star.filled { color: #ffc107; }
        .tag-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .tag-btn.selected {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
    `;
    document.head.appendChild(style);
}

let currentRating = 0;
let selectedTags = [];

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('filled');
        } else {
            star.textContent = '☆';
            star.classList.remove('filled');
        }
    });
}

function toggleTag(button) {
    button.classList.toggle('selected');
    const tag = button.textContent;
    if (button.classList.contains('selected')) {
        selectedTags.push(tag);
    } else {
        selectedTags = selectedTags.filter(t => t !== tag);
    }
}

function submitRating() {
    if (currentRating === 0) {
        alert('評価を選択してください');
        return;
    }
    
    // 取引履歴を更新
    const transactionIndex = appState.transactions.findIndex(t => t.partner === currentChatUser.name && t.status === '調整中');
    if (transactionIndex !== -1) {
        appState.transactions[transactionIndex].status = '完了';
        appState.transactions[transactionIndex].rating = currentRating;
        appState.transactions[transactionIndex].tags = selectedTags;
    }
    
    saveToLocalStorage();
    closeModal();
    
    // サンクスメッセージ
    showNotification(`評価ありがとうございました！${currentChatUser.name}さんの信頼スコアが更新されました`, 'success');
    
    // 相互評価のお知らせ
    setTimeout(() => {
        showNotification(`${currentChatUser.name}さんもあなたを★5と評価しました！`, 'info');
    }, 2000);
}

// 地図表示切り替え
function toggleView(viewType) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (viewType === 'map') {
        document.querySelector('.view-btn:nth-child(2)').classList.add('active');
        document.getElementById('map-view').classList.add('active');
        initializeMap();
    } else {
        document.querySelector('.view-btn:nth-child(1)').classList.add('active');
        document.getElementById('list-view').classList.add('active');
    }
}

// GeoJSONデータの初期生成
function initializeGeoJSONData() {
    const myInventory = appState.inventory.map(item => item.name);
    
    // 現在位置を設定（多摩市役所）
    const myLat = 35.6361;
    const myLng = 139.4463;
    
    // GeoJSON features配列を作成
    const features = [];
    
    // 自分の位置を追加
    features.push({
        type: "Feature",
        properties: {
            title: "あなたの位置",
            description: "多摩市市役所",
            "marker-color": "#007bff",
            "marker-size": "large",
            "marker-symbol": "star"
        },
        geometry: {
            type: "Point",
            coordinates: [myLng, myLat]
        }
    });
    
    // マッチング候補のマーカーを追加
    dummyUsers.forEach(user => {
        // マッチ度計算
        const matchingNeeds = user.needs.filter(need => myInventory.includes(need));
        const needsMatchScore = (matchingNeeds.length / user.needs.length) * 100;
        const giveBalance = user.givePoints - user.takePoints;
        const totalMatchScore = Math.round(
            (needsMatchScore * 0.5) + 
            (Math.min(giveBalance / 10, 50) * 0.3) + 
            20 // 距離スコア
        );
        
        // マーカーの色を決定
        let markerColor = '#dc3545'; // 赤
        if (totalMatchScore >= 80) markerColor = '#28a745'; // 緑
        else if (totalMatchScore >= 60) markerColor = '#ffc107'; // 黄
        
        // ポップアップの内容
        const description = `
            <div style="font-size: 14px;">
                <p><strong>マッチ度:</strong> ${totalMatchScore}%</p>
                <p><strong>距離:</strong> ${user.distance}</p>
                <p><strong>場所:</strong> ${user.location || ''}</p>
                <p><strong>評価:</strong> ⭐${user.rating} (${user.reviews}件)</p>
                <p><strong>ランク:</strong> ${user.rank}</p>
                <p><strong>欲しい食材:</strong> ${user.needs.join(', ')}</p>
                <p><strong>提供可能:</strong> ${user.offers.join(', ')}</p>
                ${matchingNeeds.length > 0 ? 
                    `<p style="color: #28a745; font-weight: bold;">✅ ${matchingNeeds.join(', ')}を探しています！</p>` : ''}
            </div>
        `;
        
        features.push({
            type: "Feature",
            properties: {
                title: `${user.avatar} ${user.name} (${totalMatchScore}%)`,
                description: description,
                "marker-color": markerColor,
                "marker-size": "medium"
            },
            geometry: {
                type: "Point",
                coordinates: [user.lng, user.lat]
            }
        });
    });
    
    // GeoJSONデータを更新
    const geojsonData = {
        type: "FeatureCollection",
        features: features
    };
    
    // script要素のGeoJSONデータを更新
    const geojsonScript = document.getElementById('users-geojson');
    if (geojsonScript) {
        geojsonScript.textContent = JSON.stringify(geojsonData, null, 2);
    }
}

// Geolonia地図の初期化（地図表示切り替え時）
function initializeMap() {
    // GeoJSONデータを再生成
    initializeGeoJSONData();
    
    // Geoloniaマップが読み込まれるまで少し待つ
    setTimeout(() => {
        const mapElement = document.getElementById('geolonia-map');
        if (mapElement) {
            // 地図が正しく表示されるように、必要に応じて再描画
            window.dispatchEvent(new Event('resize'));
        }
    }, 500);
}