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

// ダミーユーザーデータ（マッチング用）
const dummyUsers = [
    {
        id: 1,
        name: '鈴木さん',
        avatar: '👩',
        distance: '300m',
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
        badges: ['親切な人', '返信早い', '地域貢献者']
    },
    {
        id: 2,
        name: '田中さん',
        avatar: '👨',
        distance: '500m',
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
        badges: ['スーパーGiver', '100回達成', 'エコ戦士']
    },
    {
        id: 3,
        name: '佐藤さん',
        avatar: '👴',
        distance: '800m',
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
        badges: ['野菜ソムリエ', '新人応援']
    },
    {
        id: 4,
        name: '高橋さん',
        avatar: '👩',
        distance: '1.2km',
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
        badges: ['フルーツマスター', '笑顔で対応']
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