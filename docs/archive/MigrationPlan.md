# symbo-qr-library マイグレーションプラン

このレポジトリはsymbol-qr-libraryを私がforkしたものです。
なぜならnode v12のような古いバージョンのままメンテされてないから。

## 方針

### 責務のリニューアル

#### 現行
node-canvasなどでQRコード自体を生成して返そうとしているためネイティブモジュールを使用している。
そのため今の古いバージョンのままだとarm macではnpm ciすら出来ない。

#### マイグレーション後
画像生成機能は消す。
必要なデータを与えたらQRにする前のjsonデータを返して、呼び出し元(webやreact-nativeを想定)でQRコードを生成する。

## マイグレーションアプローチ

### ステップ1: 依存関係の整理とESMセットアップ
1. **不要な依存関係を削除**
   - `canvas` (node-canvasによる画像生成機能)
   - `qrcode` (QRコード画像生成ライブラリ)
   - `open` (ファイルオープン機能)
   - その他ネイティブモジュール関連

2. **ESMへの変換**
   - `package.json`を更新してESMを有効化 (`"type": "module"`)
   - TypeScript設定をESM用に調整
   - ビルド設定をESM出力に変更

3. **modern dependencies**
   - Node.js最新LTS対応
   - TypeScript最新版対応
   - 開発ツールのアップデート

### ステップ2: コア機能の抽出と分離
1. **画像生成機能の削除**
   - `QRCode.ts`から`toBase64()`, `toCanvas()`, `toString()`メソッドを削除
   - `QRCodeSettings.ts`から画像関連設定を削除
   - キャンバス関連のimportを削除

2. **データ生成機能の保持・改良**
   - `toJSON()`メソッドの保持と改良
   - JSONスキーマ生成機能の強化
   - データバリデーション機能の追加

3. **新しいインターフェースの設計**
   ```typescript
   interface QRCodeDataGenerator {
     generateQRData(): QRCodeData;
     getSchemaVersion(): number;
     validate(): boolean;
   }
   
   interface QRCodeData {
     type: QRCodeType;
     networkType: INetworkType;
     generationHash: string;
     data: any;
     encrypted: boolean;
   }
   ```

### ステップ3: APIの再設計
1. **ファクトリーパターンの簡素化**
   - `QRCodeGenerator`をデータ生成専用に特化
   - 各QRコードクラスのシンプル化

2. **新しいエクスポートAPI**
   ```typescript
   // 旧API（削除予定）
   qr.toBase64() // 削除
   qr.toCanvas() // 削除
   
   // 新API
   qr.toQRData() // QRコード用JSONデータを返す
   qr.getDisplayText() // 人間が読めるテキスト表現
   ```

3. **型安全性の向上**
   - strict TypeScript設定
   - より厳密な型定義
   - ジェネリクスの活用

### ステップ4: テストとドキュメント
1. **テストスイートの更新**
   - 画像生成テストの削除
   - データ生成テストの強化
   - ESMテスト環境の構築

2. **使用例の更新**
   - 新しいAPIでの使用例作成
   - ブラウザ/React Native向けサンプル
   - QRコード画像生成の外部ライブラリ連携例

3. **マイグレーションガイド**
   - 旧APIから新APIへの移行手順
   - 破壊的変更の詳細説明
   - 代替手段の提案

### ステップ5: パッケージング
1. **ESMパッケージとして公開**
   - `package.json`の`"type": "module"`設定
   - `exports`フィールドの適切な設定
   - TypeScript型定義の配布

2. **後方互換性への配慮**
   - メジャーバージョンアップ
   - マイグレーションドキュメント
   - デプリケーション警告

### 想定される破壊的変更
- QRコード画像生成機能の完全削除
- `toBase64()`, `toCanvas()`, `toString()`メソッドの削除
- `canvas`, `qrcode`依存関係の削除
- ESM専用パッケージ化（CommonJS非対応）
- Node.js最小バージョンの引き上げ

### 新しい使用パターン例
```typescript
import { QRCodeGenerator } from 'symbol-qr-library-esm';
import QRCode from 'qrcode'; // 外部ライブラリ

// データ生成
const accountQR = QRCodeGenerator.createExportAccount(privateKey, networkType, generationHash);
const qrData = accountQR.toQRData();

// 外部ライブラリでQRコード画像生成
const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));
```

