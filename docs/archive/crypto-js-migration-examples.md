# crypto-js マイグレーション用サンプルコード

## 現在の実装サンプル（crypto-js 4.1.1）

### 暗号化の例

```typescript
// 現在のEncryptionService.encrypt()の実装
const CryptoJS = require("crypto-js");

// テストデータ
const data = "this will be encrypted.";
const password = "password";

// 1. ソルト生成（32バイト）
const salt = CryptoJS.lib.WordArray.random(32);
console.log("Salt (hex):", salt.toString(CryptoJS.enc.Hex));
// 例: "42c8615bc6b2bc88cd239f08a5a17cc62bb0ebaece53f3e458a1cd67cd0888bc"

// 2. PBKDF2で鍵導出（256ビット = 8ワード）
const key = CryptoJS.PBKDF2(password, salt, {
  keySize: 8,
  iterations: 2000,
});
console.log("Key:", key.toString());

// 3. IV生成（16バイト）
const iv = CryptoJS.lib.WordArray.random(16);
console.log("IV (hex):", iv.toString(CryptoJS.enc.Hex));
// 例: "1234567890abcdef1234567890abcdef"

// 4. AES-CBCで暗号化
const encrypted = CryptoJS.AES.encrypt(data, key, {
  iv: iv,
  padding: CryptoJS.pad.Pkcs7,
  mode: CryptoJS.mode.CBC,
});

// 5. 最終的な暗号文（IV + 暗号化データ）
const ciphertext = iv.toString() + encrypted.toString();
const used_salt = CryptoJS.enc.Hex.stringify(salt);

console.log("Final ciphertext:", ciphertext);
console.log("Final salt:", used_salt);
```

### 復号化の例

```typescript
// 現在のEncryptionService.decrypt()の実装
const CryptoJS = require("crypto-js");

// 暗号化されたペイロード
const payload = {
  ciphertext: "1234567890abcdef1234567890abcdefU2FsdGVkX1+...",  // IV(32文字) + 暗号文
  salt: "42c8615bc6b2bc88cd239f08a5a17cc62bb0ebaece53f3e458a1cd67cd0888bc"
};
const password = "password";

// 1. ソルトを16進数文字列からWordArrayに変換
const salt = CryptoJS.enc.Hex.parse(payload.salt);

// 2. IVと暗号文を分離
const iv = CryptoJS.enc.Hex.parse(payload.ciphertext.substr(0, 32));
const cipher = payload.ciphertext.substr(32);

// 3. PBKDF2で鍵を再生成
const key = CryptoJS.PBKDF2(password, salt, {
  keySize: 8,
  iterations: 2000,
});

// 4. AES-CBCで復号化
const decrypted = CryptoJS.AES.decrypt(cipher, key, {
  iv: iv,
  padding: CryptoJS.pad.Pkcs7,
  mode: CryptoJS.mode.CBC,
});

// 5. UTF-8文字列に変換
const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
console.log("Decrypted:", decryptedText);
```

## 互換性テスト用のテストベクター

### テストケース1: 基本的な暗号化/復号化

```typescript
// 固定値でのテスト（ランダム値を使わない）
const testVector1 = {
  input: {
    data: "Hello, Symbol QR Library!",
    password: "test-password-123",
    // 実際のテストではこれらの値を固定して使用
    salt: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    iv: "fedcba9876543210fedcba9876543210"
  },
  expected: {
    // この値は実際のcrypto-jsで生成した結果を記録
    ciphertext: "fedcba9876543210fedcba9876543210...",  // 実際の値に置き換え
    salt: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
  }
};
```

### テストケース2: 実際のQRコードデータ

