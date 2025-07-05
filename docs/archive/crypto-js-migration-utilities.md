# crypto-js データ移行ユーティリティ

## 概要

既存ユーザーのcrypto-js 4.1.1で暗号化されたデータを、新しい暗号化実装で復号化し、より安全な設定で再暗号化するためのユーティリティメソッドです。

## 設計方針

### 1. 明確な命名規則

- `@deprecated` または `@dangerous` プレフィックス
- 用途と注意点を明確に示すメソッド名
- 十分な警告とドキュメント

### 2. 段階的移行サポート

- バッチ処理での移行
- 個別データの移行
- 移行状況の追跡

## 提案するAPI設計

### EncryptionMigrationService

```typescript
/**
 * 暗号化データの移行用ユーティリティクラス
 * 
 * @deprecated このクラスは既存データの移行専用です。
 * 新規データの暗号化には ModernEncryptionService を使用してください。
 */
export class EncryptionMigrationService {

  /**
   * crypto-js 4.1.1で暗号化されたデータを復号化し、
   * 新しい実装で再暗号化します。
   * 
   * @deprecated この方法は既存データの移行専用です。
   * 新規データには直接 ModernEncryptionService.encrypt() を使用してください。
   * 
   * @param legacyPayload - crypto-js 4.1.1で暗号化されたペイロード
   * @param password - 復号化用パスワード
   * @returns 新しい実装で暗号化されたペイロード
   */
  public static dangerousLegacyDecryptAndReencrypt(
    legacyPayload: EncryptedPayload,
    password: string
  ): EncryptedPayload {
    // 1. 古い実装で復号化
    const plaintext = LegacyEncryptionService.decrypt(legacyPayload, password);
    
    // 2. 新しい実装で暗号化
    return ModernEncryptionService.encrypt(plaintext, password);
  }

  /**
   * QRコードデータの一括移行
   * 
   * @deprecated この方法は既存データの移行専用です。
   * 
   * @param qrData - 既存のQRコードJSONデータ
   * @param password - 復号化用パスワード
   * @returns 新しい暗号化で更新されたQRコードデータ
   */
  public static dangerousMigrateQRCodeData(
    qrData: any,
    password: string
  ): any {
    if (!EncryptedPayload.isDataEncrypted(qrData.data)) {
      // 暗号化されていないデータはそのまま返す
      return qrData;
    }

    const legacyPayload = EncryptedPayload.fromJSON(JSON.stringify(qrData.data));
    const newPayload = this.dangerousLegacyDecryptAndReencrypt(legacyPayload, password);
    
    return {
      ...qrData,
      data: {
        ciphertext: newPayload.ciphertext,
        salt: newPayload.salt
      },
      // 移行済みであることを示すメタデータ
      migrated: true,
      migrationDate: new Date().toISOString(),
      originalVersion: '4.1.1'
    };
  }

  /**
   * 移行の安全性チェック
   * 
   * @param originalData - 元のデータ
   * @param migratedData - 移行後のデータ  
   * @param password - パスワード
   * @returns 移行が成功したかどうか
   */
  public static validateMigration(
    originalData: any,
    migratedData: any,
    password: string
  ): boolean {
    try {
      // 元のデータを復号化
      const originalPayload = EncryptedPayload.fromJSON(JSON.stringify(originalData.data));
      const originalPlaintext = LegacyEncryptionService.decrypt(originalPayload, password);
      
      // 移行後のデータを復号化
      const migratedPayload = EncryptedPayload.fromJSON(JSON.stringify(migratedData.data));
      const migratedPlaintext = ModernEncryptionService.decrypt(migratedPayload, password);
      
      // 平文が一致するかチェック
      return originalPlaintext === migratedPlaintext;
    } catch (error) {
      console.error('Migration validation failed:', error);
      return false;
    }
  }
}
```

### バッチ移行ユーティリティ

