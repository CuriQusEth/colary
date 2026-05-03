import { ERC8021ValidationLevel } from './types';
import { ERC8021_MARKER } from './constants';

export function validateERC8021Suffix(
  suffixHex: string,
  level: ERC8021ValidationLevel = 'Standard'
): boolean {
  if (!suffixHex.startsWith('0x')) return false;
  
  const cleanHex = suffixHex.replace('0x', '');
  const hasMarker = cleanHex.endsWith(ERC8021_MARKER);

  if (level === 'Basic') {
    return hasMarker;
  }

  if (level === 'Standard' || level === 'Strict') {
    if (!hasMarker) return false;
    // Basic checks: At least some schema data exists
    if (cleanHex.length <= 32) return false; // 32 chars = 16 bytes (marker length)
    
    // In Strict mode, an actual parse could be simulated here
    if (level === 'Strict') {
      // Very basic structural check for Strict level (just checking lengths)
      const schemaIdByteStr = cleanHex.slice(-34, -32);
      const schemaId = parseInt(schemaIdByteStr, 16);
      if (isNaN(schemaId) || schemaId < 0 || schemaId > 2) return false;
    }
  }

  return true;
}
