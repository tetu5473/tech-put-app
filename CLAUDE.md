# tech-put-app

講師（管理者）と受講生（ユーザー）向けの e-learning・コミュニティアプリ。詳細な機能一覧は README.md を参照。

## 技術スタック

- React 18 + TypeScript + Vite 4（SPA、バックエンドなし）
- ルーティング: react-router-dom v7（`src/Routes.tsx` に全ルート定義）
- データ永続化: ブラウザの IndexedDB（localforage 経由）。サーバー・DB は存在しない
- CSS: Bootstrap 5 を主に使用（Tailwind も設定はあるが混在に注意）

## コマンド

- `npm run dev` — 開発サーバー起動
- `npm run typecheck` — 型チェック（tsc --noEmit）
- `npm run lint` — ESLint
- `npm test` — テスト実行（Vitest）
- `npm run build` — 型チェック＋本番ビルド

## ディレクトリ構成

- `src/pages/users/` — 受講生側ページ（/login, /signup, /dashboard など）
- `src/pages/admins/` — 管理者側ページ（/admin/... 配下）
- `src/lib/` — データ層。**新しいデータ操作は必ずここに追加する**
  - `usersStore.ts` — 受講生の登録・ログイン（localforage: `tech-put-app`）
  - `adminStore.ts` — 管理者の登録・ログイン（localforage: `tech-put-admin`、bcrypt でハッシュ化）
  - `users.ts` — User 型と性別定数
- `src/components/` — 共通レイアウト（AuthLayout, admin/AdminLayout）

## 重要な注意点

- `src/utils/indexedDB.ts` は**どこからも使われていないレガシーコード**。新規コードから import しないこと（データ層は `src/lib/` に統一）
- `src/pages/adminpage.tsx` は sessionStorage を読む旧実装で、現在の認証（localforage セッション）と繋がっていない
- 認証は各ページの `useEffect` 内で `getCurrentUser()` / `getCurrentAdmin()` を確認して未ログインならリダイレクトする方式。**認証が必要なページを新規作成するときは必ずこのガードを入れる**
- 受講生側のパスワードは学習用として平文保存（`usersStore.ts`）。管理者側は bcrypt 使用。本番相当の実装にする際はサーバーサイド認証に置き換えが必要

## 開発フロー

- main へ直接コミットせず、フィーチャーブランチ → Pull Request → レビュー → マージ
- PR 前に `npm run typecheck && npm run lint && npm test` が通ることを確認（CI でも同じチェックが走る）
