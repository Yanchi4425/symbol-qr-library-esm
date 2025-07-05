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
 * An alias of the symbol's network type.
 */
type INetworkType = number;

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
 * An abstraction of the sdk's transaction object to avoid the dependency.
 */
interface ITransaction {
    /**
     * It returns the catbuffer binary hex of the transaction.
     */
    serialize(): string;
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
declare enum QRCodeType {
    AddContact = 1,
    ExportAccount = 2,
    RequestTransaction = 3,
    RequestCosignature = 4,
    ExportMnemonic = 5,
    ExportObject = 6,
    ExportAddress = 7,
    SignedTransaction = 8,
    CosignatureSignedTransaction = 9
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
type CorrectionLevel = 'high' | 'quartile' | 'medium' | 'low' | 'H' | 'Q' | 'M' | 'L' | undefined;
/**
 * Class `QRCodeSettings` describes rules for QR Code data generation
 * (ESM version - simplified for data generation only).
 *
 * @since 1.0.0 (ESM migration)
 */
declare class QRCodeSettings {
    readonly correctionLevel: CorrectionLevel;
    /**
     * The Error correction level for QR Code generation.
     *
     * @var {CorrectionLevel}
     */
    static CORRECTION_LEVEL: CorrectionLevel;
    /**
     * Constructor for QR code settings
     */
    constructor(correctionLevel?: CorrectionLevel);
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

declare abstract class QRCode implements QRCodeInterface {
    /**
     * The QR Code type.
     * @var {QRCodeType}
     */
    readonly type: QRCodeType;
    /**
     * The network ID.
     * @var {INetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The network generation hash.
     * @var {string}
     */
    readonly generationHash: string;
    /**
     * Whether the data is encrypted
     * @var {boolean}
     */
    readonly encrypted: boolean;
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
    type: QRCodeType, 
    /**
     * The network ID.
     * @var {INetworkType}
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     * @var {string}
     */
    generationHash: string, 
    /**
     * Whether the data is encrypted
     * @var {boolean}
     */
    encrypted?: boolean);
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    abstract getSchema(): QRCodeDataSchema;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @return {number}
     */
    abstract getTypeNumber(): number;
    /**
     * The `getCorrectionLevel()` method should return the
     * QR Code correction level.
     *
     * Sub-classes may overload this method to provide with
     * a different correction level.
     *
     * @return {CorrectionLevel}
     */
    getCorrectionLevel(): CorrectionLevel;
    /**
     * The `toJSON()` method should return the JSON
     * representation of the QR Code content.
     *
     * @return {string}
     */
    toJSON(): string;
    /**
     * The `toQRData()` method returns the structured data object
     * for QR Code generation by external libraries.
     *
     * @return {QRCodeData}
     */
    toQRData(): QRCodeData;
    /**
     * The `getDisplayText()` method returns a human-readable
     * text representation of the QR Code content.
     *
     * @return {string}
     */
    getDisplayText(): string;
    /**
     * The `validate()` method validates the QR Code data
     * integrity and returns true if valid.
     *
     * @return {boolean}
     */
    validate(): boolean;
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

/**
 * Class `QRCodeDataSchema` describes a QR Code's data
 * schema. The schema defines obligatory fields and their
 * format.
 *
 * @since 0.3.0
 */
declare abstract class QRCodeDataSchema {
    /**
     * The AccountQR QR Code version
     *
     * @var {number}
     */
    readonly VERSION = 3;
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    abstract getData(qr: QRCode): any;
    /**
     * The `toObject()` method returns a JSON object
     * with required fields.
     *
     * @return {any}
     */
    toObject(qr: QRCode): any;
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

/**
 * Class `AddContactDataSchema` describes a contact
 * add QR code data schema.
 *
 * @since 0.3.0
 */
declare class AddContactDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    getData(qr: ContactQR): any;
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
    static parse(json: string): ContactQR;
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

/**
 * Class `ExportAccountDataSchema` describes an export
 * account QR code data schema.
 *
 * @since 0.3.0
 */
declare class ExportAccountDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    getData(qr: AccountQR): any;
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
    static parse(json: string, password?: string): AccountQR;
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

/**
 * Class `ExportMnemonicDataSchema` describes an export
 * account QR code data schema.
 *
 * @since 0.3.2
 */
declare class ExportMnemonicDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    getData(qr: MnemonicQR): any;
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
    static parse(json: string, password?: string): MnemonicQR;
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

/**
 * Class `ExportObjectDataSchema` describes an export
 * object QR code data schema.
 *
 * @since 0.3.0
 */
declare class ExportObjectDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    getData(qr: ObjectQR): any;
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
    static parse(json: string): ObjectQR;
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

/**
 * Class `RequestTransactionDataSchema` describes a transaction
 * request QR code data schema.
 *
 * @since 0.3.0
 */
declare class RequestTransactionDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {{payload: string}}
     */
    getData(qr: TransactionQR): {
        payload: string;
    };
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
    static parse(json: string, transactionCreateFromPayload?: (payload: string) => ITransaction): TransactionQR;
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

/**
 * Class `RequestCosignatureDataSchema` describes a transaction
 * cosignature request QR code data schema.
 *
 * @since 0.3.0
 */
declare class RequestCosignatureDataSchema extends RequestTransactionDataSchema {
    constructor();
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
    static parse(json: string, transactionCreateFromPayload: (payload: string) => ITransaction): CosignatureQR;
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
/**
 * An abstraction of the sdk's transaction object to avoid the dependency.
 */
interface ISignedTransaction {
    /**
     * Create DTO object
     */
    toDTO(): any;
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

declare class SignedTransactionQR extends QRCode implements QRCodeInterface {
    /**
     * The transaction for the request.
     * @var {Transaction}
     */
    readonly singedTransaction: ISignedTransaction;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The chain Id.
     * @var {string}
     */
    readonly generationHash: string;
    /**
     * The QR Code Type
     *
     * @var {QRCodeType}
     */
    readonly type: QRCodeType;
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
    singedTransaction: ISignedTransaction, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The chain Id.
     * @var {string}
     */
    generationHash: string, 
    /**
     * The QR Code Type
     *
     * @var {QRCodeType}
     */
    type?: QRCodeType);
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
    static fromJSON(json: string, transactionCreateFromPayload: (payload: string) => ISignedTransaction): SignedTransactionQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

/**
 * Class `SignedTransactionDataSchema` describes a transaction
 * request QR code data schema.
 *
 * @since 0.3.0
 */
declare class SignedTransactionDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    getData(qr: SignedTransactionQR): any;
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
    static parse(json: string, transactionCreateFromPayload: (payload: string) => ISignedTransaction): SignedTransactionQR;
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

declare class CosignatureSignedTransactionQR extends QRCode implements QRCodeInterface {
    /**
     * The transaction for the request.
     * @var {Transaction}
     */
    readonly singedTransaction: any;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The chain Id.
     * @var {string}
     */
    readonly generationHash: string;
    /**
     * The QR Code Type
     *
     * @var {QRCodeType}
     */
    readonly type: QRCodeType;
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
    singedTransaction: any, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The chain Id.
     * @var {string}
     */
    generationHash: string, 
    /**
     * The QR Code Type
     *
     * @var {QRCodeType}
     */
    type?: QRCodeType);
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
    static fromJSON(json: string, transactionCreateFromPayload: (payload: string) => any): CosignatureSignedTransactionQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

/**
 * Class `SignedTransactionDataSchema` describes a transaction
 * request QR code data schema.
 *
 * @since 0.3.0
 */
declare class CosignatureSignedTransactionDataSchema extends QRCodeDataSchema {
    constructor();
    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    getData(qr: CosignatureSignedTransactionQR): any;
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
    static parse(json: string, transactionCreateFromPayload: (payload: string) => any): CosignatureSignedTransactionQR;
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
/**
 * Class `EncryptedPayload` describes an encrypted payload
 * with salt and ciphertext properties.
 *
 * @since 0.3.0
 */
declare class EncryptedPayload {
    /**
     * The payload ciphertext.
     * The first X bytes represent the IV.
     *
     * @var {string}
     */
    readonly ciphertext: string;
    /**
     * The payload salt.
     *
     * @var {string}
     */
    readonly salt: string;
    constructor(
    /**
     * The payload ciphertext.
     * The first X bytes represent the IV.
     *
     * @var {string}
     */
    ciphertext: string, 
    /**
     * The payload salt.
     *
     * @var {string}
     */
    salt: string);
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
    static fromJSON(json: string): EncryptedPayload;
    /**
     * Validates given json string and returns json object
     * @param json
     * @return json object
     * @throws {Error} If validation fails
     */
    private static validateJson;
    /**
     * Checks if the data ojbect is encrypted
     * @param jsonObject
     */
    static isDataEncrypted(jsonObject: any): boolean;
}

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
declare class EncryptionService {
    /**
     * Convert a string to UTF-8 bytes (crypto-js compatible)
     */
    private static stringToBytes;
    /**
     * Convert bytes to hex string (crypto-js compatible)
     */
    private static bytesToHex;
    /**
     * Convert hex string to bytes (crypto-js compatible)
     */
    private static hexToBytes;
    /**
     * Convert bytes to Base64 string (crypto-js compatible)
     */
    private static bytesToBase64;
    /**
     * Convert Base64 string to bytes (crypto-js compatible)
     */
    private static base64ToBytes;
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
    static encrypt(data: string, password: string): EncryptedPayload;
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
    static decrypt(payload: EncryptedPayload, password: string): string;
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

declare class AccountQR extends QRCode implements QRCodeInterface {
    /**
     * The account to be exported
     * @var {Account}
     */
    readonly accountPrivateKey: string;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The network generation hash.
     * @var {string}
     */
    readonly generationHash: string;
    /**
     * Optional password for encryption when not provided means non-password-protected
     * @var {string=}
     */
    readonly password?: string | undefined;
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
    accountPrivateKey: string, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     * @var {string}
     */
    generationHash: string, 
    /**
     * Optional password for encryption when not provided means non-password-protected
     * @var {string=}
     */
    password?: string | undefined);
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
    static fromJSON(json: string, password?: string): AccountQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @see {QRUtil.MAX_LENGTH}
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

declare class ContactQR extends QRCode implements QRCodeInterface {
    /**
     * The contact name.
     * @var {string}
     */
    readonly name: string;
    /**
     * The account public key.
     */
    readonly accountPublicKey: string;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The network generation hash.
     * @var {string}
     */
    readonly generationHash: string;
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
    name: string, 
    /**
     * The account public key.
     */
    accountPublicKey: string, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     * @var {string}
     */
    generationHash: string);
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
    static fromJSON(json: string): ContactQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

declare class AddressQR extends QRCode implements QRCodeInterface {
    /**
     * The address name.
     * @var {string}
     */
    readonly name: string;
    /**
     * The account address.
     */
    readonly accountAddress: string;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The network generation hash.
     * @var {string}
     */
    readonly generationHash: string;
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
    name: string, 
    /**
     * The account address.
     */
    accountAddress: string, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     * @var {string}
     */
    generationHash: string);
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
    static fromJSON(json: string): AddressQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

declare class ObjectQR extends QRCode implements QRCodeInterface {
    /**
     * The object to display
     * @var {Object}
     */
    readonly object: object;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The network generation hash.
     * @var {string}
     */
    readonly generationHash: string;
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
    object: object, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     * @var {string}
     */
    generationHash: string);
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
    static fromJSON(json: string): ObjectQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

declare class TransactionQR extends QRCode implements QRCodeInterface {
    /**
     * The transaction for the request.
     * @var {Transaction}
     */
    readonly transaction: ITransaction;
    /**
     * The network type.
     * @var {NetworkType}
     */
    readonly networkType: INetworkType;
    /**
     * The chain Id.
     * @var {string}
     */
    readonly generationHash: string;
    /**
     * The QR Code Type
     *
     * @var {QRCodeType}
     */
    readonly type: QRCodeType;
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
    transaction: ITransaction, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The chain Id.
     * @var {string}
     */
    generationHash: string, 
    /**
     * The QR Code Type
     *
     * @var {QRCodeType}
     */
    type?: QRCodeType);
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
    static fromJSON(json: string, transactionCreateFromPayload?: (payload: string) => ITransaction): TransactionQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

declare class CosignatureQR extends TransactionQR implements QRCodeInterface {
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
    transaction: ITransaction, 
    /**
     * The network type.
     * @var {NetworkType}
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     * @var {string}
     */
    generationHash: string);
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
    static fromJSON(json: string, transactionCreateFromPayload: (payload: string) => ITransaction): CosignatureQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

declare class MnemonicQR extends QRCode implements QRCodeInterface {
    /**
     * The mnemonic pass phrase to be exported
     */
    readonly mnemonicPlainText: string;
    /**
     * The network type.
     */
    readonly networkType: INetworkType;
    /**
     * The network generation hash.
     */
    readonly generationHash: string;
    /**
     * Optional password for encryption when not provided means non-password-protected
     * @var {string}
     */
    readonly password?: string | undefined;
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
    mnemonicPlainText: string, 
    /**
     * The network type.
     */
    networkType: INetworkType, 
    /**
     * The network generation hash.
     */
    generationHash: string, 
    /**
     * Optional password for encryption when not provided means non-password-protected
     * @var {string}
     */
    password?: string | undefined);
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
    static fromJSON(json: string, password?: string): MnemonicQR;
    /**
     * The `getTypeNumber()` method should return the
     * version number for QR codes of the underlying class.
     *
     * @see https://en.wikipedia.org/wiki/QR_code#Storage
     * @see {QRUtil.MAX_LENGTH}
     * @return {number}
     */
    getTypeNumber(): number;
    /**
     * The `getSchema()` method should return an instance
     * of a sub-class of QRCodeDataSchema which describes
     * the QR Code data.
     *
     * @return {QRCodeDataSchema}
     */
    getSchema(): QRCodeDataSchema;
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

/**
 * Class `QRCodeGenerator` describes a NIP-7 compliant QR Code
 * generator (factory).
 *
 * @since 0.2.0
 */
declare class QRCodeGenerator {
    /**
     * Factory/Singleton pattern, constructor is private.
     *
     * @access private
     */
    private constructor();
    /**
     * Create a JSON object QR Code from a JSON object.
     *
     * @see {ObjectQR}
     * @param   object          {Object}
     * @param   networkType     {NetworkType}
     * @param   generationHash         {string}
     */
    static createExportObject(object: object, networkType: INetworkType, generationHash: string): ObjectQR;
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
    static createExportAddress(name: string, address: string, networkType: INetworkType, generationHash: string): AddressQR;
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
    static createAddContact(name: string, accountPublicKey: string, networkType: INetworkType, generationHash: string): ContactQR;
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
    static createExportAccount(accountPrivateKey: string, networkType: INetworkType, generationHash: string, password?: string): AccountQR;
    /**
     * Create a Transaction Request QR Code from a Transaction
     * instance.
     *
     * @see {TransactionQR}
     * @param   transaction     {Transaction}
     * @param   networkType     {NetworkType}
     * @param   generationHash         {string}
     */
    static createTransactionRequest(transaction: ITransaction, networkType: INetworkType, generationHash: string): TransactionQR;
    /**
     * Create a Mnemonic Export QR Code from a MnemonicPassPhrase
     * instance, encrypted with given password.
     *
     * @see {MnemonicQR}
     * @param   networkType     {NetworkType}
     * @param   generationHash         {string}
     * @param   password        {string=}
     */
    static createExportMnemonic(mnemonicPlainText: string, networkType: INetworkType, generationHash: string, password: string): MnemonicQR;
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
    static fromJSON(json: string, transactionCreateFromPayload: (payload: string) => ITransaction, password?: string, signedTransactionCreateFromPayload?: (payload: string) => ISignedTransaction, cosignatureSignedTransactionCreateFromPayload?: (payload: string) => any): QRCode;
}

export { AccountQR, AddContactDataSchema, AddressQR, ContactQR, CosignatureQR, CosignatureSignedTransactionDataSchema, CosignatureSignedTransactionQR, EncryptedPayload, EncryptionService, ExportAccountDataSchema, ExportMnemonicDataSchema, ExportObjectDataSchema, MnemonicQR, ObjectQR, QRCode, QRCodeDataSchema, QRCodeGenerator, QRCodeSettings, QRCodeType, RequestCosignatureDataSchema, RequestTransactionDataSchema, SignedTransactionDataSchema, SignedTransactionQR, TransactionQR };
export type { CorrectionLevel, INetworkType, ITransaction, QRCodeData, QRCodeInterface };
