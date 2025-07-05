# crypto-js使用状況ドキュメント

## 概要

このドキュメントは、symbol-qr-libraryにおけるcrypto-jsライブラリの使用状況をまとめたものです。
ライブラリの最新化に伴い、暗号化/復号化の下位互換性を保つために作成されました。

## 現在のバージョン

- **crypto-js**: 4.1.1 （package.jsonで指定）
- 依存関係: symbol-hd-wallets (0.14.2) も crypto-js を使用

### 重要: バージョン間の違い

**crypto-js 4.1.1 → 4.2.0 の破壊的変更:**
- **PBKDF2のデフォルト設定変更**: 4.2.0では、セキュリティ強化のためPBKDF2のデフォルトハッシュアルゴリズムと反復回数が変更されました
- この変更により、同じパスワードとソルトでも異なる鍵が生成される可能性があります
- 既存の暗号化データとの互換性を保つためには、明示的にパラメータを指定する必要があります

## crypto-jsの使用箇所

### 1. EncryptionService (`src/services/EncryptionService.ts`)

EncryptionServiceは、crypto-jsを直接使用する唯一のサービスクラスです。

#### インポート方法
```javascript
const CryptoJS = require("crypto-js");
```

#### 使用している機能

1. **ランダムデータ生成**
   - `CryptoJS.lib.WordArray.random(32)` - 32バイトのソルト生成
   - `CryptoJS.lib.WordArray.random(16)` - 16バイトのIV（初期化ベクトル）生成

2. **PBKDF2 (Password-Based Key Derivation Function)**
   ```javascript
   const key = CryptoJS.PBKDF2(password, salt, {
     keySize: 8,      // 8ワード = 256ビット
     iterations: 2000  // 反復回数
   });
   ```
   **注意**: crypto-js 4.1.1では上記の設定で動作しますが、4.2.0以降ではデフォルトが変更されているため、明示的な指定が必要です

3. **AES暗号化**
   ```javascript
   const encrypted = CryptoJS.AES.encrypt(data, key, {
     iv: iv,
     padding: CryptoJS.pad.Pkcs7,
     mode: CryptoJS.mode.CBC
   });
   ```

4. **AES復号化**
   ```javascript
   const decrypted = CryptoJS.AES.decrypt(cipher, key, {
     iv: iv,
     padding: CryptoJS.pad.Pkcs7,
     mode: CryptoJS.mode.CBC
   });
   ```

5. **エンコーディング**
   - `CryptoJS.enc.Hex.stringify(salt)` - ソルトを16進数文字列に変換
   - `CryptoJS.enc.Hex.parse(payload.salt)` - 16進数文字列をWordArrayに変換
   - `decrypted.toString(CryptoJS.enc.Utf8)` - 復号化されたデータをUTF-8文字列に変換

## 暗号化の仕様

### 暗号化プロセス

1. **ソルト生成**: 32バイトのランダムソルト
2. **鍵導出**: PBKDF2で256ビット（8ワード）の鍵を生成（2000回反復）
3. **IV生成**: 16バイトのランダムIV
4. **暗号化**: AES-CBC モードで暗号化（PKCS7パディング）
5. **出力形式**: 
   - ciphertext: IV（16進数32文字） + 暗号文
   - salt: 16進数64文字

### 復号化プロセス

1. **ソルト読み込み**: 16進数文字列からWordArrayに変換
2. **IV抽出**: ciphertextの最初の32文字（16バイト）
3. **暗号文抽出**: ciphertextの33文字目以降
4. **鍵再生成**: PBKDF2で同じパラメータを使用して鍵を再生成
5. **復号化**: AES-CBC モードで復号化

## 使用されているクラス

### EncryptedPayload (`src/EncryptedPayload.ts`)

暗号化されたデータを格納するデータクラス：
- `ciphertext`: 暗号文（IVを含む）
- `salt`: ソルト

### 暗号化を使用するQRコードクラス

1. **AccountQR** (`src/AccountQR.ts`, `src/schemas/ExportAccountDataSchema.ts`)
   - アカウントの秘密鍵を暗号化してQRコードに格納

2. **MnemonicQR** (`src/MnemonicQR.ts`, `src/schemas/ExportMnemonicDataSchema.ts`)
   - ニーモニックフレーズを暗号化してQRコードに格納

## テストケース

### EncryptionServiceのテスト (`test/services/EncryptionService.spec.ts`)

1. **暗号化テスト**
   - 暗号化ペイロードにciphertextとsaltが含まれることを確認
   - ciphertextの長さが76文字、saltの長さが64文字であることを確認
   - 同じデータとパスワードでも毎回異なる暗号文が生成されることを確認

2. **復号化テスト**
   - 暗号化したデータが正しく復号化されることを確認

## 互換性テストのポイント

マイグレーション後の互換性テストでは、以下の点を確認する必要があります：

1. **暗号化の互換性**
   - 現在のcrypto-js (4.2.0) で暗号化したデータを新しい実装で復号化できること
   - 新しい実装で暗号化したデータを現在のcrypto-jsで復号化できること

2. **パラメータの一致**
   - PBKDF2: keySize=8, iterations=2000
   - AES: CBC モード、PKCS7パディング
   - ソルト: 32バイト
   - IV: 16バイト

3. **データ形式の一致**
   - ciphertext: IV（16進数） + 暗号文
   - salt: 16進数文字列（64文字）

4. **エラーハンドリング**
   - 間違ったパスワードでの復号化時のエラー
   - 空の復号化テキストの検出

## 推奨事項

1. **devDependenciesへの移行**
   - マイグレーション後は、crypto-jsを`devDependencies`に移動
   - 互換性テスト専用として使用

2. **テストの追加**
   - 現在のcrypto-jsで生成した暗号化データのスナップショットを保存
   - 新しい実装でこれらのスナップショットを復号化できることを確認
   - 逆方向の互換性テストも実施

3. **ドキュメント化**
   - 暗号化仕様の詳細なドキュメントを維持
   - マイグレーションガイドの作成 
