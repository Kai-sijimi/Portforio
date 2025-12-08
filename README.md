# 乗杉 海 ブログ / Portfolio

テクノロジージャーナリスト **乗杉 海** のポートフォリオサイト＆フルスタックブログシステム

## プロジェクト概要

- **名前**: 乗杉海 Blog & Portfolio
- **目的**: テクノロジーに関する考察・記事投稿、ポートフォリオ公開
- **特徴**: サイバーパンク風ダークテーマ、D1データベースによる本格的なブログシステム

## URL

### 現在稼働中

| サービス | URL | 説明 |
|---------|-----|------|
| ポートフォリオ | https://kai-sijimi.github.io/Portforio/ | 静的ポートフォリオサイト |
| ブログ一覧 | https://kai-sijimi.github.io/Portforio/blog.html | 静的ブログページ |
| GitHub | https://github.com/Kai-sijimi/Portforio | ソースコード |

### サンドボックス開発環境（バックエンド付き）

| エンドポイント | 説明 |
|---------------|------|
| `/` | ブログトップページ |
| `/post/:slug` | 記事詳細ページ |
| `/admin/login` | 管理者ログイン |
| `/admin/dashboard` | 管理ダッシュボード |
| `/admin/posts/new` | 新規記事作成 |
| `/admin/posts/:id/edit` | 記事編集 |

## 技術スタック

### フロントエンド
- **純粋なHTML/CSS/JavaScript** - フレームワーク不使用の軽量構成
- **SPAルーター** - History API を使用したクライアントサイドルーティング
- **Tailwind CSS (CDN)** - ユーティリティファーストCSS
- **サイバーダークテーマ** - カスタムCSSによる統一デザイン

### バックエンド
- **Hono** - 軽量・高速なWeb フレームワーク
- **Cloudflare Workers** - エッジランタイム
- **Cloudflare D1** - SQLiteベースの分散データベース
- **Wrangler** - Cloudflare 開発/デプロイツール

## データアーキテクチャ

### データベーススキーマ (D1)

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 記事テーブル
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT DEFAULT 'テック考察',
  tags TEXT,
  status TEXT DEFAULT 'draft',
  featured INTEGER DEFAULT 0,
  author_id INTEGER,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- セッションテーブル
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API エンドポイント

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | `/api/auth/login` | ログイン | 不要 |
| POST | `/api/auth/logout` | ログアウト | 不要 |
| GET | `/api/auth/me` | セッション確認 | 不要 |
| GET | `/api/posts` | 公開記事一覧 | 不要 |
| GET | `/api/posts/:slug` | 記事詳細 | 不要 |
| GET | `/api/admin/posts` | 全記事一覧 | 必要 |
| GET | `/api/admin/posts/:id` | 記事取得（編集用） | 必要 |
| POST | `/api/admin/posts` | 記事作成 | 必要 |
| PUT | `/api/admin/posts/:id` | 記事更新 | 必要 |
| DELETE | `/api/admin/posts/:id` | 記事削除 | 必要 |
| GET | `/api/admin/stats` | 統計情報 | 必要 |

## 管理者ログイン情報

```
ユーザーID: kai_admin
パスワード: Tech2025!
```

⚠️ **本番デプロイ前にパスワードを変更してください！**

## 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# データベースマイグレーション（ローカル）
npm run db:migrate:local

# シードデータ投入（ローカル）
npm run db:seed:local

# 開発サーバー起動
npm run dev

# または PM2 で起動
pm2 start ecosystem.config.cjs
```

## デプロイ

### Cloudflare Pages へのデプロイ

```bash
# 1. Cloudflare API トークン設定
# Deploy タブで API キーを設定

# 2. D1 データベース作成
npx wrangler d1 create kai-blog-db

# 3. wrangler.jsonc の database_id を更新

# 4. 本番マイグレーション
npm run db:migrate:prod

# 5. ビルド & デプロイ
npm run deploy
```

## 機能一覧

### 実装済み ✅
- [x] サイバーパンク風ダークテーマデザイン
- [x] レスポンシブUI/UX
- [x] パーティクルアニメーション背景
- [x] ユーザー認証（ログイン/ログアウト）
- [x] セッション管理（Cookie）
- [x] ブログ記事のCRUD操作
- [x] Markdown形式での記事作成
- [x] Featured記事機能
- [x] カテゴリ・タグ機能
- [x] 記事の下書き/公開切り替え
- [x] 管理者ダッシュボード
- [x] SNSシェアボタン
- [x] SPAルーティング

### 未実装（拡張予定）
- [ ] 画像アップロード（R2 Storage）
- [ ] コメント機能
- [ ] 記事検索
- [ ] RSSフィード
- [ ] OGP画像自動生成
- [ ] アクセス解析

## ディレクトリ構成

```
webapp/
├── src/
│   └── index.tsx        # Honoメインアプリケーション
├── public/
│   └── static/
│       ├── app.js       # SPAフロントエンド
│       └── styles.css   # カスタムCSS
├── docs/                # 静的ポートフォリオサイト (GitHub Pages)
├── migrations/
│   └── 0001_initial_schema.sql
├── seed.sql             # 初期データ
├── wrangler.jsonc       # Cloudflare設定
├── ecosystem.config.cjs # PM2設定
├── package.json
└── README.md
```

## ライセンス

© 2025 乗杉 海 - All Rights Reserved

---

🔗 **Contact & Links**
- Portfolio: https://kai-sijimi.github.io/Portforio/
- GitHub: https://github.com/Kai-sijimi
