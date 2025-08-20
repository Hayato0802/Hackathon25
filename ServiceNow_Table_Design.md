# ServiceNow CSM - フードロス対策アプリ テーブル設計

## 概要
ServiceNow CSM（Customer Service Management）プラットフォームを活用したフードロス対策アプリのテーブル構成です。
標準テーブルとカスタムテーブルを組み合わせて実装します。

## 命名規則
- カスタムテーブル接頭辞: `x_food_`
- カスタムフィールド接頭辞: `u_`

## 1. 基本テーブル構成

### 1.1 食品在庫テーブル (x_food_inventory)
```
テーブル名: x_food_inventory
継承元: task

フィールド:
- number (String) - 自動採番（FOOD0001234）
- u_food_name (String) - 食品名 *必須
- u_food_category (Choice) - カテゴリ（野菜/肉/魚介/乳製品/その他）
- u_quantity (String) - 数量（例：3個、500g）
- u_expiry_date (Date/Time) - 賞味期限 *必須
- u_storage_type (Choice) - 保存方法（冷蔵/冷凍/常温）
- u_owner (Reference -> sys_user) - 所有者 *必須
- u_status (Choice) - ステータス（在庫中/マッチング中/提供済/消費済/廃棄）
- u_location (Reference -> cmn_location) - 保管場所
- u_food_condition (Choice) - 状態（新品/良好/要消費）
- u_registered_date (Date/Time) - 登録日時
- u_image (Image) - 食品画像
- active (True/False) - 有効フラグ
```

### 1.2 食品マスタテーブル (x_food_master)
```
テーブル名: x_food_master
継承元: なし

フィールド:
- u_food_name (String) - 食品名 *必須 *ユニーク
- u_category (Choice) - カテゴリ
- u_default_expiry_days (Integer) - デフォルト賞味期限（日数）
- u_storage_recommendation (Choice) - 推奨保存方法
- u_icon (String) - アイコン（絵文字）
- u_nutrition_info (String 4000) - 栄養情報
- u_allergy_info (String) - アレルギー情報
- u_co2_per_kg (Decimal) - 1kgあたりのCO2排出量
- active (True/False) - 有効フラグ
```

### 1.3 マッチングテーブル (x_food_matching)
```
テーブル名: x_food_matching
継承元: task

フィールド:
- number (String) - 自動採番（MATCH0001234）
- u_food_item (Reference -> x_food_inventory) - 提供食品
- u_provider (Reference -> sys_user) - 提供者
- u_receiver (Reference -> sys_user) - 受取者
- u_match_score (Integer) - マッチ度（0-100）
- u_status (Choice) - ステータス（提案中/調整中/確定/完了/キャンセル）
- u_pickup_location (Reference -> x_food_pickup_location) - 受渡場所
- u_pickup_datetime (Date/Time) - 受渡予定日時
- u_pickup_type (Choice) - 受渡方法（対面/ボックス/宅配）
- u_provider_confirmed (True/False) - 提供者確認済
- u_receiver_confirmed (True/False) - 受取者確認済
- u_completion_date (Date/Time) - 完了日時
- u_cancellation_reason (String) - キャンセル理由
```

### 1.4 ユーザー拡張テーブル (x_food_user_profile)
```
テーブル名: x_food_user_profile
継承元: なし

フィールド:
- u_user (Reference -> sys_user) - ユーザー *必須 *ユニーク
- u_give_points (Integer) - Giveポイント
- u_take_points (Integer) - Takeポイント
- u_user_rank (Choice) - ランク（ブロンズ/シルバー/ゴールド/プラチナ）
- u_rating_average (Decimal) - 平均評価（1.0-5.0）
- u_rating_count (Integer) - 評価件数
- u_preferred_pickup_location (Reference -> cmn_location) - 希望受渡場所
- u_preferred_time_slot (Choice) - 希望時間帯（午前/午後/夕方/夜間）
- u_dietary_restrictions (String) - 食事制限
- u_allergies (String) - アレルギー情報
- u_notification_preference (Choice) - 通知設定（メール/SMS/アプリ）
- u_badges (String 4000) - 獲得バッジ（JSON）
- u_co2_saved (Decimal) - CO2削減量（kg）
- u_money_saved (Currency) - 節約金額
- u_join_date (Date) - 参加日
- u_last_activity (Date/Time) - 最終活動日時
```

### 1.5 取引履歴テーブル (x_food_transaction)
```
テーブル名: x_food_transaction
継承元: task

フィールド:
- number (String) - 自動採番（TRANS0001234）
- u_matching (Reference -> x_food_matching) - マッチング
- u_transaction_type (Choice) - 取引タイプ（提供/受取）
- u_user (Reference -> sys_user) - ユーザー
- u_partner (Reference -> sys_user) - 相手ユーザー
- u_food_items (String 4000) - 食品リスト（JSON）
- u_points_earned (Integer) - 獲得ポイント
- u_transaction_date (Date/Time) - 取引日時
- u_status (Choice) - ステータス（調整中/確定/完了/キャンセル）
- u_rating (Integer) - 評価（1-5）
- u_rating_tags (String) - 評価タグ（時間通り,品質良好,親切）
- u_comment (String 1000) - コメント
- u_co2_saved (Decimal) - CO2削減量
```