```typescript
// AccountQRの例（examples/ExampleExportAccountQR.tsより）
const accountQRTestVector = {
  input: {
    privateKey: "749F1FF1972CD465CAB74566FF0AA021F846FBE3916ABB6A6C1373E962C76331",
    password: "password"
  },
  expected: {
    // 実際のcrypto-jsで生成された暗号化データ
    ciphertext: "56d310848ee93d0794eb1f64a5195778ded2q7IxvtPbO+sA7jZZyhpu/khbaNdx1pzuoGoPJRw1A4aBsWPlex3y/gy5da8WjF0i4d+/D0B5ESy+zX5P+AoFAw3EFi3UVBdnav4rnqg=",
    salt: "42c8615bc6b2bc88cd239f08a5a17cc62bb0ebaece53f3e458a1cd67cd0888bc"
  }
};

// MnemonicQRの例（examples/ExampleExportMnemonicQR.tsより）
const mnemonicQRTestVector = {
  input: {
    mnemonic: "stumble shoot spawn bitter forest waste attitude chest square kite dawn photo twice message bargain trap spin vote lamp wire also either else pupil",
    password: "password"
  },
  expected: {
    ciphertext: "964322228f401a2ec576ac256cbbdce29YfW+CykqESzGSzDYuKJxJUSpQ4woqMdD8Up7mjbow09I/UYV4e8HEgbhjlLjf30YLlQ+JKLBTf9kUGMnp3tZqYSq3lLZRDp8TVE6GzHiX4V59RTP7BOixwpDWDmfOP0B0i+Q1s0+OPfmyck4p7YZkVNi/HYvQF4kDV27sjRTZKs+uETKA0Ae0rl17d9EMV3eLUVcWEGE/ChgEfmnMlN1g==",
    salt: "b248953e9ebfa269cd7b940f9c03d2d4b192f90db61638375b5e78296bbe675a"
  }
};
```

## マイグレーション後の互換性テスト例

```typescript
import { expect } from 'chai';
// 古いcrypto-js実装（devDependenciesとして保持）
const CryptoJSOld = require('crypto-js');
// 新しい実装（例：Web Crypto APIベース）
import { NewEncryptionService } from './NewEncryptionService';

describe('暗号化の下位互換性テスト', () => {
  
  it('crypto-jsで暗号化したデータを新実装で復号化できること', () => {
    const data = 'test data';
    const password = 'test password';
    
    // 古い実装で暗号化
    const encryptedOld = encryptWithCryptoJS(data, password);
    
    // 新しい実装で復号化
    const decryptedNew = NewEncryptionService.decrypt(encryptedOld, password);
    
    expect(decryptedNew).to.equal(data);
  });
  
  it('新実装で暗号化したデータをcrypto-jsで復号化できること', () => {
    const data = 'test data';
    const password = 'test password';
    
    // 新しい実装で暗号化
    const encryptedNew = NewEncryptionService.encrypt(data, password);
    
    // 古い実装で復号化
    const decryptedOld = decryptWithCryptoJS(encryptedNew, password);
    
    expect(decryptedOld).to.equal(data);
  });
  
  it('既存のQRコードデータを新実装で読み込めること', () => {
    // 実際の本番データのスナップショット
    const existingQRData = {
      v: 3,
      type: 2, // ExportAccount
      network_id: 152,
      chain_id: '9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7',
      data: {
        ciphertext: '56d310848ee93d0794eb1f64a5195778ded2q7IxvtPbO+sA7jZZyhpu/khbaNdx1pzuoGoPJRw1A4aBsWPlex3y/gy5da8WjF0i4d+/D0B5ESy+zX5P+AoFAw3EFi3UVBdnav4rnqg=',
        salt: '42c8615bc6b2bc88cd239f08a5a17cc62bb0ebaece53f3e458a1cd67cd0888bc'
      }
    };
    
    // 新しい実装でQRコードを読み込み
    const accountQR = NewAccountQR.fromJSON(JSON.stringify(existingQRData), 'password');
    
    // 期待される秘密鍵
    const expectedPrivateKey = '749F1FF1972CD465CAB74566FF0AA021F846FBE3916ABB6A6C1373E962C76331';
    
    expect(accountQR.accountPrivateKey).to.equal(expectedPrivateKey);
  });
});
```

## 注意事項

1. **WordArrayの扱い**
   - crypto-jsのWordArrayは独自の形式
   - 新実装では標準的なArrayBufferやUint8Arrayへの変換が必要

2. **Base64エンコーディング**
   - crypto-jsの`encrypted.toString()`は自動的にBase64エンコード
   - 新実装でも同じ形式を維持する必要がある

3. **文字列連結**
   - IVとciphertextの連結方法を正確に再現
   - `iv.toString() + encrypted.toString()`の形式を維持

4. **エラーハンドリング**
   - 空の復号化結果の検出ロジックを維持
   - 不正なパスワードでの適切なエラー処理 
