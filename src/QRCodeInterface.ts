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
import { QRCodeType } from "../index";

/**
 * Data structure for QR Code content
 */
interface QRCodeData {
  v: number;
  type: QRCodeType;
  network_id: number;
  chain_id: string;
  data: any;
}

/**
 * Interface `QRCodeInterface` describes rules for the definition
 * of NIP-7 compliant QR Codes (ESM version - data generation only).
 *
 * @since 1.0.0 (ESM migration)
 */
interface QRCodeInterface {
  /**
   * The type of the QR Code.
   */
  type: QRCodeType;

  /**
   * The `toJSON()` method should return the JSON
   * representation of the QR Code content.
   *
   * @return {string}
   */
  toJSON(): string;

  /**
   * The `toQRData()` method should return the structured
   * data object for QR Code generation by external libraries.
   *
   * @return {QRCodeData}
   */
  toQRData(): QRCodeData;

  /**
   * The `getDisplayText()` method should return a human-readable
   * text representation of the QR Code content.
   *
   * @return {string}
   */
  getDisplayText(): string;

  /**
   * The `validate()` method should validate the QR Code data
   * integrity and return true if valid.
   *
   * @return {boolean}
   */
  validate(): boolean;
}

export type { QRCodeInterface, QRCodeData };