```typescript
/**
 * 大量データの移行用ユーティリティ
 * 
 * @deprecated このクラスは既存データの移行専用です。
 */
export class BatchMigrationService {

  /**
   * 複数のQRコードデータを一括移行
   * 
   * @param qrDataList - QRコードデータのリスト
   * @param passwordMap - データIDとパスワードのマップ
   * @param options - 移行オプション
   */
  public static async dangerousBatchMigrateQRCodes(
    qrDataList: Array<{id: string, data: any}>,
    passwordMap: Map<string, string>,
    options: {
      batchSize?: number;
      onProgress?: (progress: number) => void;
      onError?: (id: string, error: Error) => void;
    } = {}
  ): Promise<Array<{id: string, data: any, migrated: boolean}>> {
    
    const { batchSize = 10, onProgress, onError } = options;
    const results: Array<{id: string, data: any, migrated: boolean}> = [];
    
    for (let i = 0; i < qrDataList.length; i += batchSize) {
      const batch = qrDataList.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (item) => {
          const password = passwordMap.get(item.id);
          if (!password) {
            throw new Error(`Password not found for ${item.id}`);
          }
          
          const migratedData = EncryptionMigrationService.dangerousMigrateQRCodeData(
            item.data, 
            password
          );
          
          // 移行の検証
          const isValid = EncryptionMigrationService.validateMigration(
            item.data,
            migratedData,
            password
          );
          
          if (!isValid) {
            throw new Error(`Migration validation failed for ${item.id}`);
          }
          
          return { id: item.id, data: migratedData, migrated: true };
        })
      );
      
      batchResults.forEach((result, index) => {
        const item = batch[index];
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({ id: item.id, data: item.data, migrated: false });
          onError?.(item.id, result.reason);
        }
      });
      
      onProgress?.((i + batch.length) / qrDataList.length * 100);
    }
    
    return results;
  }
}
```

## 使用例

### 個別データの移行

```typescript
// 既存のAccountQRデータを移行
const existingAccountQR = {
  v: 3,
  type: 2,
  network_id: 152,
  chain_id: '9F1979BEBA29C47E59B40393ABB516801A353CFC0C18BC241FEDE41939C907E7',
  data: {
    ciphertext: '56d310848ee93d0794eb1f64a5195778ded2q7...',
    salt: '42c8615bc6b2bc88cd239f08a5a17cc62bb0ebaece53f3e458a1cd67cd0888bc'
  }
};

// 移行実行
const migratedAccountQR = EncryptionMigrationService.dangerousMigrateQRCodeData(
  existingAccountQR,
  'password'
);

// 移行検証
const isValid = EncryptionMigrationService.validateMigration(
  existingAccountQR,
  migratedAccountQR,
  'password'
);

console.log('Migration successful:', isValid);
console.log('Migrated data:', migratedAccountQR);
```

### バッチ移行

```typescript
const qrDataList = [
  { id: 'account1', data: existingAccountQR1 },
  { id: 'mnemonic1', data: existingMnemonicQR1 },
  // ... more data
];

const passwordMap = new Map([
  ['account1', 'password1'],
  ['mnemonic1', 'password2'],
  // ... more passwords
]);

const results = await BatchMigrationService.dangerousBatchMigrateQRCodes(
  qrDataList,
  passwordMap,
  {
    batchSize: 5,
    onProgress: (progress) => console.log(`Progress: ${progress}%`),
    onError: (id, error) => console.error(`Failed to migrate ${id}:`, error)
  }
);

console.log('Migration results:', results);
```

## 安全性の考慮事項

### 1. 明確な警告

- すべてのメソッドに `@deprecated` または `@dangerous` プレフィックス
- 詳細なJSDocコメントで用途と注意点を説明
- 新規データには使用しないよう明記

### 2. 検証機能

- 移行前後のデータが同じ平文になることを確認
- 移行失敗時の適切なエラーハンドリング
- バッチ処理での部分的失敗への対応

### 3. メタデータの追加

- 移行済みデータには `migrated: true` フラグ
- 移行日時と元のバージョン情報を記録
- 将来の監査や問題調査に活用

### 4. 段階的廃止

```typescript
/**
 * @deprecated v2.0.0で削除予定
 * @removal-version 2.0.0
 * @alternative ModernEncryptionService.encrypt()
 */
```

## 移行計画での位置づけ

1. **フェーズ1**: 移行ユーティリティの実装とテスト
2. **フェーズ2**: 既存ユーザー向けの移行ツール提供
3. **フェーズ3**: 段階的な移行実施
4. **フェーズ4**: 移行ユーティリティの廃止（メジャーバージョンアップ時）

このアプローチにより、既存ユーザーの利便性を保ちながら、安全に新しい暗号化実装への移行を進めることができます。 
