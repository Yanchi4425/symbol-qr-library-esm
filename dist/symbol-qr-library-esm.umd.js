(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SymbolQR = {}));
})(this, (function (exports) { 'use strict';

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
    exports.QRCodeType = void 0;
    (function (QRCodeType) {
        QRCodeType[QRCodeType["AddContact"] = 1] = "AddContact";
        QRCodeType[QRCodeType["ExportAccount"] = 2] = "ExportAccount";
        QRCodeType[QRCodeType["RequestTransaction"] = 3] = "RequestTransaction";
        QRCodeType[QRCodeType["RequestCosignature"] = 4] = "RequestCosignature";
        QRCodeType[QRCodeType["ExportMnemonic"] = 5] = "ExportMnemonic";
        QRCodeType[QRCodeType["ExportObject"] = 6] = "ExportObject";
        QRCodeType[QRCodeType["ExportAddress"] = 7] = "ExportAddress";
        QRCodeType[QRCodeType["SignedTransaction"] = 8] = "SignedTransaction";
        QRCodeType[QRCodeType["CosignatureSignedTransaction"] = 9] = "CosignatureSignedTransaction";
    })(exports.QRCodeType || (exports.QRCodeType = {}));

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
    /**
     * Class `QRCodeSettings` describes rules for QR Code data generation
     * (ESM version - simplified for data generation only).
     *
     * @since 1.0.0 (ESM migration)
     */
    class QRCodeSettings {
        correctionLevel;
        /**
         * The Error correction level for QR Code generation.
         *
         * @var {CorrectionLevel}
         */
        static CORRECTION_LEVEL = 'M';
        /**
         * Constructor for QR code settings
         */
        constructor(correctionLevel = QRCodeSettings.CORRECTION_LEVEL) {
            this.correctionLevel = correctionLevel;
        }
    }

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
    class QRCode {
        type;
        networkType;
        generationHash;
        encrypted;
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
        type, 
        /**
         * The network ID.
         * @var {INetworkType}
         */
        networkType, 
        /**
         * The network generation hash.
         * @var {string}
         */
        generationHash, 
        /**
         * Whether the data is encrypted
         * @var {boolean}
         */
        encrypted = false) {
            this.type = type;
            this.networkType = networkType;
            this.generationHash = generationHash;
            this.encrypted = encrypted;
        }
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
        getCorrectionLevel() {
            return 'M';
        }
        /**
         * The `toJSON()` method should return the JSON
         * representation of the QR Code content.
         *
         * @return {string}
         */
        toJSON() {
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
        toQRData() {
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
        getDisplayText() {
            const data = this.toQRData();
            const typeNames = {
                [exports.QRCodeType.AddContact]: '連絡先追加',
                [exports.QRCodeType.ExportAccount]: 'アカウントエクスポート',
                [exports.QRCodeType.ExportAddress]: 'アドレスエクスポート',
                [exports.QRCodeType.ExportMnemonic]: 'ニーモニックエクスポート',
                [exports.QRCodeType.ExportObject]: 'オブジェクトエクスポート',
                [exports.QRCodeType.RequestTransaction]: 'トランザクション要求',
                [exports.QRCodeType.RequestCosignature]: '連署要求',
                [exports.QRCodeType.SignedTransaction]: '署名済みトランザクション',
                [exports.QRCodeType.CosignatureSignedTransaction]: '連署済みトランザクション',
            };
            const typeName = typeNames[data.type] || `不明なタイプ (${data.type})`;
            const encrypted = this.encrypted ? ' (暗号化)' : '';
            return `${typeName}${encrypted} - ネットワーク: ${data.network_id}`;
        }
        /**
         * The `validate()` method validates the QR Code data
         * integrity and returns true if valid.
         *
         * @return {boolean}
         */
        validate() {
            try {
                // Basic validation: check if we can generate valid JSON
                const json = this.toJSON();
                const parsed = JSON.parse(json);
                // Check required fields
                return !!(parsed.v &&
                    parsed.type !== undefined &&
                    parsed.network_id !== undefined &&
                    parsed.chain_id &&
                    parsed.data);
            }
            catch (error) {
                return false;
            }
        }
    }

    /**
     * Class `QRCodeDataSchema` describes a QR Code's data
     * schema. The schema defines obligatory fields and their
     * format.
     *
     * @since 0.3.0
     */
    class QRCodeDataSchema {
        /**
         * The AccountQR QR Code version
         *
         * @var {number}
         */
        VERSION = 3;
        constructor() { }
        /// end-region Abstract Methods
        /**
         * The `toObject()` method returns a JSON object
         * with required fields.
         *
         * @return {any}
         */
        toObject(qr) {
            // read data from child-classes
            const data = this.getData(qr);
            return {
                v: this.VERSION,
                type: qr.type,
                network_id: qr.networkType,
                chain_id: qr.generationHash,
                data,
            };
        }
    }

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
    /**
     * Class `AddContactDataSchema` describes a contact
     * add QR code data schema.
     *
     * @since 0.3.0
     */
    class AddContactDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            return {
                name: qr.name,
                publicKey: qr.accountPublicKey,
            };
        }
        /**
         * Parse a JSON QR code content into a ContactQR
         * object.
         *
         * @param   json    {string}
         * @return  {ContactQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.AddContact) {
                throw Error('Invalid type field value for ContactQR.');
            }
            // read contact data
            const name = jsonObj.data.name;
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new ContactQR(name, jsonObj.data.publicKey, network, generationHash);
        }
    }

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
    /**
     * Class `ExportAccountDataSchema` describes an export
     * account QR code data schema.
     *
     * @since 0.3.0
     */
    class ExportAccountDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            if (qr.encrypted) {
                // we will store a password encrypted copy of the private key
                if (!qr.password) {
                    throw new Error('Password is required for encrypted account QR codes');
                }
                const encryptedData = EncryptionService.encrypt(qr.accountPrivateKey, qr.password);
                return {
                    ciphertext: encryptedData.ciphertext,
                    salt: encryptedData.salt,
                };
            }
            else {
                return {
                    privateKey: qr.accountPrivateKey,
                };
            }
        }
        /**
         * Parse a JSON QR code content into a AccountQR
         * object.
         *
         * @param   json        {string}
         * @param   password    {string=} Optional password
         * @return  {AccountQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         * @throws  {Error}     On invalid password.
         */
        static parse(json, password) {
            if (!json.length) {
                throw new Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.ExportAccount) {
                throw new Error('Invalid type field value for AccountQR.');
            }
            if (!Object.hasOwn(jsonObj, 'data')) {
                throw new Error('Missing mandatory property for payload.');
            }
            try {
                // decrypt private key
                let privKey;
                if (EncryptedPayload.isDataEncrypted(jsonObj.data)) {
                    if (!password) {
                        throw new Error('Password is required to decrypt account QR code');
                    }
                    privKey = EncryptionService.decrypt(EncryptedPayload.fromJSON(JSON.stringify(jsonObj.data)), password);
                }
                else {
                    privKey = jsonObj.data.privateKey;
                }
                // more content validation
                if (!privKey || (privKey.length !== 64 && privKey.length !== 66)) {
                    throw new Error('Invalid private key.');
                }
                const network = jsonObj.network_id;
                const generationHash = jsonObj.chain_id;
                // create account
                return new AccountQR(privKey, network, generationHash, password);
            }
            catch {
                throw new Error('Could not parse account information.');
            }
        }
    }

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
    /**
     * Class `ExportMnemonicDataSchema` describes an export
     * account QR code data schema.
     *
     * @since 0.3.2
     */
    class ExportMnemonicDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            if (qr.encrypted) {
                // we will store a password encrypted copy of the mnemonic plain text
                if (!qr.password) {
                    throw new Error('Password is required for encrypted mnemonic QR codes');
                }
                const encryptedData = EncryptionService.encrypt(qr.mnemonicPlainText, qr.password);
                return {
                    ciphertext: encryptedData.ciphertext,
                    salt: encryptedData.salt,
                };
            }
            else {
                return {
                    plainMnemonic: qr.mnemonicPlainText,
                };
            }
        }
        /**
         * Parse a JSON QR code content into a MnemonicQR
         * object.
         *
         * @param   json        {string}
         * @param   password    {string=} Optional password
         * @return  {MnemonicQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         * @throws  {Error}     On invalid password.
         */
        static parse(json, password) {
            if (!json.length) {
                throw new Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.ExportMnemonic) {
                throw new Error('Invalid type field value for MnemonicQR.');
            }
            if (!Object.hasOwn(jsonObj, 'data')) {
                throw new Error('Missing mandatory property for encrypted payload.');
            }
            try {
                // decrypt mnemonic pass phrase
                let plainTxt;
                if (EncryptedPayload.isDataEncrypted(jsonObj.data)) {
                    if (!password) {
                        throw new Error('Password is required to decrypt mnemonic QR code');
                    }
                    plainTxt = EncryptionService.decrypt(EncryptedPayload.fromJSON(JSON.stringify(jsonObj.data)), password);
                }
                else {
                    plainTxt = jsonObj.data.plainMnemonic;
                }
                if (!plainTxt) {
                    throw new Error('Mnemonic pass phrase is not valid!');
                }
                const network = jsonObj.network_id;
                const generationHash = jsonObj.chain_id;
                return new MnemonicQR(plainTxt, network, generationHash, password);
            }
            catch {
                throw new Error('Could not parse mnemonic pass phrase.');
            }
        }
    }

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
    /**
     * Class `ExportObjectDataSchema` describes an export
     * object QR code data schema.
     *
     * @since 0.3.0
     */
    class ExportObjectDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            return qr.object;
        }
        /**
         * Parse a JSON QR code content into a ObjectQR
         * object.
         *
         * @param   json    {string}
         * @return  {ObjectQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.ExportObject) {
                throw Error('Invalid type field value for ObjectQR.');
            }
            // read contact data
            const obj = jsonObj.data;
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new ObjectQR(obj, network, generationHash);
        }
    }

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
    /**
     * Class `RequestTransactionDataSchema` describes a transaction
     * request QR code data schema.
     *
     * @since 0.3.0
     */
    class RequestTransactionDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {{payload: string}}
         */
        getData(qr) {
            // serialize the transaction object data.
            const payload = qr.transaction.serialize();
            return {
                payload,
            };
        }
        /**
         * Parse a JSON QR code content into a TransactionQR
         * object.
         *
         * @param   json    {string}
         * @param   transactionCreateFromPayload the transaction parser that creates a transaction from a binary payload.
         * @return  {TransactionQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json, transactionCreateFromPayload) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.RequestTransaction) {
                throw Error('Invalid type field value for TransactionQR.');
            }
            const createTransaction = transactionCreateFromPayload ||
                ((payload) => ({
                    serialize: () => payload,
                }));
            // read contact data
            const transaction = createTransaction(jsonObj.data.payload);
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new TransactionQR(transaction, network, generationHash);
        }
    }

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
    /**
     * Class `RequestCosignatureDataSchema` describes a transaction
     * cosignature request QR code data schema.
     *
     * @since 0.3.0
     */
    class RequestCosignatureDataSchema extends RequestTransactionDataSchema {
        constructor() {
            super();
        }
        /**
         * Parse a JSON QR code content into a CosignatureQR
         * object.
         *
         * @param   json    {string}
         * @param   transactionCreateFromPayload the transaction parser that creates a transaction from a binary payload.
         * @return  {CosignatureQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json, transactionCreateFromPayload) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.RequestCosignature) {
                throw Error('Invalid type field value for CosignatureQR.');
            }
            // read contact data
            const transaction = transactionCreateFromPayload(jsonObj.data.payload);
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new CosignatureQR(transaction, network, generationHash);
        }
    }

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
    class SignedTransactionQR extends QRCode {
        singedTransaction;
        networkType;
        generationHash;
        type;
        /**
         * Construct a Address QR Code out of the
         * symbol public key.
         *
         * @param singedTransaction
         * @param type
         * @param   networkType     {INetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The transaction for the request.
         * @var {Transaction}
         */
        singedTransaction, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The chain Id.
         * @var {string}
         */
        generationHash, 
        /**
         * The QR Code Type
         *
         * @var {QRCodeType}
         */
        type = exports.QRCodeType.SignedTransaction) {
            super(exports.QRCodeType.SignedTransaction, networkType, generationHash);
            this.singedTransaction = singedTransaction;
            this.networkType = networkType;
            this.generationHash = generationHash;
            this.type = type;
        }
        /**
         * Parse a JSON QR code content into an AddressQR
         * object.
         *
         * @param   json        {string}
         * @return  {AddressQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, transactionCreateFromPayload) {
            // create the QRCode object from JSON
            return SignedTransactionDataSchema.parse(json, transactionCreateFromPayload);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for SignedTransaction is Version 40, uses correction level M
            // This type of QR can hold up to 412 binary bytes.
            return 40;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new SignedTransactionDataSchema();
        }
    }

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
    /**
     * Class `SignedTransactionDataSchema` describes a transaction
     * request QR code data schema.
     *
     * @since 0.3.0
     */
    class SignedTransactionDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            // serialize the transaction object data.
            const payload = qr.singedTransaction.toDTO();
            return {
                payload,
            };
        }
        /**
         * Parse a JSON QR code content into a SignedTransactionQR
         * object.
         *
         * @param   json    {string}
         * @param   transactionCreateFromPayload the transaction parser that creates a transaction from a binary payload.
         * @return  {TransactionQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json, transactionCreateFromPayload) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.SignedTransaction) {
                throw Error('Invalid type field value for SignedTransactionQR.');
            }
            // read contact data
            const transaction = transactionCreateFromPayload(jsonObj.data.payload);
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new SignedTransactionQR(transaction, network, generationHash);
        }
    }

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
    class CosignatureSignedTransactionQR extends QRCode {
        singedTransaction;
        networkType;
        generationHash;
        type;
        /**
         * Construct a Address QR Code out of the
         * symbol public key.
         *
         * @param singedTransaction
         * @param type
         * @param   networkType     {INetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The transaction for the request.
         * @var {Transaction}
         */
        singedTransaction, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The chain Id.
         * @var {string}
         */
        generationHash, 
        /**
         * The QR Code Type
         *
         * @var {QRCodeType}
         */
        type = exports.QRCodeType.CosignatureSignedTransaction) {
            super(exports.QRCodeType.CosignatureSignedTransaction, networkType, generationHash);
            this.singedTransaction = singedTransaction;
            this.networkType = networkType;
            this.generationHash = generationHash;
            this.type = type;
        }
        /**
         * Parse a JSON QR code content into an CosignatureSignedTransactionQR
         * object.
         *
         * @param   json        {string}
         * @return  {AddressQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, transactionCreateFromPayload) {
            // create the QRCode object from JSON
            return CosignatureSignedTransactionDataSchema.parse(json, transactionCreateFromPayload);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for SignedTransaction is Version 40, uses correction level M
            // This type of QR can hold up to 412 binary bytes.
            return 40;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new CosignatureSignedTransactionDataSchema();
        }
    }

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
    /**
     * Class `SignedTransactionDataSchema` describes a transaction
     * request QR code data schema.
     *
     * @since 0.3.0
     */
    class CosignatureSignedTransactionDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            return {
                payload: qr.singedTransaction,
            };
        }
        /**
         * Parse a JSON QR code content into a CosignatureSignedTransactionQR
         * object.
         *
         * @param   json    {string}
         * @param   transactionCreateFromPayload the transaction parser that creates a transaction from a binary payload.
         * @return  {TransactionQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json, transactionCreateFromPayload) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type ||
                jsonObj.type !== exports.QRCodeType.CosignatureSignedTransaction) {
                throw Error('Invalid type field value for CosignatureSignedTransactionQR.');
            }
            // read contact data
            const transaction = transactionCreateFromPayload(jsonObj.data.payload);
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new CosignatureSignedTransactionQR(transaction, network, generationHash);
        }
    }

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
    /**
     * Class `EncryptedPayload` describes an encrypted payload
     * with salt and ciphertext properties.
     *
     * @since 0.3.0
     */
    class EncryptedPayload {
        ciphertext;
        salt;
        constructor(
        /**
         * The payload ciphertext.
         * The first X bytes represent the IV.
         *
         * @var {string}
         */
        ciphertext, 
        /**
         * The payload salt.
         *
         * @var {string}
         */
        salt) {
            this.ciphertext = ciphertext;
            this.salt = salt;
        }
        /**
         * Parse a JSON representation of an encrypted
         * payload into a `EncryptedPayload` instance.
         *
         * The provided JSON must contain fields 'ciphertext'
         * and 'salt'.
         *
         * @param   {string}    json
         * @return  {EncryptedPayload}
         */
        static fromJSON(json) {
            const jsonObject = EncryptedPayload.validateJson(json);
            // validate obligatory fields
            if (!Object.hasOwn(jsonObject, 'ciphertext')) {
                throw new Error("Missing mandatory field 'ciphertext'.");
            }
            if (!Object.hasOwn(jsonObject, 'salt')) {
                throw new Error("Missing mandatory field 'salt'.");
            }
            return new EncryptedPayload(jsonObject.ciphertext, jsonObject.salt);
        }
        /**
         * Validates given json string and returns json object
         * @param json
         * @return json object
         * @throws {Error} If validation fails
         */
        static validateJson(json) {
            if (!json.length) {
                throw new Error('JSON argument cannot be empty.');
            }
            // validate JSON
            let jsonObject;
            try {
                jsonObject = JSON.parse(json);
            }
            catch (e) {
                // Invalid JSON provided, forward error
                throw new Error('Invalid json body in payload! ' +
                    (e instanceof Error ? e.message : String(e)));
            }
            return jsonObject;
        }
        /**
         * Checks if the data ojbect is encrypted
         * @param jsonObject
         */
        static isDataEncrypted(jsonObject) {
            return (Object.hasOwn(jsonObject, 'ciphertext') &&
                Object.hasOwn(jsonObject, 'salt'));
        }
    }

    /**
     * Utilities for hex, bytes, CSPRNG.
     * @module
     */
    /*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
    /** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
    function isBytes$1(a) {
        return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
    }
    /** Asserts something is Uint8Array. */
    function abytes$1(b, ...lengths) {
        if (!isBytes$1(b))
            throw new Error('Uint8Array expected');
        if (lengths.length > 0 && !lengths.includes(b.length))
            throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
    }
    /** Cast u8 / u16 / u32 to u32. */
    function u32(arr) {
        return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    /** Zeroize a byte array. Warning: JS provides no guarantees. */
    function clean$1(...arrays) {
        for (let i = 0; i < arrays.length; i++) {
            arrays[i].fill(0);
        }
    }
    /** Is current platform little-endian? Most are. Big-Endian platform: IBM */
    const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44)();
    /**
     * Checks if two U8A use same underlying buffer and overlaps.
     * This is invalid and can corrupt data.
     */
    function overlapBytes(a, b) {
        return (a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
            a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
            b.byteOffset < a.byteOffset + a.byteLength // b starts before a end
        );
    }
    /**
     * If input and output overlap and input starts before output, we will overwrite end of input before
     * we start processing it, so this is not supported for most ciphers (except chacha/salse, which designed with this)
     */
    function complexOverlapBytes(input, output) {
        // This is very cursed. It works somehow, but I'm completely unsure,
        // reasoning about overlapping aligned windows is very hard.
        if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
            throw new Error('complex overlap of input and output is not supported');
    }
    /**
     * Wraps a cipher: validates args, ensures encrypt() can only be called once.
     * @__NO_SIDE_EFFECTS__
     */
    const wrapCipher = (params, constructor) => {
        function wrappedCipher(key, ...args) {
            // Validate key
            abytes$1(key);
            // Big-Endian hardware is rare. Just in case someone still decides to run ciphers:
            if (!isLE)
                throw new Error('Non little-endian hardware is not yet supported');
            // Validate nonce if nonceLength is present
            if (params.nonceLength !== undefined) {
                const nonce = args[0];
                if (!nonce)
                    throw new Error('nonce / iv required');
                if (params.varSizeNonce)
                    abytes$1(nonce);
                else
                    abytes$1(nonce, params.nonceLength);
            }
            // Validate AAD if tagLength present
            const tagl = params.tagLength;
            if (tagl && args[1] !== undefined) {
                abytes$1(args[1]);
            }
            const cipher = constructor(key, ...args);
            const checkOutput = (fnLength, output) => {
                if (output !== undefined) {
                    if (fnLength !== 2)
                        throw new Error('cipher output not supported');
                    abytes$1(output);
                }
            };
            // Create wrapped cipher with validation and single-use encryption
            let called = false;
            const wrCipher = {
                encrypt(data, output) {
                    if (called)
                        throw new Error('cannot encrypt() twice with same key + nonce');
                    called = true;
                    abytes$1(data);
                    checkOutput(cipher.encrypt.length, output);
                    return cipher.encrypt(data, output);
                },
                decrypt(data, output) {
                    abytes$1(data);
                    if (tagl && data.length < tagl)
                        throw new Error('invalid ciphertext length: smaller than tagLength=' + tagl);
                    checkOutput(cipher.decrypt.length, output);
                    return cipher.decrypt(data, output);
                },
            };
            return wrCipher;
        }
        Object.assign(wrappedCipher, params);
        return wrappedCipher;
    };
    /**
     * By default, returns u8a of length.
     * When out is available, it checks it for validity and uses it.
     */
    function getOutput(expectedLength, out, onlyAligned = true) {
        if (out === undefined)
            return new Uint8Array(expectedLength);
        if (out.length !== expectedLength)
            throw new Error('invalid output length, expected ' + expectedLength + ', got: ' + out.length);
        if (onlyAligned && !isAligned32(out))
            throw new Error('invalid output, must be aligned');
        return out;
    }
    // Is byte array aligned to 4 byte offset (u32)?
    function isAligned32(bytes) {
        return bytes.byteOffset % 4 === 0;
    }
    // copy bytes to new u8a (aligned). Because Buffer.slice is broken.
    function copyBytes(bytes) {
        return Uint8Array.from(bytes);
    }

    /**
     * [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
     * a.k.a. Advanced Encryption Standard
     * is a variant of Rijndael block cipher, standardized by NIST in 2001.
     * We provide the fastest available pure JS implementation.
     *
     * Data is split into 128-bit blocks. Encrypted in 10/12/14 rounds (128/192/256 bits). In every round:
     * 1. **S-box**, table substitution
     * 2. **Shift rows**, cyclic shift left of all rows of data array
     * 3. **Mix columns**, multiplying every column by fixed polynomial
     * 4. **Add round key**, round_key xor i-th column of array
     *
     * Check out [FIPS-197](https://csrc.nist.gov/files/pubs/fips/197/final/docs/fips-197.pdf)
     * and [original proposal](https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/aes-development/rijndael-ammended.pdf)
     * @module
     */
    const BLOCK_SIZE = 16;
    const POLY = 0x11b; // 1 + x + x**3 + x**4 + x**8
    // TODO: remove multiplication, binary ops only
    function mul2(n) {
        return (n << 1) ^ (POLY & -(n >> 7));
    }
    function mul(a, b) {
        let res = 0;
        for (; b > 0; b >>= 1) {
            // Montgomery ladder
            res ^= a & -(b & 1); // if (b&1) res ^=a (but const-time).
            a = mul2(a); // a = 2*a
        }
        return res;
    }
    // AES S-box is generated using finite field inversion,
    // an affine transform, and xor of a constant 0x63.
    const sbox = /* @__PURE__ */ (() => {
        const t = new Uint8Array(256);
        for (let i = 0, x = 1; i < 256; i++, x ^= mul2(x))
            t[i] = x;
        const box = new Uint8Array(256);
        box[0] = 0x63; // first elm
        for (let i = 0; i < 255; i++) {
            let x = t[255 - i];
            x |= x << 8;
            box[t[i]] = (x ^ (x >> 4) ^ (x >> 5) ^ (x >> 6) ^ (x >> 7) ^ 0x63) & 0xff;
        }
        clean$1(t);
        return box;
    })();
    // Inverted S-box
    const invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
    // Rotate u32 by 8
    const rotr32_8 = (n) => (n << 24) | (n >>> 8);
    const rotl32_8 = (n) => (n << 8) | (n >>> 24);
    // T-table is optimization suggested in 5.2 of original proposal (missed from FIPS-197). Changes:
    // - LE instead of BE
    // - bigger tables: T0 and T1 are merged into T01 table and T2 & T3 into T23;
    //   so index is u16, instead of u8. This speeds up things, unexpectedly
    function genTtable(sbox, fn) {
        if (sbox.length !== 256)
            throw new Error('Wrong sbox length');
        const T0 = new Uint32Array(256).map((_, j) => fn(sbox[j]));
        const T1 = T0.map(rotl32_8);
        const T2 = T1.map(rotl32_8);
        const T3 = T2.map(rotl32_8);
        const T01 = new Uint32Array(256 * 256);
        const T23 = new Uint32Array(256 * 256);
        const sbox2 = new Uint16Array(256 * 256);
        for (let i = 0; i < 256; i++) {
            for (let j = 0; j < 256; j++) {
                const idx = i * 256 + j;
                T01[idx] = T0[i] ^ T1[j];
                T23[idx] = T2[i] ^ T3[j];
                sbox2[idx] = (sbox[i] << 8) | sbox[j];
            }
        }
        return { sbox, sbox2, T0, T1, T2, T3, T01, T23 };
    }
    const tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => (mul(s, 3) << 24) | (s << 16) | (s << 8) | mul(s, 2));
    const tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => (mul(s, 11) << 24) | (mul(s, 13) << 16) | (mul(s, 9) << 8) | mul(s, 14));
    const xPowers = /* @__PURE__ */ (() => {
        const p = new Uint8Array(16);
        for (let i = 0, x = 1; i < 16; i++, x = mul2(x))
            p[i] = x;
        return p;
    })();
    /** Key expansion used in CTR. */
    function expandKeyLE(key) {
        abytes$1(key);
        const len = key.length;
        if (![16, 24, 32].includes(len))
            throw new Error('aes: invalid key size, should be 16, 24 or 32, got ' + len);
        const { sbox2 } = tableEncoding;
        const toClean = [];
        if (!isAligned32(key))
            toClean.push((key = copyBytes(key)));
        const k32 = u32(key);
        const Nk = k32.length;
        const subByte = (n) => applySbox(sbox2, n, n, n, n);
        const xk = new Uint32Array(len + 28); // expanded key
        xk.set(k32);
        // 4.3.1 Key expansion
        for (let i = Nk; i < xk.length; i++) {
            let t = xk[i - 1];
            if (i % Nk === 0)
                t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
            else if (Nk > 6 && i % Nk === 4)
                t = subByte(t);
            xk[i] = xk[i - Nk] ^ t;
        }
        clean$1(...toClean);
        return xk;
    }
    function expandKeyDecLE(key) {
        const encKey = expandKeyLE(key);
        const xk = encKey.slice();
        const Nk = encKey.length;
        const { sbox2 } = tableEncoding;
        const { T0, T1, T2, T3 } = tableDecoding;
        // Inverse key by chunks of 4 (rounds)
        for (let i = 0; i < Nk; i += 4) {
            for (let j = 0; j < 4; j++)
                xk[i + j] = encKey[Nk - i - 4 + j];
        }
        clean$1(encKey);
        // apply InvMixColumn except first & last round
        for (let i = 4; i < Nk - 4; i++) {
            const x = xk[i];
            const w = applySbox(sbox2, x, x, x, x);
            xk[i] = T0[w & 0xff] ^ T1[(w >>> 8) & 0xff] ^ T2[(w >>> 16) & 0xff] ^ T3[w >>> 24];
        }
        return xk;
    }
    // Apply tables
    function apply0123(T01, T23, s0, s1, s2, s3) {
        return (T01[((s0 << 8) & 0xff00) | ((s1 >>> 8) & 0xff)] ^
            T23[((s2 >>> 8) & 0xff00) | ((s3 >>> 24) & 0xff)]);
    }
    function applySbox(sbox2, s0, s1, s2, s3) {
        return (sbox2[(s0 & 0xff) | (s1 & 0xff00)] |
            (sbox2[((s2 >>> 16) & 0xff) | ((s3 >>> 16) & 0xff00)] << 16));
    }
    function encrypt(xk, s0, s1, s2, s3) {
        const { sbox2, T01, T23 } = tableEncoding;
        let k = 0;
        (s0 ^= xk[k++]), (s1 ^= xk[k++]), (s2 ^= xk[k++]), (s3 ^= xk[k++]);
        const rounds = xk.length / 4 - 2;
        for (let i = 0; i < rounds; i++) {
            const t0 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
            const t1 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
            const t2 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
            const t3 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
            (s0 = t0), (s1 = t1), (s2 = t2), (s3 = t3);
        }
        // last round (without mixcolumns, so using SBOX2 table)
        const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
        const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
        const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
        const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
        return { s0: t0, s1: t1, s2: t2, s3: t3 };
    }
    // Can't be merged with encrypt: arg positions for apply0123 / applySbox are different
    function decrypt(xk, s0, s1, s2, s3) {
        const { sbox2, T01, T23 } = tableDecoding;
        let k = 0;
        (s0 ^= xk[k++]), (s1 ^= xk[k++]), (s2 ^= xk[k++]), (s3 ^= xk[k++]);
        const rounds = xk.length / 4 - 2;
        for (let i = 0; i < rounds; i++) {
            const t0 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
            const t1 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
            const t2 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
            const t3 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
            (s0 = t0), (s1 = t1), (s2 = t2), (s3 = t3);
        }
        // Last round
        const t0 = xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1);
        const t1 = xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2);
        const t2 = xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3);
        const t3 = xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0);
        return { s0: t0, s1: t1, s2: t2, s3: t3 };
    }
    function validateBlockDecrypt(data) {
        abytes$1(data);
        if (data.length % BLOCK_SIZE !== 0) {
            throw new Error('aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size ' + BLOCK_SIZE);
        }
    }
    function validateBlockEncrypt(plaintext, pcks5, dst) {
        abytes$1(plaintext);
        let outLen = plaintext.length;
        const remaining = outLen % BLOCK_SIZE;
        if (!pcks5 && remaining !== 0)
            throw new Error('aec/(cbc-ecb): unpadded plaintext with disabled padding');
        if (!isAligned32(plaintext))
            plaintext = copyBytes(plaintext);
        const b = u32(plaintext);
        if (pcks5) {
            let left = BLOCK_SIZE - remaining;
            if (!left)
                left = BLOCK_SIZE; // if no bytes left, create empty padding block
            outLen = outLen + left;
        }
        dst = getOutput(outLen, dst);
        complexOverlapBytes(plaintext, dst);
        const o = u32(dst);
        return { b, o, out: dst };
    }
    function validatePCKS(data, pcks5) {
        if (!pcks5)
            return data;
        const len = data.length;
        if (!len)
            throw new Error('aes/pcks5: empty ciphertext not allowed');
        const lastByte = data[len - 1];
        if (lastByte <= 0 || lastByte > 16)
            throw new Error('aes/pcks5: wrong padding');
        const out = data.subarray(0, -lastByte);
        for (let i = 0; i < lastByte; i++)
            if (data[len - i - 1] !== lastByte)
                throw new Error('aes/pcks5: wrong padding');
        return out;
    }
    function padPCKS(left) {
        const tmp = new Uint8Array(16);
        const tmp32 = u32(tmp);
        tmp.set(left);
        const paddingByte = BLOCK_SIZE - left.length;
        for (let i = BLOCK_SIZE - paddingByte; i < BLOCK_SIZE; i++)
            tmp[i] = paddingByte;
        return tmp32;
    }
    /**
     * CBC: Cipher-Block-Chaining. Key is previous round’s block.
     * Fragile: needs proper padding. Unauthenticated: needs MAC.
     */
    const cbc = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, function aescbc(key, iv, opts = {}) {
        const pcks5 = !opts.disablePadding;
        return {
            encrypt(plaintext, dst) {
                const xk = expandKeyLE(key);
                const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
                let _iv = iv;
                const toClean = [xk];
                if (!isAligned32(_iv))
                    toClean.push((_iv = copyBytes(_iv)));
                const n32 = u32(_iv);
                // prettier-ignore
                let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
                let i = 0;
                for (; i + 4 <= b.length;) {
                    (s0 ^= b[i + 0]), (s1 ^= b[i + 1]), (s2 ^= b[i + 2]), (s3 ^= b[i + 3]);
                    ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
                    (o[i++] = s0), (o[i++] = s1), (o[i++] = s2), (o[i++] = s3);
                }
                if (pcks5) {
                    const tmp32 = padPCKS(plaintext.subarray(i * 4));
                    (s0 ^= tmp32[0]), (s1 ^= tmp32[1]), (s2 ^= tmp32[2]), (s3 ^= tmp32[3]);
                    ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
                    (o[i++] = s0), (o[i++] = s1), (o[i++] = s2), (o[i++] = s3);
                }
                clean$1(...toClean);
                return _out;
            },
            decrypt(ciphertext, dst) {
                validateBlockDecrypt(ciphertext);
                const xk = expandKeyDecLE(key);
                let _iv = iv;
                const toClean = [xk];
                if (!isAligned32(_iv))
                    toClean.push((_iv = copyBytes(_iv)));
                const n32 = u32(_iv);
                dst = getOutput(ciphertext.length, dst);
                if (!isAligned32(ciphertext))
                    toClean.push((ciphertext = copyBytes(ciphertext)));
                complexOverlapBytes(ciphertext, dst);
                const b = u32(ciphertext);
                const o = u32(dst);
                // prettier-ignore
                let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
                for (let i = 0; i + 4 <= b.length;) {
                    // prettier-ignore
                    const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
                    (s0 = b[i + 0]), (s1 = b[i + 1]), (s2 = b[i + 2]), (s3 = b[i + 3]);
                    const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
                    (o[i++] = o0 ^ ps0), (o[i++] = o1 ^ ps1), (o[i++] = o2 ^ ps2), (o[i++] = o3 ^ ps3);
                }
                clean$1(...toClean);
                return validatePCKS(dst, pcks5);
            },
        };
    });

    /**
     * Utilities for hex, bytes, CSPRNG.
     * @module
     */
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    // We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
    // node.js versions earlier than v19 don't declare it in global scope.
    // For node.js, package.json#exports field mapping rewrites import
    // from `crypto` to `cryptoNode`, which imports native module.
    // Makes the utils un-importable in browsers without a bundler.
    // Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
    /** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
    function isBytes(a) {
        return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
    }
    /** Asserts something is positive integer. */
    function anumber(n) {
        if (!Number.isSafeInteger(n) || n < 0)
            throw new Error('positive integer expected, got ' + n);
    }
    /** Asserts something is Uint8Array. */
    function abytes(b, ...lengths) {
        if (!isBytes(b))
            throw new Error('Uint8Array expected');
        if (lengths.length > 0 && !lengths.includes(b.length))
            throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
    }
    /** Asserts something is hash */
    function ahash(h) {
        if (typeof h !== 'function' || typeof h.create !== 'function')
            throw new Error('Hash should be wrapped by utils.createHasher');
        anumber(h.outputLen);
        anumber(h.blockLen);
    }
    /** Asserts a hash instance has not been destroyed / finished */
    function aexists(instance, checkFinished = true) {
        if (instance.destroyed)
            throw new Error('Hash instance has been destroyed');
        if (checkFinished && instance.finished)
            throw new Error('Hash#digest() has already been called');
    }
    /** Asserts output is properly-sized byte array */
    function aoutput(out, instance) {
        abytes(out);
        const min = instance.outputLen;
        if (out.length < min) {
            throw new Error('digestInto() expects output buffer of length at least ' + min);
        }
    }
    /** Zeroize a byte array. Warning: JS provides no guarantees. */
    function clean(...arrays) {
        for (let i = 0; i < arrays.length; i++) {
            arrays[i].fill(0);
        }
    }
    /** Create DataView of an array for easy byte-level manipulation. */
    function createView(arr) {
        return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    /** The rotate left (circular left shift) operation for uint32 */
    function rotl(word, shift) {
        return (word << shift) | ((word >>> (32 - shift)) >>> 0);
    }
    /**
     * Converts string to bytes using UTF8 encoding.
     * @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
     */
    function utf8ToBytes(str) {
        if (typeof str !== 'string')
            throw new Error('string expected');
        return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
    }
    /**
     * Normalizes (non-hex) string or Uint8Array to Uint8Array.
     * Warning: when Uint8Array is passed, it would NOT get copied.
     * Keep in mind for future mutable operations.
     */
    function toBytes(data) {
        if (typeof data === 'string')
            data = utf8ToBytes(data);
        abytes(data);
        return data;
    }
    /**
     * Helper for KDFs: consumes uint8array or string.
     * When string is passed, does utf8 decoding, using TextDecoder.
     */
    function kdfInputToBytes(data) {
        if (typeof data === 'string')
            data = utf8ToBytes(data);
        abytes(data);
        return data;
    }
    function checkOpts(defaults, opts) {
        if (opts !== undefined && {}.toString.call(opts) !== '[object Object]')
            throw new Error('options should be object or undefined');
        const merged = Object.assign(defaults, opts);
        return merged;
    }
    /** For runtime check if class implements interface */
    class Hash {
    }
    /** Wraps hash function, creating an interface on top of it */
    function createHasher(hashCons) {
        const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
        const tmp = hashCons();
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = () => hashCons();
        return hashC;
    }

    /**
     * HMAC: RFC2104 message authentication code.
     * @module
     */
    class HMAC extends Hash {
        constructor(hash, _key) {
            super();
            this.finished = false;
            this.destroyed = false;
            ahash(hash);
            const key = toBytes(_key);
            this.iHash = hash.create();
            if (typeof this.iHash.update !== 'function')
                throw new Error('Expected instance of class which extends utils.Hash');
            this.blockLen = this.iHash.blockLen;
            this.outputLen = this.iHash.outputLen;
            const blockLen = this.blockLen;
            const pad = new Uint8Array(blockLen);
            // blockLen can be bigger than outputLen
            pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
            for (let i = 0; i < pad.length; i++)
                pad[i] ^= 0x36;
            this.iHash.update(pad);
            // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
            this.oHash = hash.create();
            // Undo internal XOR && apply outer XOR
            for (let i = 0; i < pad.length; i++)
                pad[i] ^= 0x36 ^ 0x5c;
            this.oHash.update(pad);
            clean(pad);
        }
        update(buf) {
            aexists(this);
            this.iHash.update(buf);
            return this;
        }
        digestInto(out) {
            aexists(this);
            abytes(out, this.outputLen);
            this.finished = true;
            this.iHash.digestInto(out);
            this.oHash.update(out);
            this.oHash.digestInto(out);
            this.destroy();
        }
        digest() {
            const out = new Uint8Array(this.oHash.outputLen);
            this.digestInto(out);
            return out;
        }
        _cloneInto(to) {
            // Create new instance without calling constructor since key already in state and we don't know it.
            to || (to = Object.create(Object.getPrototypeOf(this), {}));
            const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
            to = to;
            to.finished = finished;
            to.destroyed = destroyed;
            to.blockLen = blockLen;
            to.outputLen = outputLen;
            to.oHash = oHash._cloneInto(to.oHash);
            to.iHash = iHash._cloneInto(to.iHash);
            return to;
        }
        clone() {
            return this._cloneInto();
        }
        destroy() {
            this.destroyed = true;
            this.oHash.destroy();
            this.iHash.destroy();
        }
    }
    /**
     * HMAC: RFC2104 message authentication code.
     * @param hash - function that would be used e.g. sha256
     * @param key - message key
     * @param message - message data
     * @example
     * import { hmac } from '@noble/hashes/hmac';
     * import { sha256 } from '@noble/hashes/sha2';
     * const mac1 = hmac(sha256, 'key', 'message');
     */
    const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
    hmac.create = (hash, key) => new HMAC(hash, key);

    /**
     * PBKDF (RFC 2898). Can be used to create a key from password and salt.
     * @module
     */
    // Common prologue and epilogue for sync/async functions
    function pbkdf2Init(hash, _password, _salt, _opts) {
        ahash(hash);
        const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
        const { c, dkLen, asyncTick } = opts;
        anumber(c);
        anumber(dkLen);
        anumber(asyncTick);
        if (c < 1)
            throw new Error('iterations (c) should be >= 1');
        const password = kdfInputToBytes(_password);
        const salt = kdfInputToBytes(_salt);
        // DK = PBKDF2(PRF, Password, Salt, c, dkLen);
        const DK = new Uint8Array(dkLen);
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        const PRF = hmac.create(hash, password);
        const PRFSalt = PRF._cloneInto().update(salt);
        return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
    }
    function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
        PRF.destroy();
        PRFSalt.destroy();
        if (prfW)
            prfW.destroy();
        clean(u);
        return DK;
    }
    /**
     * PBKDF2-HMAC: RFC 2898 key derivation function
     * @param hash - hash function that would be used e.g. sha256
     * @param password - password from which a derived key is generated
     * @param salt - cryptographic salt
     * @param opts - {c, dkLen} where c is work factor and dkLen is output message size
     * @example
     * const key = pbkdf2(sha256, 'password', 'salt', { dkLen: 32, c: Math.pow(2, 18) });
     */
    function pbkdf2(hash, password, salt, opts) {
        const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
        let prfW; // Working copy
        const arr = new Uint8Array(4);
        const view = createView(arr);
        const u = new Uint8Array(PRF.outputLen);
        // DK = T1 + T2 + ⋯ + Tdklen/hlen
        for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
            // Ti = F(Password, Salt, c, i)
            const Ti = DK.subarray(pos, pos + PRF.outputLen);
            view.setInt32(0, ti, false);
            // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
            // U1 = PRF(Password, Salt + INT_32_BE(i))
            (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
            Ti.set(u.subarray(0, Ti.length));
            for (let ui = 1; ui < c; ui++) {
                // Uc = PRF(Password, Uc−1)
                PRF._cloneInto(prfW).update(u).digestInto(u);
                for (let i = 0; i < Ti.length; i++)
                    Ti[i] ^= u[i];
            }
        }
        return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
    }

    /**
     * Internal Merkle-Damgard hash utils.
     * @module
     */
    /** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
    function setBigUint64(view, byteOffset, value, isLE) {
        if (typeof view.setBigUint64 === 'function')
            return view.setBigUint64(byteOffset, value, isLE);
        const _32n = BigInt(32);
        const _u32_max = BigInt(0xffffffff);
        const wh = Number((value >> _32n) & _u32_max);
        const wl = Number(value & _u32_max);
        const h = isLE ? 4 : 0;
        const l = isLE ? 0 : 4;
        view.setUint32(byteOffset + h, wh, isLE);
        view.setUint32(byteOffset + l, wl, isLE);
    }
    /** Choice: a ? b : c */
    function Chi(a, b, c) {
        return (a & b) ^ (~a & c);
    }
    /** Majority function, true if any two inputs is true. */
    function Maj(a, b, c) {
        return (a & b) ^ (a & c) ^ (b & c);
    }
    /**
     * Merkle-Damgard hash construction base class.
     * Could be used to create MD5, RIPEMD, SHA1, SHA2.
     */
    class HashMD extends Hash {
        constructor(blockLen, outputLen, padOffset, isLE) {
            super();
            this.finished = false;
            this.length = 0;
            this.pos = 0;
            this.destroyed = false;
            this.blockLen = blockLen;
            this.outputLen = outputLen;
            this.padOffset = padOffset;
            this.isLE = isLE;
            this.buffer = new Uint8Array(blockLen);
            this.view = createView(this.buffer);
        }
        update(data) {
            aexists(this);
            data = toBytes(data);
            abytes(data);
            const { view, buffer, blockLen } = this;
            const len = data.length;
            for (let pos = 0; pos < len;) {
                const take = Math.min(blockLen - this.pos, len - pos);
                // Fast path: we have at least one block in input, cast it to view and process
                if (take === blockLen) {
                    const dataView = createView(data);
                    for (; blockLen <= len - pos; pos += blockLen)
                        this.process(dataView, pos);
                    continue;
                }
                buffer.set(data.subarray(pos, pos + take), this.pos);
                this.pos += take;
                pos += take;
                if (this.pos === blockLen) {
                    this.process(view, 0);
                    this.pos = 0;
                }
            }
            this.length += data.length;
            this.roundClean();
            return this;
        }
        digestInto(out) {
            aexists(this);
            aoutput(out, this);
            this.finished = true;
            // Padding
            // We can avoid allocation of buffer for padding completely if it
            // was previously not allocated here. But it won't change performance.
            const { buffer, view, blockLen, isLE } = this;
            let { pos } = this;
            // append the bit '1' to the message
            buffer[pos++] = 0b10000000;
            clean(this.buffer.subarray(pos));
            // we have less than padOffset left in buffer, so we cannot put length in
            // current block, need process it and pad again
            if (this.padOffset > blockLen - pos) {
                this.process(view, 0);
                pos = 0;
            }
            // Pad until full block byte with zeros
            for (let i = pos; i < blockLen; i++)
                buffer[i] = 0;
            // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
            // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
            // So we just write lowest 64 bits of that value.
            setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
            this.process(view, 0);
            const oview = createView(out);
            const len = this.outputLen;
            // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
            if (len % 4)
                throw new Error('_sha2: outputLen should be aligned to 32bit');
            const outLen = len / 4;
            const state = this.get();
            if (outLen > state.length)
                throw new Error('_sha2: outputLen bigger than state');
            for (let i = 0; i < outLen; i++)
                oview.setUint32(4 * i, state[i], isLE);
        }
        digest() {
            const { buffer, outputLen } = this;
            this.digestInto(buffer);
            const res = buffer.slice(0, outputLen);
            this.destroy();
            return res;
        }
        _cloneInto(to) {
            to || (to = new this.constructor());
            to.set(...this.get());
            const { blockLen, buffer, length, finished, destroyed, pos } = this;
            to.destroyed = destroyed;
            to.finished = finished;
            to.length = length;
            to.pos = pos;
            if (length % blockLen)
                to.buffer.set(buffer);
            return to;
        }
        clone() {
            return this._cloneInto();
        }
    }

    /**

    SHA1 (RFC 3174), MD5 (RFC 1321) and RIPEMD160 (RFC 2286) legacy, weak hash functions.
    Don't use them in a new protocol. What "weak" means:

    - Collisions can be made with 2^18 effort in MD5, 2^60 in SHA1, 2^80 in RIPEMD160.
    - No practical pre-image attacks (only theoretical, 2^123.4)
    - HMAC seems kinda ok: https://datatracker.ietf.org/doc/html/rfc6151
     * @module
     */
    /** Initial SHA1 state */
    const SHA1_IV = /* @__PURE__ */ Uint32Array.from([
        0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
    ]);
    // Reusable temporary buffer
    const SHA1_W = /* @__PURE__ */ new Uint32Array(80);
    /** SHA1 legacy hash class. */
    class SHA1 extends HashMD {
        constructor() {
            super(64, 20, 8, false);
            this.A = SHA1_IV[0] | 0;
            this.B = SHA1_IV[1] | 0;
            this.C = SHA1_IV[2] | 0;
            this.D = SHA1_IV[3] | 0;
            this.E = SHA1_IV[4] | 0;
        }
        get() {
            const { A, B, C, D, E } = this;
            return [A, B, C, D, E];
        }
        set(A, B, C, D, E) {
            this.A = A | 0;
            this.B = B | 0;
            this.C = C | 0;
            this.D = D | 0;
            this.E = E | 0;
        }
        process(view, offset) {
            for (let i = 0; i < 16; i++, offset += 4)
                SHA1_W[i] = view.getUint32(offset, false);
            for (let i = 16; i < 80; i++)
                SHA1_W[i] = rotl(SHA1_W[i - 3] ^ SHA1_W[i - 8] ^ SHA1_W[i - 14] ^ SHA1_W[i - 16], 1);
            // Compression function main loop, 80 rounds
            let { A, B, C, D, E } = this;
            for (let i = 0; i < 80; i++) {
                let F, K;
                if (i < 20) {
                    F = Chi(B, C, D);
                    K = 0x5a827999;
                }
                else if (i < 40) {
                    F = B ^ C ^ D;
                    K = 0x6ed9eba1;
                }
                else if (i < 60) {
                    F = Maj(B, C, D);
                    K = 0x8f1bbcdc;
                }
                else {
                    F = B ^ C ^ D;
                    K = 0xca62c1d6;
                }
                const T = (rotl(A, 5) + F + E + K + SHA1_W[i]) | 0;
                E = D;
                D = C;
                C = rotl(B, 30);
                B = A;
                A = T;
            }
            // Add the compressed chunk to the current hash value
            A = (A + this.A) | 0;
            B = (B + this.B) | 0;
            C = (C + this.C) | 0;
            D = (D + this.D) | 0;
            E = (E + this.E) | 0;
            this.set(A, B, C, D, E);
        }
        roundClean() {
            clean(SHA1_W);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0);
            clean(this.buffer);
        }
    }
    /** SHA1 (RFC 3174) legacy hash function. It was cryptographically broken. */
    const sha1$1 = /* @__PURE__ */ createHasher(() => new SHA1());

    /**
     * SHA1 (RFC 3174) legacy hash function.
     * @module
     * @deprecated
     */
    /** @deprecated Use import from `noble/hashes/legacy` module */
    const sha1 = sha1$1;

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
    // Platform-specific randomBytes implementation
    function getRandomBytes(size) {
        // Browser environment check - use Web Crypto API
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const bytes = new Uint8Array(size);
            crypto.getRandomValues(bytes);
            return bytes;
        }
        // Node.js environment check - use process object as indicator
        if (typeof process !== 'undefined' &&
            process.versions &&
            process.versions.node) {
            try {
                // Try to access Node.js crypto via global require (if available)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const nodeCrypto = globalThis.require?.('crypto');
                if (nodeCrypto && nodeCrypto.randomBytes) {
                    return new Uint8Array(nodeCrypto.randomBytes(size));
                }
            }
            catch {
                // Ignore error and continue to next attempt
            }
            // For bundled environments, throw a descriptive error
            throw new Error('Node.js crypto module not available in bundled environment. Please use native Node.js or ensure crypto polyfill is available.');
        }
        throw new Error('No secure random number generator available. Please use a browser with Web Crypto API or Node.js environment.');
    }
    // Web APIs are available in both browser and Node.js environments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TextEncoder$1 = globalThis.TextEncoder;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TextDecoder = globalThis.TextDecoder;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const btoa = globalThis.btoa;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const atob = globalThis.atob;
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
        static stringToBytes(str) {
            return new TextEncoder$1().encode(str);
        }
        /**
         * Convert bytes to hex string (crypto-js compatible)
         */
        static bytesToHex(bytes) {
            return Array.from(bytes)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        /**
         * Convert hex string to bytes (crypto-js compatible)
         */
        static hexToBytes(hex) {
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
            }
            return bytes;
        }
        /**
         * Convert bytes to Base64 string (crypto-js compatible)
         */
        static bytesToBase64(bytes) {
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
        /**
         * Convert Base64 string to bytes (crypto-js compatible)
         */
        static base64ToBytes(base64) {
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
        static encrypt(data, password) {
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
        static decrypt(payload, password) {
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
            let decrypted;
            try {
                decrypted = cipher.decrypt(encrypted);
            }
            catch {
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
    class AccountQR extends QRCode {
        accountPrivateKey;
        networkType;
        generationHash;
        password;
        /**
         * Construct an Account QR Code out of the
         * symbol private key.
         *
         * @param   accountPrivateKey  {string}
         * @param   password        {string}
         * @param   networkType     {INetworkType}
         * @param   generationHash  {string}
         */
        constructor(
        /**
         * The account to be exported
         * @var {Account}
         */
        accountPrivateKey, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The network generation hash.
         * @var {string}
         */
        generationHash, 
        /**
         * Optional password for encryption when not provided means non-password-protected
         * @var {string=}
         */
        password) {
            super(exports.QRCodeType.ExportAccount, networkType, generationHash, password !== undefined);
            this.accountPrivateKey = accountPrivateKey;
            this.networkType = networkType;
            this.generationHash = generationHash;
            this.password = password;
        }
        /**
         * Parse a JSON QR code content into a AccountQR
         * object.
         *
         * @param   json        {string}
         * @param   password    {string=} Optional password
         * @return  {AccountQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, password) {
            // create the QRCode object from JSON
            return ExportAccountDataSchema.parse(json, password);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @see {QRUtil.MAX_LENGTH}
         * @return {number}
         */
        getTypeNumber() {
            // Type version for AccountQR is Version 15, uses correction level M
            // This type of QR can hold up to 412 binary bytes.
            return 15;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new ExportAccountDataSchema();
        }
    }

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
    class ContactQR extends QRCode {
        name;
        accountPublicKey;
        networkType;
        generationHash;
        /**
         * Construct a Contact QR Code out of the
         * symbol public key.
         *
         * @param name the contact name.
         * @param   accountPublicKey         the public key
         * @param   networkType     {INetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The contact name.
         * @var {string}
         */
        name, 
        /**
         * The account public key.
         */
        accountPublicKey, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The network generation hash.
         * @var {string}
         */
        generationHash) {
            super(exports.QRCodeType.AddContact, networkType, generationHash);
            this.name = name;
            this.accountPublicKey = accountPublicKey;
            this.networkType = networkType;
            this.generationHash = generationHash;
        }
        /**
         * Parse a JSON QR code content into a ContactQR
         * object.
         *
         * @param   json        {string}
         * @return  {ContactQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json) {
            // create the QRCode object from JSON
            return AddContactDataSchema.parse(json);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for ContactQR is Version 15, uses correction level M
            // This type of QR can hold up to 412 binary bytes.
            return 15;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new AddContactDataSchema();
        }
    }

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
    /**
     * Class `ExportAddressDataSchema` describes a contact
     * add QR code data schema.
     *
     * @since 0.3.0
     */
    class ExportAddressDataSchema extends QRCodeDataSchema {
        constructor() {
            super();
        }
        /**
         * The `getData()` method returns an object
         * that will be stored in the `data` field of
         * the underlying QR Code JSON content.
         *
         * @return {any}
         */
        getData(qr) {
            return {
                name: qr.name,
                address: qr.accountAddress,
            };
        }
        /**
         * Parse a JSON QR code content into a ContactQR
         * object.
         *
         * @param   json    {string}
         * @return  {AddressQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static parse(json) {
            if (!json.length) {
                throw Error('JSON argument cannot be empty.');
            }
            const jsonObj = JSON.parse(json);
            if (!jsonObj.type || jsonObj.type !== exports.QRCodeType.ExportAddress) {
                throw Error('Invalid type field value for AddressQR.');
            }
            // read contact data
            const name = jsonObj.data.name;
            const network = jsonObj.network_id;
            const generationHash = jsonObj.chain_id;
            return new AddressQR(name, jsonObj.data.address, network, generationHash);
        }
    }

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
    class AddressQR extends QRCode {
        name;
        accountAddress;
        networkType;
        generationHash;
        /**
         * Construct a Address QR Code out of the
         * symbol public key.
         *
         * @param name the address name.
         * @param   accountPublicKey         the public key
         * @param   networkType     {INetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The address name.
         * @var {string}
         */
        name, 
        /**
         * The account address.
         */
        accountAddress, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The network generation hash.
         * @var {string}
         */
        generationHash) {
            super(exports.QRCodeType.ExportAddress, networkType, generationHash);
            this.name = name;
            this.accountAddress = accountAddress;
            this.networkType = networkType;
            this.generationHash = generationHash;
        }
        /**
         * Parse a JSON QR code content into an AddressQR
         * object.
         *
         * @param   json        {string}
         * @return  {AddressQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json) {
            // create the QRCode object from JSON
            return ExportAddressDataSchema.parse(json);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for AddressQR is Version 15, uses correction level M
            // This type of QR can hold up to 412 binary bytes.
            return 15;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new ExportAddressDataSchema();
        }
    }

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
    class ObjectQR extends QRCode {
        object;
        networkType;
        generationHash;
        /**
         * Construct a Object QR Code out of the
         * JSON object.
         *
         * @param   object          {Object}
         * @param   networkType     {INetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The object to display
         * @var {Object}
         */
        object, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The network generation hash.
         * @var {string}
         */
        generationHash) {
            super(exports.QRCodeType.ExportObject, networkType, generationHash);
            this.object = object;
            this.networkType = networkType;
            this.generationHash = generationHash;
        }
        /**
         * Parse a JSON QR code content into a ObjectQR
         * object.
         *
         * @param   json        {string}
         * @return  {ObjectQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json) {
            // create the QRCode object from JSON
            return ExportObjectDataSchema.parse(json);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for ContactQR is Version 10, uses correction level M
            // This type of QR can hold up to 213 bytes of data.
            return 10;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new ExportObjectDataSchema();
        }
    }

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
    class TransactionQR extends QRCode {
        transaction;
        networkType;
        generationHash;
        type;
        /**
         * Construct a Transaction Request QR Code out of the
         * symbol-sdk Transaction instance.
         *
         * @param   transaction     {Transaction}
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The transaction for the request.
         * @var {Transaction}
         */
        transaction, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The chain Id.
         * @var {string}
         */
        generationHash, 
        /**
         * The QR Code Type
         *
         * @var {QRCodeType}
         */
        type = exports.QRCodeType.RequestTransaction) {
            super(type, networkType, generationHash);
            this.transaction = transaction;
            this.networkType = networkType;
            this.generationHash = generationHash;
            this.type = type;
        }
        /**
         * Parse a JSON QR code content into a TransactionQR
         * object.
         *
         * @param   json        {string}
         * @param   transactionCreateFromPayload the transaction parser that creates a transaction from a binary payload.
         * @return  {TransactionQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, transactionCreateFromPayload) {
            // create the QRCode object from JSON
            return RequestTransactionDataSchema.parse(json, transactionCreateFromPayload);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for ContactQR is Version 40, uses correction level L
            // This type of QR can hold up to 2953 bytes of data.
            return 40;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new RequestTransactionDataSchema();
        }
    }

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
    class CosignatureQR extends TransactionQR {
        /**
         * Construct a Transaction Request QR Code out of the
         * symbol-sdk Transaction instance.
         *
         * @param   transaction     {ITransaction}
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         */
        constructor(
        /**
         * The transaction for the request.
         * @var {AggregateTransaction}
         */
        transaction, 
        /**
         * The network type.
         * @var {NetworkType}
         */
        networkType, 
        /**
         * The network generation hash.
         * @var {string}
         */
        generationHash) {
            super(transaction, networkType, generationHash, exports.QRCodeType.RequestCosignature);
        }
        /**
         * Parse a JSON QR code content into a CosignatureQR
         * object.
         *
         * @param   json        {string}
         * @param   transactionCreateFromPayload the transaction parser that creates a transaction from a binary payload.
         * @return  {CosignatureQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, transactionCreateFromPayload) {
            // create the QRCode object from JSON
            return RequestCosignatureDataSchema.parse(json, transactionCreateFromPayload);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @return {number}
         */
        getTypeNumber() {
            // Type version for ContactQR is Version 40, uses correction level L
            // This type of QR can hold up to 2953 bytes of data.
            return 40;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new RequestCosignatureDataSchema();
        }
    }

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
    class MnemonicQR extends QRCode {
        mnemonicPlainText;
        networkType;
        generationHash;
        password;
        /**
         * Construct a Mnemonic Export QR Code out of the
         * MnemonicPassPhrase and Password instances.
         *
         * @param   mnemonic        {string}
         * @param   password        {Password}
         * @param   networkType     {NetworkType}
         * @param   generationHash  {string}
         */
        constructor(
        /**
         * The mnemonic pass phrase to be exported
         */
        mnemonicPlainText, 
        /**
         * The network type.
         */
        networkType, 
        /**
         * The network generation hash.
         */
        generationHash, 
        /**
         * Optional password for encryption when not provided means non-password-protected
         * @var {string}
         */
        password) {
            super(exports.QRCodeType.ExportMnemonic, networkType, generationHash, password !== undefined);
            this.mnemonicPlainText = mnemonicPlainText;
            this.networkType = networkType;
            this.generationHash = generationHash;
            this.password = password;
        }
        /**
         * Parse a JSON QR code content into a MnemonicQR
         * object.
         *
         * @param   json        {string}
         * @param   password    {string=} Optional password
         * @return  {MnemonicQR}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, password) {
            // create the QRCode object from JSON
            return ExportMnemonicDataSchema.parse(json, password);
        }
        /**
         * The `getTypeNumber()` method should return the
         * version number for QR codes of the underlying class.
         *
         * @see https://en.wikipedia.org/wiki/QR_code#Storage
         * @see {QRUtil.MAX_LENGTH}
         * @return {number}
         */
        getTypeNumber() {
            // Type version for MnemonicQR is Version 20, uses correction level M
            // This type of QR can hold up to 666 binary bytes.
            return 20;
        }
        /**
         * The `getSchema()` method should return an instance
         * of a sub-class of QRCodeDataSchema which describes
         * the QR Code data.
         *
         * @return {QRCodeDataSchema}
         */
        getSchema() {
            return new ExportMnemonicDataSchema();
        }
    }

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
    /**
     * Class `QRCodeGenerator` describes a NIP-7 compliant QR Code
     * generator (factory).
     *
     * @since 0.2.0
     */
    class QRCodeGenerator {
        /**
         * Factory/Singleton pattern, constructor is private.
         *
         * @access private
         */
        constructor() { }
        /**
         * Create a JSON object QR Code from a JSON object.
         *
         * @see {ObjectQR}
         * @param   object          {Object}
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         */
        static createExportObject(object, networkType, generationHash) {
            return new ObjectQR(object, networkType, generationHash);
        }
        /**
         * Create an Address QR Code from a contact name
         * and address.
         *
         * @see {AddressQR}
         * @param   name the name
         * @param   address     the account address
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         */
        static createExportAddress(name, address, networkType, generationHash) {
            return new AddressQR(name, address, networkType, generationHash);
        }
        /**
         * Create a Contact QR Code from a contact name
         * and account.
         *
         * @see {ContactQR}
         * @param   name the name
         * @param   accountPublicKey     the account public key
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         */
        static createAddContact(name, accountPublicKey, networkType, generationHash) {
            return new ContactQR(name, accountPublicKey, networkType, generationHash);
        }
        /**
         * Create an Account Export QR Code from an Account
         * instance, encrypted with given password.
         *
         * @see {AccountQR}
         * @param   accountPrivateKey    the account private key.
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         * @param   password        {string=}
         */
        static createExportAccount(accountPrivateKey, networkType, generationHash, password) {
            return new AccountQR(accountPrivateKey, networkType, generationHash, password);
        }
        /**
         * Create a Transaction Request QR Code from a Transaction
         * instance.
         *
         * @see {TransactionQR}
         * @param   transaction     {Transaction}
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         */
        static createTransactionRequest(transaction, networkType, generationHash) {
            return new TransactionQR(transaction, networkType, generationHash);
        }
        /**
         * Create a Mnemonic Export QR Code from a MnemonicPassPhrase
         * instance, encrypted with given password.
         *
         * @see {MnemonicQR}
         * @param   networkType     {NetworkType}
         * @param   generationHash         {string}
         * @param   password        {string=}
         */
        static createExportMnemonic(mnemonicPlainText, networkType, generationHash, password) {
            return new MnemonicQR(mnemonicPlainText, networkType, generationHash, password);
        }
        /**
         * Parse a JSON QR code content into a sub-class
         * of QRCode.
         *
         * @param   json    {string}
         * @param   transactionCreateFromPayload the transaction factory to create ITransaction from a binary payload if the qr is a transaction based one.
         * @param   password to decrypt private keys.
         * @param signedTransactionCreateFromPayload
         * @param cosignatureSignedTransactionCreateFromPayload
         * @return  {QRCode}
         * @throws  {Error}     On empty `json` given.
         * @throws  {Error}     On missing `type` field value.
         * @throws  {Error}     On unrecognized QR code `type` field value.
         */
        static fromJSON(json, transactionCreateFromPayload, password, signedTransactionCreateFromPayload, cosignatureSignedTransactionCreateFromPayload) {
            if (!json.length) {
                throw new Error('JSON argument cannot be empty.');
            }
            let jsonObject;
            try {
                jsonObject = JSON.parse(json);
                if (!jsonObject.type) {
                    throw new Error('Missing mandatory field with name "type".');
                }
            }
            catch (e) {
                // Invalid JSON provided, forward error
                throw new Error(e instanceof Error ? e.message : String(e));
            }
            // We will use the `fromJSON` static implementation
            // of specialized QRCode classes (child classes).
            // An error will be thrown if the QRCodeType is not
            // recognized or invalid.
            switch (jsonObject.type) {
                // create a ContactQR from JSON
                case exports.QRCodeType.AddContact:
                    return ContactQR.fromJSON(json);
                // create a AddressQR from JSON
                case exports.QRCodeType.ExportAddress:
                    return AddressQR.fromJSON(json);
                // create an AccountQR from JSON
                case exports.QRCodeType.ExportAccount:
                    return AccountQR.fromJSON(json, password);
                // create a ObjectQR from JSON
                case exports.QRCodeType.ExportObject:
                    return ObjectQR.fromJSON(json);
                // create a CosignatureQR from JSON
                case exports.QRCodeType.RequestCosignature:
                    return CosignatureQR.fromJSON(json, transactionCreateFromPayload);
                // create a TransactionQR from JSON
                case exports.QRCodeType.RequestTransaction:
                    return TransactionQR.fromJSON(json, transactionCreateFromPayload);
                // create an MnemonicQR from JSON
                case exports.QRCodeType.ExportMnemonic:
                    return MnemonicQR.fromJSON(json, password);
                // create an SignedTransactionQR from JSON
                case exports.QRCodeType.SignedTransaction:
                    if (!signedTransactionCreateFromPayload) {
                        throw new Error('signedTransactionCreateFromPayload is required for SignedTransaction QR codes');
                    }
                    return SignedTransactionQR.fromJSON(json, signedTransactionCreateFromPayload);
                // create an SignedTransactionQR from JSON
                case exports.QRCodeType.CosignatureSignedTransaction:
                    if (!cosignatureSignedTransactionCreateFromPayload) {
                        throw new Error('cosignatureSignedTransactionCreateFromPayload is required for CosignatureSignedTransaction QR codes');
                    }
                    return CosignatureSignedTransactionQR.fromJSON(json, cosignatureSignedTransactionCreateFromPayload);
            }
            throw new Error("Unrecognized QR Code 'type': '" + jsonObject.type + "'.");
        }
    }

    exports.AccountQR = AccountQR;
    exports.AddContactDataSchema = AddContactDataSchema;
    exports.AddressQR = AddressQR;
    exports.ContactQR = ContactQR;
    exports.CosignatureQR = CosignatureQR;
    exports.CosignatureSignedTransactionDataSchema = CosignatureSignedTransactionDataSchema;
    exports.CosignatureSignedTransactionQR = CosignatureSignedTransactionQR;
    exports.EncryptedPayload = EncryptedPayload;
    exports.EncryptionService = EncryptionService;
    exports.ExportAccountDataSchema = ExportAccountDataSchema;
    exports.ExportMnemonicDataSchema = ExportMnemonicDataSchema;
    exports.ExportObjectDataSchema = ExportObjectDataSchema;
    exports.MnemonicQR = MnemonicQR;
    exports.ObjectQR = ObjectQR;
    exports.QRCode = QRCode;
    exports.QRCodeDataSchema = QRCodeDataSchema;
    exports.QRCodeGenerator = QRCodeGenerator;
    exports.QRCodeSettings = QRCodeSettings;
    exports.RequestCosignatureDataSchema = RequestCosignatureDataSchema;
    exports.RequestTransactionDataSchema = RequestTransactionDataSchema;
    exports.SignedTransactionDataSchema = SignedTransactionDataSchema;
    exports.SignedTransactionQR = SignedTransactionQR;
    exports.TransactionQR = TransactionQR;

}));
//# sourceMappingURL=symbol-qr-library-esm.umd.js.map
