import {Address} from "viem";

/**
 *  A [[HexString]] whose length is even, which ensures it is a valid
 *  representation of binary data.
 */
export type DataHexString = string;

/**
 *  A string which is prefixed with ``0x`` and followed by any number
 *  of case-agnostic hexadecimal characters.
 *
 *  It must match the regular expression ``/0x[0-9A-Fa-f]*\/``.
 */
export type HexString = string;

/**
 *  An object that can be used to represent binary data.
 */
export type BytesLike = DataHexString | Uint8Array;

function _getBytes(value: BytesLike, copy?: boolean): Uint8Array {
    if (value instanceof Uint8Array) {
        if (copy) {
            return new Uint8Array(value);
        }
        return value;
    }

    if (value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
        const result = new Uint8Array((value.length - 2) / 2);
        let offset = 2;
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(value.substring(offset, offset + 2), 16);
            offset += 2;
        }
        return result;
    }
    throw new Error("invalid BytesLike value");
}

/**
 *  Get a typed Uint8Array for %%value%%. If already a Uint8Array
 *  the original %%value%% is returned; if a copy is required use
 *  [[getBytesCopy]].
 *
 *  @see: getBytesCopy
 */
export function getBytes(value: BytesLike): Uint8Array {
    return _getBytes(value, false);
}

/**
 *  Get a typed Uint8Array for %%value%%, creating a copy if necessary
 *  to prevent any modifications of the returned value from being
 *  reflected elsewhere.
 *
 *  @see: getBytes
 */
export function getBytesCopy(value: BytesLike): Uint8Array {
    return _getBytes(value, true);
}

/**
 *  Returns true if %%value%% is a valid [[HexString]].
 *
 *  If %%length%% is ``true`` or a //number//, it also checks that
 *  %%value%% is a valid [[DataHexString]] of %%length%% (if a //number//)
 *  bytes of data (e.g. ``0x1234`` is 2 bytes).
 */
export function isHexString(value: any, length?: number | boolean): value is Address {
    if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }

    if (typeof length === "number" && value.length !== 2 + 2 * length) {
        return false;
    }
    if (length === true && value.length % 2 !== 0) {
        return false;
    }

    return true;
}

/**
 *  Returns true if %%value%% is a valid representation of arbitrary
 *  data (i.e. a valid [[DataHexString]] or a Uint8Array).
 */
export function isBytesLike(value: any): value is BytesLike {
    return isHexString(value, true) || value instanceof Uint8Array;
}

const HexCharacters = "0123456789abcdef";

/**
 *  Returns a [[DataHexString]] representation of %%data%%.
 */
export function hexlify(data: BytesLike): string {
    const bytes = getBytes(data);

    let result = "0x";
    for (let i = 0; i < bytes.length; i++) {
        const v = bytes[i];
        result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
}

/**
 *  Returns a [[DataHexString]] by concatenating all values
 *  within %%data%%.
 */
export function concat(datas: ReadonlyArray<BytesLike>): string {
    return "0x" + datas.map((d) => hexlify(d).substring(2)).join("");
}

/**
 *  Returns the length of %%data%%, in bytes.
 */
export function dataLength(data: BytesLike): number {
    if (isHexString(data, true)) {
        return (data.length - 2) / 2;
    }
    return getBytes(data).length;
}

function zeroPad(data: BytesLike, length: number, left: boolean): string {
    const bytes = getBytes(data);

    const result = new Uint8Array(length);
    result.fill(0);
    if (left) {
        result.set(bytes, length - bytes.length);
    } else {
        result.set(bytes, 0);
    }

    return hexlify(result);
}

/**
 *  Return the [[DataHexString]] of %%data%% padded on the **left**
 *  to %%length%% bytes.
 *
 *  If %%data%% already exceeds %%length%%, a [[BufferOverrunError]] is
 *  thrown.
 *
 *  This pads data the same as **values** are in Solidity
 *  (e.g. ``uint128``).
 */
export function zeroPadValue(data: BytesLike, length: number): string {
    return zeroPad(data, length, true);
}

/**
 *  Return the [[DataHexString]] of %%data%% padded on the **right**
 *  to %%length%% bytes.
 *
 *  If %%data%% already exceeds %%length%%, a [[BufferOverrunError]] is
 *  thrown.
 *
 *  This pads data the same as **bytes** are in Solidity
 *  (e.g. ``bytes16``).
 */
export function zeroPadBytes(data: BytesLike, length: number): string {
    return zeroPad(data, length, false);
}
