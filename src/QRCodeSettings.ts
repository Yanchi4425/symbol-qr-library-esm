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

type CorrectionLevel =
  | "high"
  | "quartile"
  | "medium"
  | "low"
  | "H"
  | "Q"
  | "M"
  | "L"
  | undefined;

/**
 * Class `QRCodeSettings` describes rules for QR Code data generation
 * (ESM version - simplified for data generation only).
 *
 * @since 1.0.0 (ESM migration)
 */
class QRCodeSettings {
  /**
   * The Error correction level for QR Code generation.
   *
   * @var {CorrectionLevel}
   */
  public static CORRECTION_LEVEL: CorrectionLevel = "M";

  /**
   * Constructor for QR code settings
   */
  constructor(
    public readonly correctionLevel: CorrectionLevel = QRCodeSettings.CORRECTION_LEVEL
  ) {}
}

export type { CorrectionLevel };
export { QRCodeSettings };
