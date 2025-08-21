// 食品マスタデータ
const foodMaster = {
    // 野菜類
    'トマト': { category: '野菜', defaultDays: 7, icon: '🍅' },
    'きゅうり': { category: '野菜', defaultDays: 5, icon: '🥒' },
    'キャベツ': { category: '野菜', defaultDays: 10, icon: '🥬' },
    'レタス': { category: '野菜', defaultDays: 7, icon: '🥬' },
    'にんじん': { category: '野菜', defaultDays: 14, icon: '🥕' },
    '人参': { category: '野菜', defaultDays: 14, icon: '🥕' },
    'じゃがいも': { category: '野菜', defaultDays: 30, icon: '🥔' },
    'たまねぎ': { category: '野菜', defaultDays: 30, icon: '🧅' },
    '玉ねぎ': { category: '野菜', defaultDays: 30, icon: '🧅' },
    'ピーマン': { category: '野菜', defaultDays: 7, icon: '🫑' },
    'なす': { category: '野菜', defaultDays: 5, icon: '🍆' },
    'ほうれん草': { category: '野菜', defaultDays: 3, icon: '🥬' },
    'ブロッコリー': { category: '野菜', defaultDays: 5, icon: '🥦' },
    
    // 肉類
    '鶏肉': { category: '肉', defaultDays: 2, icon: '🍗' },
    '豚肉': { category: '肉', defaultDays: 3, icon: '🥩' },
    '牛肉': { category: '肉', defaultDays: 3, icon: '🥩' },
    'ひき肉': { category: '肉', defaultDays: 2, icon: '🥩' },
    'ベーコン': { category: '肉', defaultDays: 7, icon: '🥓' },
    'ハム': { category: '肉', defaultDays: 5, icon: '🍖' },
    'ソーセージ': { category: '肉', defaultDays: 5, icon: '🌭' },
    
    // 魚介類
    '刺身': { category: '魚介', defaultDays: 1, icon: '🍣' },
    '鮭': { category: '魚介', defaultDays: 2, icon: '🐟' },
    'さば': { category: '魚介', defaultDays: 2, icon: '🐟' },
    'まぐろ': { category: '魚介', defaultDays: 2, icon: '🐟' },
    'えび': { category: '魚介', defaultDays: 2, icon: '🦐' },
    'いか': { category: '魚介', defaultDays: 2, icon: '🦑' },
    
    // 乳製品
    '牛乳': { category: '乳製品', defaultDays: 5, icon: '🥛' },
    'ヨーグルト': { category: '乳製品', defaultDays: 10, icon: '🥛' },
    'チーズ': { category: '乳製品', defaultDays: 30, icon: '🧀' },
    'バター': { category: '乳製品', defaultDays: 60, icon: '🧈' },
    
    // 卵
    '卵': { category: '卵', defaultDays: 14, icon: '🥚' },
    'たまご': { category: '卵', defaultDays: 14, icon: '🥚' },
    
    // パン類
    'パン': { category: 'パン', defaultDays: 3, icon: '🍞' },
    '食パン': { category: 'パン', defaultDays: 3, icon: '🍞' },
    'バゲット': { category: 'パン', defaultDays: 2, icon: '🥖' },
    
    // 果物
    'りんご': { category: '果物', defaultDays: 14, icon: '🍎' },
    'バナナ': { category: '果物', defaultDays: 5, icon: '🍌' },
    'みかん': { category: '果物', defaultDays: 7, icon: '🍊' },
    'いちご': { category: '果物', defaultDays: 3, icon: '🍓' },
    'ぶどう': { category: '果物', defaultDays: 5, icon: '🍇' },
    
    // その他
    '豆腐': { category: 'その他', defaultDays: 3, icon: '🥡' },
    '納豆': { category: 'その他', defaultDays: 7, icon: '🥡' },
    'もやし': { category: 'その他', defaultDays: 2, icon: '🌱' },
};

// レシピデータ
const recipes = [
    {
        id: 1,
        name: 'トマトと卵のスペイン風オムレツ',
        ingredients: ['トマト', '卵', 'たまねぎ'],
        time: '20分',
        difficulty: 'easy',
        description: 'シンプルで美味しい朝食メニュー'
    },
    {
        id: 2,
        name: '野菜たっぷりスープ',
        ingredients: ['キャベツ', 'にんじん', 'たまねぎ', 'じゃがいも'],
        time: '30分',
        difficulty: 'easy',
        description: '余った野菜を活用できる栄養満点スープ'
    },
    {
        id: 3,
        name: 'チキンサラダ',
        ingredients: ['鶏肉', 'レタス', 'トマト', 'きゅうり'],
        time: '15分',
        difficulty: 'easy',
        description: 'ヘルシーで満足感のあるサラダ'
    },
    {
        id: 4,
        name: '豚肉と野菜の炒め物',
        ingredients: ['豚肉', 'キャベツ', 'にんじん', 'ピーマン'],
        time: '20分',
        difficulty: 'medium',
        description: '栄養バランスの良い定番料理'
    },
    {
        id: 5,
        name: 'フレンチトースト',
        ingredients: ['パン', '卵', '牛乳'],
        time: '15分',
        difficulty: 'easy',
        description: '余ったパンを美味しくリメイク'
    }
];

