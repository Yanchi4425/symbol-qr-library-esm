/*
 * (C) Symbol Contributors 2022
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Noble dependencies (crypto-js 4.1.1 compatible)
import { cbc } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
// Note: Using SHA-1 for crypto-js 4.1.1 compatibility (PBKDF2 default)
// This is deprecated but required for backward compatibility
import { sha1 } from '@noble/hashes/sha1.js';

// internal dependencies
import { EncryptedPayload } from '../../index';

// Platform-specific randomBytes implementation
function getRandomBytes(size: number): Uint8Array {
  // Browser environment check - use Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  // Node.js environment check - use process object as indicator
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    try {
      // Try to access Node.js crypto via global require (if available)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodeCrypto = (globalThis as any).require?.('crypto');
      if (nodeCrypto && nodeCrypto.randomBytes) {
        return new Uint8Array(nodeCrypto.randomBytes(size));
      }
    } catch {
      // Ignore error and continue to next attempt
    }

    // For bundled environments, throw a descriptive error
    throw new Error(
      'Node.js crypto module not available in bundled environment. Please use native Node.js or ensure crypto polyfill is available.'
    );
  }

  throw new Error(
    'No secure random number generator available. Please use a browser with Web Crypto API or Node.js environment.'
  );
}

// Web APIs are available in both browser and Node.js environments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextEncoder = globalThis.TextEncoder as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextDecoder = globalThis.TextDecoder as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const btoa = globalThis.btoa as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const atob = globalThis.atob as any;

/**
 * Class `EncryptionService` describes a high level service
 * for encryption/decryption of data using Noble cryptography libraries.
 *
 * This implementation maintains complete compatibility with crypto-js 4.1.1:
 * - PBKDF2 with SHA-1, 2000 iterations, 256-bit key
 * - AES-CBC with PKCS7 padding
 * - Same salt and IV generation patterns
 * - Identical output format
 *
 * @since 0.3.0
 */
class EncryptionService {
  /**
   * Convert a string to UTF-8 bytes (crypto-js compatible)
   */
  private static stringToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  /**
   * Convert bytes to hex string (crypto-js compatible)
   */
  private static bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Convert hex string to bytes (crypto-js compatible)
   */
  private static hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  /**
   * Convert bytes to Base64 string (crypto-js compatible)
   */
  private static bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 string to bytes (crypto-js compatible)
   */
  private static base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * The `encrypt` method will encrypt given `data` raw string
   * with given `password` password.
   *
   * This implementation exactly replicates crypto-js 4.1.1 behavior:
   * - 32 byte random salt
   * - PBKDF2 with SHA-1, 2000 iterations, 256-bit key
   * - 16 byte random IV
   * - AES-CBC encryption with PKCS7 padding
   *
   * @param data {string} The data to encrypt
   * @param password {string} The password to use for encryption
   * @returns {EncryptedPayload} The encrypted payload
   */
  public static encrypt(data: string, password: string): EncryptedPayload {
    // Create random salt (32 bytes) - same as crypto-js
    const salt = getRandomBytes(32);

    // Convert password to bytes
    const passwordBytes = this.stringToBytes(password);

    // Derive key using PBKDF2 with SHA-1, 2000 iterations (crypto-js 4.1.1 compatible)
    const key = pbkdf2(sha1, passwordBytes, salt, {
      c: 2000, // iterations - same as crypto-js
      dkLen: 32, // 256-bit key (8 words * 4 bytes)
    });

    // Create encryption IV (16 bytes) - same as crypto-js
    const iv = getRandomBytes(16);

    // Convert data to bytes
    const dataBytes = this.stringToBytes(data);

    // Encrypt with AES-CBC (includes PKCS7 padding automatically)
    const cipher = cbc(key, iv);
    const encrypted = cipher.encrypt(dataBytes);

    // Create ciphertext in crypto-js format: IV (hex) + encrypted (base64)
    const ivHex = this.bytesToHex(iv);
    const encryptedBase64 = this.bytesToBase64(encrypted);
    const ciphertext = ivHex + encryptedBase64;

    // Convert salt to hex (crypto-js format)
    const saltHex = this.bytesToHex(salt);

    return new EncryptedPayload(ciphertext, saltHex);
  }

  /**
   * AES_PBKF2_decryption will decrypt privateKey with provided password
   *
   * This implementation exactly replicates crypto-js 4.1.1 behavior for
   * complete backward compatibility.
   *
   * @param payload the object containing the encrypted data.
   * @param password the password to decrypt the encrypted data
   * @returns {string} The decrypted plaintext
   */
  public static decrypt(payload: EncryptedPayload, password: string): string {
    // Parse salt from hex
    const salt = this.hexToBytes(payload.salt);
    const ciphertext = payload.ciphertext;

    // Extract IV from first 32 hex characters (16 bytes)
    const ivHex = ciphertext.substr(0, 32);
    const iv = this.hexToBytes(ivHex);

    // Extract encrypted data (base64 part)
    const encryptedBase64 = ciphertext.substr(32);
    const encrypted = this.base64ToBytes(encryptedBase64);

    // Convert password to bytes
    const passwordBytes = this.stringToBytes(password);

    // Re-generate key using same PBKDF2 parameters as encryption
    const key = pbkdf2(sha1, passwordBytes, salt, {
      c: 2000, // iterations - same as crypto-js
      dkLen: 32, // 256-bit key
    });

    // Decrypt with AES-CBC
    const cipher = cbc(key, iv);
    let decrypted: Uint8Array;

    try {
      decrypted = cipher.decrypt(encrypted);
    } catch {
      throw new Error('Decryption failed - invalid password or corrupted data');
    }

    // Convert decrypted bytes back to UTF-8 string
    const decryptedText = new TextDecoder('utf-8').decode(decrypted);

    // Note: Empty string is a valid decryption result
    // Only throw error if decryption actually failed (null/undefined)
    if (decryptedText === null || decryptedText === undefined) {
      // This happens sometimes when the wrong password is used instead of an Error.
      throw Error('Empty decrypted text!!');
    }

    return decryptedText;
  }
}

export { EncryptionService };
