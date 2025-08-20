# ServiceNow CSM - フードロス対策アプリ ページ構成

## 1. Service Portal ページ構成

### 1.1 メインポータル設定
```
Portal URL: /food_share
Portal Title: FoodShare - フードロス対策プラットフォーム
Theme: Custom Theme (紫系グラデーション)
Menu: Horizontal Menu
```

### 1.2 主要ページ一覧

#### ホームページ (home)
```
URL: /food_share
Page ID: food_share_home
Widgets:
- Hero Banner (カスタム)
- 統計ダッシュボード
- クイックアクションタイル
- 新着マッチング通知
```

#### 食品登録ページ (food_register)
```
URL: /food_share?id=food_register
Page ID: food_register
Widgets:
- Record Producer (x_food_inventory)
- 食品マスタ検索
- AI入力アシスタント
- 在庫一覧表示
```

#### 在庫管理ページ (my_inventory)
```
URL: /food_share?id=my_inventory
Page ID: my_inventory
Widgets:
- Data Table (x_food_inventory)
- フィルター (期限間近/期限切れ)
- 一括操作ボタン
- カレンダービュー
```

#### マッチングページ (matching)
```
URL: /food_share?id=matching
Page ID: food_matching
Widgets:
- マッチング候補リスト (カスタム)
- ユーザープロフィールカード
- マップ表示
- フィルター機能
```

#### 調整ページ (coordination)
```
URL: /food_share?id=coordination&match_id=${sys_id}
Page ID: food_coordination
Widgets:
- 調整フォーム (カスタム)
- AIアシスタントチャット
- カレンダー選択
- 場所選択マップ
```

#### 取引履歴ページ (transactions)
```
URL: /food_share?id=transactions
Page ID: my_transactions
Widgets:
- Data Table (x_food_transaction)
- 評価フォーム
- 統計グラフ
- ポイント履歴
```

#### プロフィールページ (profile)
```
URL: /food_share?id=profile
Page ID: user_profile
Widgets:
- Form (x_food_user_profile)
- バッジ表示
- Give/Takeバランス
- 実績グラフ
```

#### レシピページ (recipes)
```
URL: /food_share?id=recipes
Page ID: food_recipes
Widgets:
- Knowledge Base (x_food_recipe)
- 食材フィルター
- お気に入り機能
- レシピ提案AI
```

## 2. Widget 設定詳細

### 2.1 カスタムWidget例

#### マッチング候補Widget
```javascript
// Client Script
function($scope, $http, spUtil) {
    var c = this;
    
    // マッチング候補取得
    c.getMatches = function() {
        var ga = new GlideAjax('FoodMatchingUtil');
        ga.addParam('sysparm_name', 'getMatchCandidates');
        ga.addParam('sysparm_user', g_user.userID);
        ga.getXML(function(response) {
            c.matches = JSON.parse(response);
            $scope.$apply();
        });
    };
    
    // マッチ度に応じた色分け
    c.getMatchColor = function(score) {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'default';
    };
}

// Server Script
(function() {
    data.inventory = [];
    
    var gr = new GlideRecord('x_food_inventory');
    gr.addQuery('u_owner', gs.getUserID());
    gr.addQuery('u_status', 'IN', '在庫中,マッチング中');
    gr.query();
    
    while(gr.next()) {
        data.inventory.push({
            sys_id: gr.sys_id.toString(),
            name: gr.u_food_name.toString(),
            expiry: gr.u_expiry_date.getDisplayValue(),
            quantity: gr.u_quantity.toString()
        });
    }
})();
```

### 2.2 標準Widget活用

#### Data Table設定
```json
{
    "table": "x_food_inventory",
    "fields": "u_food_name,u_quantity,u_expiry_date,u_status",
    "filter": "u_owner={{user.sys_id}}^u_status!=廃棄",
    "order_by": "u_expiry_date",
    "maximum_entries": 20
}
```

## 3. ナビゲーション設定

### 3.1 ヘッダーメニュー
```
- ホーム (/food_share)
- 食品登録 (/food_share?id=food_register)
- 在庫管理 (/food_share?id=my_inventory)
- おすそ分け (/food_share?id=matching)
- レシピ (/food_share?id=recipes)
- 統計 (/food_share?id=stats)
```

### 3.2 モバイルメニュー
```
Menu Type: Hamburger Menu
Items:
- ホーム
- 食品登録 (+ アイコン)
- 在庫一覧
- マッチング (バッジ付き)
- 取引履歴
- プロフィール
```

## 4. CSM Workspace設定

### 4.1 Agent Workspace設定
```
Workspace: Food Share Management
Tabs:
- ダッシュボード
- 食品在庫管理
- マッチング管理
- ユーザーサポート
- レポート
```

### 4.2 ダッシュボードWidget
- リアルタイムマッチング状況
- 期限切れアラート
- ユーザー活動状況
- KPI表示

## 5. ページフロー

### 5.1 新規ユーザーフロー
```
1. ランディングページ → 登録
2. プロフィール設定 (アレルギー等)
3. チュートリアル
4. 食品登録
5. ホームダッシュボード
```

### 5.2 マッチングフロー
```
1. 在庫一覧 → おすそ分けボタン
2. マッチング候補表示
3. 相手選択 → 調整ページ
4. 場所・時間選択
5. 確定 → 通知送信
6. 完了後 → 評価ページ
```

## 6. ページセキュリティ

### 6.1 アクセス制御
```javascript
// Page Security
if (!gs.hasRole('x_food_user') && !gs.hasRole('admin')) {
    // リダイレクト
    $location.url('/food_share?id=login');
}
```

### 6.2 データスコープ
- 自分の在庫のみ編集可能
- マッチング相手の基本情報のみ表示
- 個人情報はマスキング

## 7. レスポンシブ設定

### 7.1 ブレークポイント
```css
/* モバイル */
@media (max-width: 767px) {
    .matching-card { width: 100%; }
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
    .matching-card { width: 50%; }
}

/* デスクトップ */
@media (min-width: 1024px) {
    .matching-card { width: 33.33%; }
}
```

## 8. パフォーマンス最適化

### 8.1 遅延読み込み
- 画像の遅延読み込み
- 無限スクロール実装
- キャッシュ活用

### 8.2 データ取得最適化
```javascript
// GlideAjaxでの非同期取得
var ga = new GlideAjax('FoodDataUtil');
ga.addParam('sysparm_name', 'getInventoryBatch');
ga.addParam('sysparm_limit', 20);
ga.addParam('sysparm_offset', offset);
```

## 9. 多言語対応

### 9.1 メッセージ設定
```
Key: food_share.welcome
日本語: ようこそ、フードシェアへ
English: Welcome to Food Share
```

### 9.2 動的切り替え
```javascript
// 言語切り替え
$scope.changeLanguage = function(lang) {
    $window.location.href = '/food_share?lang=' + lang;
};
```