# ドキュメント

## 📋 概要
このフォルダには、crypto-js移行に関するドキュメントが含まれています。

## 📁 構成

### メインドキュメント
- **`crypto-js-migration-guide.md`** - 移行ガイド統合版 (AI Assistant向け)
  - 現在の使用状況、移行コード、互換性問題、推奨事項を簡潔にまとめ

### アーカイブ
- **`archive/`** - 詳細な分析資料
  - `crypto-js-usage.md` - 現在の使用状況詳細
  - `crypto-js-migration-examples.md` - 移行コード例とテストベクター
  - `crypto-js-migration-plan.md` - 5フェーズ移行計画
  - `crypto-js-migration-utilities.md` - データ移行ユーティリティ設計
  - `crypto-js-version-compatibility.md` - バージョン互換性分析
  - `noble-ciphers-migration-analysis.md` - @noble/ciphers移行分析
  - `MigrationPlan.md` - 初期移行計画

## 🎯 推奨事項
**@noble/ciphers + @noble/hashes**への移行を推奨
- React Native完全対応
- セキュリティ監査済み
- 全環境対応 (Web/Node.js/React Native)
- 軽量 (8KB gzipped)

## 🔧 移行手順
1. 依存関係追加: `npm install @noble/ciphers @noble/hashes`
2. 互換性レイヤー作成
3. 既存QRコードとの互換性テスト
4. 段階的移行実施
5. crypto-js削除 
