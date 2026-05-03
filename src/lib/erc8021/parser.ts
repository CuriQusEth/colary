import { hexToString } from 'viem';
import { SchemaData } from './types';
import { ERC8021_MARKER } from './constants';

export function parseTransactionAttribution(callData: string): SchemaData | null {
  const cleanHex = callData.replace('0x', '');
  
  if (!cleanHex.endsWith(ERC8021_MARKER)) {
    return null;
  }

  try {
    const withoutMarker = cleanHex.slice(0, -32);
    const schemaIdHex = withoutMarker.slice(-2);
    const schemaId = parseInt(schemaIdHex, 16);
    
    if (schemaId === 0) {
      const codesLengthHex = withoutMarker.slice(-4, -2);
      const codesLength = parseInt(codesLengthHex, 16);
      const codesHex = withoutMarker.slice(-(4 + codesLength * 2), -4);
      
      const codesString = hexToString(`0x${codesHex}`);
      return { schemaId, codes: codesString.split(',') };
    }
    
    return { schemaId }; // Basic fallback for schemas 1 and 2 currently
  } catch (err) {
    console.error("Failed to parse ERC-8021 suffix", err);
    return null;
  }
}
