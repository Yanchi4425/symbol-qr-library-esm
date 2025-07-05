# @noble/ciphers への移行可能性分析

## 結論：移行可能、推奨

@noble/ciphersは**crypto-js廃止の最良の選択肢**です。React Nativeを含む全環境で動作し、必要な機能を完全にサポートしています。

## 対応状況

### ✅ 完全対応
- **React Native**: 追加設定なしで動作（pure JavaScript）
- **Web (UMD/ESM)**: 完全対応
- **Node.js**: 完全対応
- **AES-CBC**: 完全対応
- **PBKDF2**: @noble/hashesで完全対応

### 🔍 現在の使用機能との対応

| 機能 | crypto-js | @noble/ciphers | @noble/hashes |
|------|-----------|----------------|---------------|
| AES-CBC | ✅ | ✅ | - |
| PBKDF2 | ✅ | - | ✅ |
| ランダムバイト | ✅ | ✅ | ✅ |
| 16進数変換 | ✅ | ✅ | ✅ |

## 移行コード例

### 現在のcrypto-js実装
```javascript
const CryptoJS = require("crypto-js");

// PBKDF2鍵導出
const key = CryptoJS.PBKDF2(password, salt, {
  keySize: 256/32,
  iterations: 2000
});

// AES-CBC暗号化
const encrypted = CryptoJS.AES.encrypt(data, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});
```

### @noble/ciphers + @noble/hashes実装
```javascript
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { randomBytes, bytesToHex, hexToBytes } from '@noble/ciphers/utils.js';

// PBKDF2鍵導出（crypto-jsと同じパラメータ）
const key = pbkdf2(sha256, password, salt, { 
  c: 2000, 
  dkLen: 32 
});

// AES-CBC暗号化
const cipher = cbc(key, iv);
const encrypted = cipher.encrypt(data);
```

## 環境別対応状況

### React Native
```javascript
// 追加設定不要、そのまま動作
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
```

### Web (UMD)
```html
<script src="https://unpkg.com/@noble/ciphers"></script>
<script src="https://unpkg.com/@noble/hashes"></script>
<script>
  const { cbc } = nobleCiphers;
  const { pbkdf2 } = nobleHashes;
</script>
```

### Web (ESM)
```javascript
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
```

### Node.js
```javascript
// CommonJS
const { cbc } = require('@noble/ciphers/aes.js');
const { pbkdf2 } = require('@noble/hashes/pbkdf2.js');

// ESM
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
```

## 他の選択肢との比較

### @noble/ciphers vs React Native専用ライブラリ

| 項目 | @noble/ciphers | react-native-aes-crypto |
|------|----------------|-------------------------|
| 環境対応 | 全環境 | React Nativeのみ |
| 監査状況 | 2024年監査済み | 未監査 |
| メンテナンス | 活発 | 限定的 |
| サイズ | 8KB gzipped | ネイティブモジュール |
| 設定複雑度 | 設定不要 | ネイティブリンク必要 |

### @noble/ciphers vs Web Crypto API

| 項目 | @noble/ciphers | Web Crypto API |
|------|----------------|----------------|
| React Native | ✅ | ❌ (polyfill必要) |
| 同期処理 | ✅ | ❌ (Promise必須) |
| PBKDF2カスタム | ✅ | 制限あり |
| 一貫性 | ✅ | 環境依存 |

## 移行のメリット

### 1. セキュリティ向上
- **2024年監査済み**: Cure53による独立監査
- **アクティブメンテナンス**: 定期的なセキュリティ更新
- **モダンな暗号実装**: 最新の暗号学的ベストプラクティス

### 2. 環境対応
- **React Native**: 追加設定なしで動作
- **全プラットフォーム**: iOS、Android、Web、Node.js
- **バンドルサイズ**: Tree-shakingで最小化

### 3. 開発体験
- **TypeScript**: 完全な型サポート
- **ESM/CJS**: 両方対応
- **ドキュメント**: 充実したドキュメント

### 4. パフォーマンス
- **最適化**: 手動最適化済み
- **軽量**: 必要な機能のみ
- **高速**: crypto-jsと同等以上

## 移行手順

### フェーズ1: 依存関係追加
```bash
npm install @noble/ciphers @noble/hashes
```

### フェーズ2: 互換性レイヤー作成
```javascript
// crypto-js-compat.js
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

export const CryptoJS = {
  PBKDF2: (password, salt, options) => {
    return pbkdf2(sha256, password, salt, {
      c: options.iterations,
      dkLen: options.keySize * 4
    });
  },
  AES: {
    encrypt: (data, key, options) => {
      const cipher = cbc(key, options.iv);
      return cipher.encrypt(data);
    },
    decrypt: (encrypted, key, options) => {
      const cipher = cbc(key, options.iv);
      return cipher.decrypt(encrypted);
    }
  }
};
```

### フェーズ3: 段階的移行
1. 互換性レイヤーでテスト
2. 新機能は@noble/ciphers直接使用
3. 既存コードを順次移行

## 推奨事項

1. **@noble/ciphers + @noble/hashes** を採用
2. **段階的移行** で安全性確保
3. **互換性テスト** を徹底実施
4. **TypeScript** での型安全性活用

## 長期的な利点

- **将来性**: アクティブな開発とメンテナンス
- **標準準拠**: 最新の暗号化標準に準拠
- **コミュニティ**: 大規模な採用実績
- **エコシステム**: noble cryptographyファミリーとの統合

## 結論

@noble/ciphersは、crypto-js廃止に向けた**最適な選択肢**です。React Nativeを含む全環境での動作、充実したセキュリティ監査、優れた開発体験を提供します。段階的移行により、既存システムへの影響を最小限に抑えながら、モダンで安全な暗号化ライブラリに移行できます。 
