import { stringToHex } from 'viem';
import { ERC8021_MARKER, DEFAULT_APP_CODE, DEFAULT_SCHEMA_ID } from './constants';

/**
 * Generates an ERC-8021 compliant suffix for the given attribution code.
 * Implements Schema 0 by default.
 * @param code The attribution code (e.g. from Base.dev).
 * @returns A hex string conforming to ERC-8021.
 */
export function generateAttributionSuffix(code: string = DEFAULT_APP_CODE): `0x${string}` {
  const codeHex = stringToHex(code).replace('0x', '');
  // codesLength is parsing length of the code string
  const codeLengthHex = code.length.toString(16).padStart(2, '0');
  const schemaIdHex = DEFAULT_SCHEMA_ID.toString(16).padStart(2, '0');
  
  return `0x${codeHex}${codeLengthHex}${schemaIdHex}${ERC8021_MARKER}` as `0x${string}`;
}