### 1.6 受渡場所テーブル (x_food_pickup_location)
```
テーブル名: x_food_pickup_location
継承元: cmn_location

フィールド:
- u_location_type (Choice) - 場所タイプ（駅/スーパー/公園/ボックス/その他）
- u_box_number (String) - ボックス番号（ボックスの場合）
- u_access_hours (String) - 利用可能時間
- u_has_refrigeration (True/False) - 冷蔵機能
- u_has_freezer (True/False) - 冷凍機能
- u_capacity (Integer) - 収容可能数
- u_qr_code (String) - QRコード情報
- u_instructions (String 4000) - 利用方法
- u_image_url (URL) - 場所の画像
```

### 1.7 レシピテーブル (x_food_recipe)
```
テーブル名: x_food_recipe
継承元: kb_knowledge

フィールド:
- u_recipe_name (String) - レシピ名 *必須
- u_ingredients (String 4000) - 必要食材（JSON）
- u_cooking_time (Integer) - 調理時間（分）
- u_difficulty (Choice) - 難易度（簡単/普通/難しい）
- u_instructions (HTML) - 調理手順
- u_nutrition_info (String) - 栄養情報
- u_serving_size (Integer) - 人数分
- u_category (Choice) - カテゴリ（和食/洋食/中華/その他）
- u_image_url (URL) - 料理画像
- u_popularity_score (Integer) - 人気度
```

### 1.8 通知履歴テーブル (x_food_notification)
```
テーブル名: x_food_notification
継承元: sys_email

フィールド:
- u_notification_type (Choice) - 通知タイプ（期限間近/マッチング/評価依頼）
- u_user (Reference -> sys_user) - 対象ユーザー
- u_related_food (Reference -> x_food_inventory) - 関連食品
- u_related_matching (Reference -> x_food_matching) - 関連マッチング
- u_sent_date (Date/Time) - 送信日時
- u_read_date (Date/Time) - 既読日時
- u_action_taken (True/False) - アクション実行済
```

## 2. リレーションシップ

### 2.1 主要な関連
- `x_food_inventory` → `sys_user` (所有者)
- `x_food_matching` → `x_food_inventory` (提供食品)
- `x_food_matching` → `sys_user` (提供者/受取者)
- `x_food_transaction` → `x_food_matching` (マッチング)
- `x_food_user_profile` → `sys_user` (1対1)

### 2.2 ビジネスルール例
```javascript
// 期限切れ間近の食品を自動検出
(function executeRule(current, previous /*null when async*/) {
    var gr = new GlideRecord('x_food_inventory');
    gr.addQuery('u_status', 'IN', '在庫中,マッチング中');
    gr.addQuery('u_expiry_date', '<=', gs.daysAgo(-2));
    gr.query();
    
    while (gr.next()) {
        // 通知作成
        var notification = new GlideRecord('x_food_notification');
        notification.initialize();
        notification.u_notification_type = '期限間近';
        notification.u_user = gr.u_owner;
        notification.u_related_food = gr.sys_id;
        notification.insert();
    }
})(current, previous);
```

## 3. ACL（アクセス制御）

### 3.1 基本ルール
- 自分の食品在庫: 読み書き可能
- 他人の食品在庫: 読み取りのみ（マッチング用）
- マッチング: 関係者のみ読み書き可能
- ユーザープロフィール: 本人のみ編集可能

### 3.2 ロール
- `x_food_user` - 一般ユーザー
- `x_food_moderator` - モデレーター
- `x_food_admin` - 管理者

## 4. Flow Designer活用例

### 4.1 マッチング自動化フロー
1. トリガー: 食品在庫登録
2. アクション: 
   - 需要者を検索
   - マッチ度計算
   - マッチング提案作成
   - 通知送信

### 4.2 評価リマインダーフロー
1. トリガー: 取引完了から24時間後
2. アクション:
   - 未評価チェック
   - リマインダー通知送信

## 5. レポート・ダッシュボード

### 5.1 KPIダッシュボード
- 月間CO2削減量
- アクティブユーザー数
- マッチング成功率
- 平均評価スコア

### 5.2 個人ダッシュボード
- 在庫食品の期限カレンダー
- Give/Takeバランス
- 取引履歴グラフ
- 獲得バッジ一覧

## 6. Integration Hub連携

### 6.1 外部連携
- LINE/Slack通知（Webhook）
- Google Calendar連携
- 地図API（受渡場所表示）
- レシピAPI

### 6.2 REST API
```
GET /api/x_food/inventory - 在庫一覧取得
POST /api/x_food/inventory - 食品登録
GET /api/x_food/matching - マッチング候補取得
POST /api/x_food/matching - マッチング作成
```

## 7. モバイルアプリ対応

ServiceNow Mobileアプリでの主要機能:
- 食品登録（カメラ撮影対応）
- プッシュ通知
- QRコード表示/読取
- 簡易マッチング確認