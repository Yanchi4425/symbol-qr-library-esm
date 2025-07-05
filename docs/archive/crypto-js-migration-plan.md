# crypto-js マイグレーション計画

## 概要

このドキュメントは、symbol-qr-libraryにおけるcrypto-js依存を最新の暗号化ライブラリに移行するための計画書です。

## 現状分析

### 依存関係
- **直接依存**: crypto-js@4.1.1 （package.jsonで指定）
- **間接依存**: symbol-hd-wallets@0.14.2 も crypto-js を使用

### バージョン互換性の考慮事項
- 現在使用中の4.1.1と最新版4.2.0の間には破壊的変更があります
- 特にPBKDF2のデフォルト設定が変更されており、互換性維持には注意が必要です

### 使用箇所
- **EncryptionService** (`src/services/EncryptionService.ts`)
  - 唯一のcrypto-js直接使用箇所
  - AES-CBC暗号化/復号化
  - PBKDF2鍵導出
  - ランダムデータ生成

## マイグレーション戦略

### フェーズ1: 準備（推奨期間: 1週間）

1. **互換性テストスイートの作成**
   - 既存の暗号化データのスナップショット作成
   - 双方向互換性テストの実装
   - パフォーマンステストの追加

2. **新しい暗号化実装の選定**
   - 候補:
     - Web Crypto API (ブラウザ/Node.js標準)
     - node:crypto (Node.js専用)
     - @noble/ciphers (軽量・高速)
   - 評価基準:
     - ブラウザ/Node.js両対応
     - AES-CBC/PBKDF2サポート
     - パフォーマンス
     - バンドルサイズ

### フェーズ2: 実装（推奨期間: 2週間）

1. **新しいEncryptionServiceの実装**
   ```typescript
   // src/services/ModernEncryptionService.ts
   export class ModernEncryptionService {
     static async encrypt(data: string, password: string): Promise<EncryptedPayload> {
       // Web Crypto APIを使用した実装
     }
     
     static async decrypt(payload: EncryptedPayload, password: string): Promise<string> {
       // Web Crypto APIを使用した実装
     }
   }
   ```

2. **レガシー実装の保持**
   ```typescript
   // src/services/LegacyEncryptionService.ts
   export class LegacyEncryptionService {
     static encrypt(data: string, password: string): EncryptedPayload {
       // crypto-js 4.1.1を使用した既存実装
     }
     
     static decrypt(payload: EncryptedPayload, password: string): string {
       // crypto-js 4.1.1を使用した既存実装
     }
   }
   ```

3. **データ移行ユーティリティの実装**
   ```typescript
   // src/services/EncryptionMigrationService.ts
   export class EncryptionMigrationService {
     static dangerousLegacyDecryptAndReencrypt(
       legacyPayload: EncryptedPayload,
       password: string
     ): EncryptedPayload {
       // 既存データの安全な移行
     }
   }
   ```

4. **互換性レイヤーの実装**
   ```typescript
   // src/services/EncryptionService.ts
   export class EncryptionService {
     static encrypt(data: string, password: string): EncryptedPayload {
       // 同期APIを維持するためのラッパー
       return syncWrapper(() => ModernEncryptionService.encrypt(data, password));
     }
   }
   ```

### フェーズ3: テストと検証（推奨期間: 1週間）

1. **単体テスト**
   - 既存のテストがすべてパスすることを確認
   - 新旧実装の互換性テスト

2. **統合テスト**
   - QRコード生成/読み取りの動作確認
   - 実際のアプリケーションでの動作確認

3. **パフォーマンステスト**
   - 暗号化/復号化速度の比較
   - メモリ使用量の比較

### フェーズ4: 段階的移行（推奨期間: 2週間）

1. **Feature Flagの実装**
   ```typescript
   const USE_MODERN_CRYPTO = process.env.USE_MODERN_CRYPTO === 'true';
   
   export const EncryptionService = USE_MODERN_CRYPTO 
     ? ModernEncryptionService 
     : LegacyEncryptionService;
   ```

2. **データ移行ツールの提供**
   ```typescript
   // 既存ユーザー向けの移行ツール
   import { EncryptionMigrationService } from './services/EncryptionMigrationService';
   
   // 個別移行
   const migratedData = EncryptionMigrationService.dangerousMigrateQRCodeData(
     existingQRData, 
     password
   );
   
   // バッチ移行
   const results = await BatchMigrationService.dangerousBatchMigrateQRCodes(
     qrDataList, 
     passwordMap
   );
   ```

3. **段階的ロールアウト**
   - 開発環境での検証
   - 移行ツールの提供とドキュメント化
   - ステージング環境での検証
   - 本番環境への段階的適用

### フェーズ5: 完全移行（推奨期間: 1週間）

1. **crypto-jsの移動**
   - dependenciesからdevDependenciesへ移動
   - 互換性テスト専用として保持

2. **ドキュメント更新**
   - README.mdの更新
   - CHANGELOG.mdへの記載
   - マイグレーションガイドの公開

## リスクと対策

### リスク1: 既存データの互換性問題
- **対策**: 
  - 徹底的な互換性テスト
  - データ移行ツールの提供
  - 旧バージョンのサポート期間設定

### リスク2: パフォーマンス劣化
- **対策**:
  - ベンチマークテストの実施
  - 必要に応じて最適化
  - WebAssembly版の検討

### リスク3: ブラウザ互換性
- **対策**:
  - Polyfillの提供
  - 対象ブラウザの明確化
  - フォールバック実装

## 成功指標

1. **機能面**
   - すべての既存テストがパス
   - 既存のQRコードが読み取り可能
   - 新旧実装の相互運用性

2. **性能面**
   - 暗号化/復号化速度が同等以上
   - バンドルサイズの削減（目標: 20%以上）

3. **品質面**
   - セキュリティ監査の実施
   - ゼロダウンタイムでの移行

## タイムライン

```
Week 1-2:   準備フェーズ
Week 3-4:   実装フェーズ
Week 5:     テストと検証
Week 6-7:   段階的移行
Week 8:     完全移行と文書化
```

## チェックリスト

- [ ] 互換性テストスイートの作成
- [ ] 新暗号化ライブラリの選定
- [ ] ModernEncryptionServiceの実装
- [ ] LegacyEncryptionServiceの実装（crypto-js 4.1.1）
- [ ] EncryptionMigrationServiceの実装
- [ ] BatchMigrationServiceの実装
- [ ] 移行ユーティリティのテスト作成
- [ ] 互換性レイヤーの実装
- [ ] 単体テストの実行と確認
- [ ] 統合テストの実行と確認
- [ ] 移行テストの実行と確認
- [ ] パフォーマンステストの実施
- [ ] Feature Flagの実装
- [ ] データ移行ツールの提供
- [ ] 移行ガイドの作成
- [ ] 段階的ロールアウト
- [ ] crypto-jsのdevDependenciesへの移動
- [ ] 移行ユーティリティの廃止計画
- [ ] ドキュメントの更新
- [ ] リリースノートの作成 
