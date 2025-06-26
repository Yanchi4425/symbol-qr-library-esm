#!/usr/bin/env tsx

/**
 * 簡易テストファイル - symbol-qr-library-esm の動作確認
 * 実行方法: npx tsx test.ts
 */

import { QRCodeGenerator, QRCodeType } from "./index.js";

async function testBasicFunctionality() {
  console.log("🚀 symbol-qr-library-esm テスト開始");
  console.log("===============================");

  try {
    // 1. オブジェクトQRのテスト
    console.log("\n📦 1. オブジェクトQRのテスト");
    const testObject = {
      message: "Hello Symbol!",
      timestamp: new Date().toISOString(),
    };
    const networkType = 152; // テストネット
    const generationHash =
      "ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4";

    const objectQR = QRCodeGenerator.createExportObject(
      testObject,
      networkType,
      generationHash
    );

    console.log("✅ QRコード作成成功");
    console.log("📋 タイプ:", objectQR.type);
    console.log("🌐 ネットワーク:", objectQR.networkType);
    console.log(
      "🔗 Generation Hash:",
      objectQR.generationHash.substring(0, 16) + "..."
    );

    // 2. 新しいAPIのテスト
    console.log("\n🔧 2. 新しいAPIのテスト");

    // JSON生成
    const jsonData = objectQR.toJSON();
    console.log("📄 JSON生成成功 (長さ:", jsonData.length, "文字)");

    // 構造化データ生成
    const qrData = objectQR.toQRData();
    console.log("📊 構造化データ:", {
      version: qrData.v,
      type: qrData.type,
      networkId: qrData.network_id,
    });

    // 表示テキスト
    const displayText = objectQR.getDisplayText();
    console.log("📝 表示テキスト:", displayText);

    // バリデーション
    const isValid = objectQR.validate();
    console.log("✔️  バリデーション:", isValid ? "成功" : "失敗");

    // 3. アカウントQRのテスト（暗号化なし）
    console.log("\n🔑 3. アカウントQRのテスト");
    const testPrivateKey =
      "F97AE23C2A28ECEDE6F8D6C447C0A10B55C92DDE9316CCD36C3177B073906978";

    const accountQR = QRCodeGenerator.createExportAccount(
      testPrivateKey,
      networkType,
      generationHash
    );
    console.log("✅ アカウントQR作成成功");
    console.log("📝 表示テキスト:", accountQR.getDisplayText());
    console.log("🔒 暗号化:", accountQR.encrypted ? "あり" : "なし");

    // 4. 連絡先QRのテスト
    console.log("\n👤 4. 連絡先QRのテスト");
    const testPublicKey =
      "9A49366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456B24";

    const contactQR = QRCodeGenerator.createAddContact(
      "テストユーザー",
      testPublicKey,
      networkType,
      generationHash
    );
    console.log("✅ 連絡先QR作成成功");
    console.log("📝 表示テキスト:", contactQR.getDisplayText());

    // 5. 外部ライブラリでのQRコード生成例
    console.log("\n🖼️  5. 外部ライブラリ連携の例");
    console.log("以下のコードで実際のQRコード画像を生成できます:");
    console.log("```typescript");
    console.log('import QRCode from "qrcode";');
    console.log("const qrData = objectQR.toQRData();");
    console.log(
      "const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));"
    );
    console.log("```");

    console.log("\n🎉 全てのテストが成功しました！");
    console.log("✨ arm Macでもネイティブモジュールなしで動作しています");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    console.error("スタックトレース:", error.stack);
    process.exit(1);
  }
}

// TypeScript設定の確認
console.log("🔧 環境情報:");
console.log("Node.js版:", process.version);
console.log("プラットフォーム:", process.platform, process.arch);

// メイン実行
testBasicFunctionality();
