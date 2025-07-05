# crypto-js 移行ガイド (AI Assistant向け)

## 概要
- **現在**: crypto-js 4.1.1 (2018年, 4年放置)
- **移行先**: @noble/ciphers + @noble/hashes
- **理由**: React Native対応、セキュリティ監査済み、アクティブメンテナンス

## 現在の使用状況
```javascript
// src/services/EncryptionService.ts - 唯一の使用箇所
const CryptoJS = require("crypto-js");

// 使用機能
- PBKDF2(password, salt, {keySize: 256/32, iterations: 2000})
- AES.encrypt/decrypt(data, key, {iv: iv, mode: CBC, padding: Pkcs7})
- lib.WordArray.random(32) // ランダムバイト生成
- enc.Hex.stringify/parse // 16進数変換
```

## 移行コード
```javascript
// 新実装
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { randomBytes, bytesToHex, hexToBytes } from '@noble/ciphers/utils.js';

// PBKDF2: crypto-jsと同じパラメータ
const key = pbkdf2(sha256, password, salt, { c: 2000, dkLen: 32 });

// AES-CBC: 同じ暗号化仕様
const cipher = cbc(key, iv);
const encrypted = cipher.encrypt(data);
```

## 互換性問題
### crypto-js 4.1.1 → 4.2.0
- PBKDF2のデフォルト設定変更
- 既存QRコードが復号化不可になる可能性
- 解決策: 明示的パラメータ指定で回避

### データ移行ユーティリティ
```javascript
// 4.1.1で暗号化されたデータを4.2以降で復号化
class EncryptionMigrationService {
  static dangerousLegacyDecryptAndReencrypt(legacyData, password) {
    // 4.1.1形式で復号化 → 4.2以降で再暗号化
  }
}
```

## 環境対応
- **React Native**: 追加設定なし
- **Web (UMD/ESM)**: 完全対応
- **Node.js**: CommonJS/ESM両対応
- **バンドルサイズ**: 8KB (tree-shakeable)

## 移行手順
1. `npm install @noble/ciphers @noble/hashes`
2. 互換性レイヤー作成
3. 既存QRコードとの互換性テスト
4. 段階的移行実施
5. crypto-js削除

## 重要な注意点
- 既存ユーザーのQRコードとの互換性維持が最優先
- 暗号化パラメータの完全一致が必要
- テストベクターによる検証必須

## 推奨事項
@noble/ciphersは最適な選択肢。React Native対応、セキュリティ監査済み、全環境対応でcrypto-js廃止の理想的な代替案。 
