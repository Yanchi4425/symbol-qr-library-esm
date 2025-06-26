/**
 * (C) Symbol Contributors 2022
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// internal dependencies
import {
  CorrectionLevel,
  QRCodeDataSchema,
  QRCodeInterface,
  QRCodeData,
  QRCodeType,
} from "../index.js";
import { INetworkType } from "./sdk/INetworkType.js";

abstract class QRCode implements QRCodeInterface {
  /**
   * Construct a QR Code instance out of its type and network information.
   *
   * @param   type    {QRCodeType}
   * @param   networkType {INetworkType}
   * @param   generationHash {string}
   * @param   encrypted {boolean}
   */
  constructor(
    /**
     * The QR Code type.
     * @var {QRCodeType}
     */
    public readonly type: QRCodeType,
    /**
     * The network ID.
     * @var {INetworkType}
     */
    public readonly networkType: INetworkType,
    /**
     * The network generation hash.
     * @var {string}
     */
    public readonly generationHash: string,
    /**
     * Whether the data is encrypted
     * @var {boolean}
     */
    public readonly encrypted: boolean = false
  ) {}

  /// region Abstract Methods
  /**
   * The `getSchema()` method should return an instance
   * of a sub-class of QRCodeDataSchema which describes
   * the QR Code data.
   *
   * @return {QRCodeDataSchema}
   */
  public abstract getSchema(): QRCodeDataSchema;

  /**
   * The `getTypeNumber()` method should return the
   * version number for QR codes of the underlying class.
   *
   * @return {number}
   */
  public abstract getTypeNumber(): number;
  /// end-region Abstract Methods

  /**
   * The `getCorrectionLevel()` method should return the
   * QR Code correction level.
   *
   * Sub-classes may overload this method to provide with
   * a different correction level.
   *
   * @return {CorrectionLevel}
   */
  public getCorrectionLevel(): CorrectionLevel {
    return "M";
  }

  /**
   * The `toJSON()` method should return the JSON
   * representation of the QR Code content.
   *
   * @return {string}
   */
  public toJSON(): string {
    // get the QR Code Data Schema
    const schema = this.getSchema();

    // create the JSON object for this QR Code
    const json = schema.toObject(this);

    // format to JSON
    return JSON.stringify(json);
  }

  /**
   * The `toQRData()` method returns the structured data object
   * for QR Code generation by external libraries.
   *
   * @return {QRCodeData}
   */
  public toQRData(): QRCodeData {
    // get the QR Code Data Schema
    const schema = this.getSchema();

    // create the data object for this QR Code
    return schema.toObject(this);
  }

  /**
   * The `getDisplayText()` method returns a human-readable
   * text representation of the QR Code content.
   *
   * @return {string}
   */
  public getDisplayText(): string {
    const data = this.toQRData();
    const typeNames: Record<number, string> = {
      [QRCodeType.AddContact]: "連絡先追加",
      [QRCodeType.ExportAccount]: "アカウントエクスポート",
      [QRCodeType.ExportAddress]: "アドレスエクスポート",
      [QRCodeType.ExportMnemonic]: "ニーモニックエクスポート",
      [QRCodeType.ExportObject]: "オブジェクトエクスポート",
      [QRCodeType.RequestTransaction]: "トランザクション要求",
      [QRCodeType.RequestCosignature]: "連署要求",
      [QRCodeType.SignedTransaction]: "署名済みトランザクション",
      [QRCodeType.CosignatureSignedTransaction]: "連署済みトランザクション",
    };

    const typeName = typeNames[data.type] || `不明なタイプ (${data.type})`;
    const encrypted = this.encrypted ? " (暗号化)" : "";

    return `${typeName}${encrypted} - ネットワーク: ${data.network_id}`;
  }

  /**
   * The `validate()` method validates the QR Code data
   * integrity and returns true if valid.
   *
   * @return {boolean}
   */
  public validate(): boolean {
    try {
      // Basic validation: check if we can generate valid JSON
      const json = this.toJSON();
      const parsed = JSON.parse(json);

      // Check required fields
      return !!(
        parsed.v &&
        parsed.type !== undefined &&
        parsed.network_id !== undefined &&
        parsed.chain_id &&
        parsed.data
      );
    } catch (error) {
      return false;
    }
  }
}

export { QRCode };