// ダミーユーザーデータ（マッチング用）- 多摩市周辺
const dummyUsers = [
    {
        id: 1,
        name: '鈴木さん',
        avatar: '👩',
        distance: '300m',
        lat: 35.6371,  // 多摩市役所付近
        lng: 139.4481,
        needs: ['トマト', 'きゅうり'],
        offers: ['卵', 'キャベツ'],
        givePoints: 120,
        takePoints: 30,
        rank: 'ゴールドGiver',
        rating: 4.8,
        reviews: 23,
        message: '子どものサラダ用にトマトが欲しいです',
        responseTime: '通常5分以内',
        preferredTime: '平日夕方',
        badges: ['親切な人', '返信早い', '地域貢献者'],
        location: '多摩センター駅付近'
    },
    {
        id: 2,
        name: '田中さん',
        avatar: '👨',
        distance: '500m',
        lat: 35.6342,  // 永山駅方面
        lng: 139.4495,
        needs: ['卵', '牛乳'],
        offers: ['にんじん', 'じゃがいも', 'たまねぎ'],
        givePoints: 200,
        takePoints: 50,
        rank: 'プラチナGiver',
        rating: 4.9,
        reviews: 45,
        message: 'お菓子作りで卵と牛乳が必要です',
        responseTime: '通常10分以内',
        preferredTime: '週末午前',
        badges: ['スーパーGiver', '100回達成', 'エコ戦士'],
        location: '永山駅前'
    },
    {
        id: 3,
        name: '佐藤さん',
        avatar: '👴',
        distance: '800m',
        lat: 35.6389,  // 聖蹟桜ヶ丘方面
        lng: 139.4432,
        needs: ['にんじん', 'じゃがいも'],
        offers: ['トマト', 'なす'],
        givePoints: 80,
        takePoints: 40,
        rank: 'シルバーGiver',
        rating: 4.5,
        reviews: 12,
        message: 'カレーを作りたいので野菜を探しています',
        responseTime: '通常30分以内',
        preferredTime: '午前中',
        badges: ['野菜ソムリエ', '新人応援'],
        location: '聖蹟桜ヶ丘駅付近'
    },
    {
        id: 4,
        name: '高橋さん',
        avatar: '👩',
        distance: '1.2km',
        lat: 35.6328,  // 唐木田駅方面
        lng: 139.4512,
        needs: ['パン'],
        offers: ['りんご', 'バナナ'],
        givePoints: 150,
        takePoints: 20,
        rank: 'ゴールドGiver',
        rating: 4.7,
        reviews: 31,
        message: '朝食用のパンが切れてしまいました',
        responseTime: '通常15分以内',
        preferredTime: '朝か夜',
        badges: ['フルーツマスター', '笑顔で対応'],
        location: '唐木田駅付近'
    },
    {
        id: 5,
        name: '山田さん',
        avatar: '👵',
        distance: '400m',
        lat: 35.6355,  // 多摩市立図書館付近
        lng: 139.4445,
        needs: ['豆腐', '納豆'],
        offers: ['大根', 'ほうれん草', '白菜'],
        givePoints: 95,
        takePoints: 15,
        rank: 'ゴールドGiver',
        rating: 4.9,
        reviews: 18,
        message: '今夜の鍋に豆腐が必要です',
        responseTime: '通常20分以内',
        preferredTime: '午後',
        badges: ['野菜づくり名人', '優しい笑顔', '地元愛'],
        location: '多摩市立図書館付近'
    },
    {
        id: 6,
        name: '伊藤さん',
        avatar: '🧑',
        distance: '600m',
        lat: 35.6398,  // ベルブ永山付近
        lng: 139.4491,
        needs: ['レタス', 'トマト'],
        offers: ['鶏肉', '豚肉'],
        givePoints: 180,
        takePoints: 60,
        rank: 'プラチナGiver',
        rating: 4.6,
        reviews: 52,
        message: 'サンドイッチ用の野菜を探しています',
        responseTime: '通常15分以内',
        preferredTime: '週末',
        badges: ['肉のプロ', 'スピード対応', '信頼度MAX'],
        location: 'ベルブ永山'
    },
    {
        id: 7,
        name: '小林さん',
        avatar: '👨‍🍳',
        distance: '900m',
        lat: 35.6312,  // 多摩中央公園付近
        lng: 139.4426,
        needs: ['チーズ', 'バター'],
        offers: ['パン', 'クッキー', 'ケーキ'],
        givePoints: 110,
        takePoints: 25,
        rank: 'ゴールドGiver',
        rating: 5.0,
        reviews: 8,
        message: 'パン作りで乳製品が必要です',
        responseTime: '通常10分以内',
        preferredTime: '朝',
        badges: ['パン職人', '手作り愛好家', '朝型人間'],
        location: '多摩中央公園付近'
    }
];

// 取引履歴データ
const transactionHistory = [
    {
        id: 1,
        type: 'give',
        item: 'トマト 3個',
        partner: '山田さん',
        date: '2024-01-15',
        points: 10,
        status: '完了'
    },
    {
        id: 2,
        type: 'take',
        item: '卵 6個',
        partner: '伊藤さん',
        date: '2024-01-14',
        points: -10,
        status: '完了'
    },
    {
        id: 3,
        type: 'give',
        item: 'キャベツ 1/2個',
        partner: '加藤さん',
        date: '2024-01-13',
        points: 15,
        status: '完了'
    }
];