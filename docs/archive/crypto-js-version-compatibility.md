# crypto-js バージョン互換性ガイド

## 概要

このドキュメントは、crypto-js 4.1.1（現在使用中）と4.2.0（最新版）の間の互換性問題について説明します。

## 主な破壊的変更

### 1. PBKDF2のデフォルト設定変更（4.2.0）

4.2.0のリリースノートより：
> Change default hash algorithm and iteration's for PBKDF2 to prevent weak security by using the default configuration.

#### 影響

- **デフォルトハッシュアルゴリズム**: 変更されました（具体的なアルゴリズムは要確認）
- **デフォルト反復回数**: セキュリティ強化のため増加した可能性があります
- **結果**: 同じパスワードとソルトでも、4.1.1と4.2.0では異なる鍵が生成される可能性があります

#### 対策

現在の実装では明示的にパラメータを指定しているため、理論的には影響を受けません：

```javascript
const key = CryptoJS.PBKDF2(password, salt, {
  keySize: 8,      // 明示的に指定
  iterations: 2000  // 明示的に指定
});
```

ただし、以下の点に注意が必要です：
- ハッシュアルゴリズムも明示的に指定することを推奨
- 将来のバージョンでも互換性を保つため、すべてのパラメータを明示的に指定

### 2. その他の変更（4.2.0）

- **カスタムKDFハッシャー**: 新機能として追加
- **Blowfishサポート**: 新しい暗号化アルゴリズムとして追加
- これらは新機能のため、既存コードには影響しません

## 互換性テスト戦略

### 1. 複数バージョンでのテスト

```json
{
  "devDependencies": {
    "crypto-js-4.1.1": "npm:crypto-js@4.1.1",
    "crypto-js-4.2.0": "npm:crypto-js@4.2.0"
  }
}
```

### 2. 互換性テストコード

```typescript
import * as CryptoJS411 from 'crypto-js-4.1.1';
import * as CryptoJS420 from 'crypto-js-4.2.0';

describe('crypto-js バージョン互換性テスト', () => {
  const testData = {
    data: 'test data',
    password: 'test password',
    salt: CryptoJS411.enc.Hex.parse('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
    iv: CryptoJS411.enc.Hex.parse('fedcba9876543210fedcba9876543210')
  };

  it('4.1.1で暗号化したデータを4.2.0で復号化できること', () => {
    // 4.1.1で暗号化
    const key411 = CryptoJS411.PBKDF2(testData.password, testData.salt, {
      keySize: 8,
      iterations: 2000
    });
    
    const encrypted411 = CryptoJS411.AES.encrypt(testData.data, key411, {
      iv: testData.iv,
      padding: CryptoJS411.pad.Pkcs7,
      mode: CryptoJS411.mode.CBC
    });

    // 4.2.0で復号化
    const key420 = CryptoJS420.PBKDF2(testData.password, testData.salt, {
      keySize: 8,
      iterations: 2000
    });
    
    const decrypted420 = CryptoJS420.AES.decrypt(encrypted411.toString(), key420, {
      iv: testData.iv,
      padding: CryptoJS420.pad.Pkcs7,
      mode: CryptoJS420.mode.CBC
    });

    expect(decrypted420.toString(CryptoJS420.enc.Utf8)).toBe(testData.data);
  });

  it('PBKDF2の出力が両バージョンで一致すること', () => {
    const key411 = CryptoJS411.PBKDF2(testData.password, testData.salt, {
      keySize: 8,
      iterations: 2000
    });
    
    const key420 = CryptoJS420.PBKDF2(testData.password, testData.salt, {
      keySize: 8,
      iterations: 2000
    });

    expect(key411.toString()).toBe(key420.toString());
  });
});
```

## 推奨事項

### 1. 明示的なパラメータ指定

PBKDF2使用時は、すべてのパラメータを明示的に指定：

```javascript
const key = CryptoJS.PBKDF2(password, salt, {
  keySize: 8,
  iterations: 2000,
  hasher: CryptoJS.algo.SHA256  // ハッシャーも明示的に指定（推奨）
});
```

### 2. マイグレーション時の注意点

- 新しい暗号化実装では、crypto-js 4.1.1と同じパラメータを使用
- 既存の暗号化データとの互換性を最優先
- パフォーマンステストで両バージョンの速度差を確認

### 3. 長期的な戦略

- crypto-jsは開発が終了しているため（メンテナンスモード）、ネイティブCrypto APIへの移行を推奨
- 移行時は4.1.1の動作を正確に再現することが重要
- 将来的にはより安全なパラメータ（より多い反復回数など）への移行も検討

## テストデータの保存

互換性テスト用に、4.1.1で生成した暗号化データを保存：

```javascript
// test/fixtures/crypto-js-4.1.1-test-vectors.json
{
  "version": "4.1.1",
  "testVectors": [
    {
      "description": "基本的な暗号化テスト",
      "input": {
        "data": "Hello, Symbol QR Library!",
        "password": "test-password-123"
      },
      "fixedValues": {
        "salt": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "iv": "fedcba9876543210fedcba9876543210"
      },
      "output": {
        "ciphertext": "実際の暗号化結果をここに記録",
        "key": "PBKDF2で生成された鍵をここに記録"
      }
    }
  ]
}
```

このテストベクターを使用して、新しい実装の互換性を継続的に検証します。 
