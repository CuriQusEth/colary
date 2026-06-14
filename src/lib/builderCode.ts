import { encodeFunctionData, type Abi } from 'viem';
import { generateAttributionSuffix } from './erc8021/utils';

export const BUILDER_CODE = 'bc_g6baqkul';

/**
 * Encodes function data and appends the ERC-8021 builder code.
 */
export function encodeWithBuilderCode(
  abi: Abi,
  functionName: string,
  args?: any[]
): `0x${string}` {
  const data = encodeFunctionData({ abi, functionName, args });
  const suffix = generateAttributionSuffix(BUILDER_CODE).replace('0x', '');
  return `${data}${suffix}` as `0x${string}`;
}

// A mock ABI for Colary rewards and staking to demonstrate usage
export const COLARY_ABI = [
  {
    type: 'function',
    name: 'claimRewards',
    inputs: [{ name: 'score', type: 'uint256' }, { name: 'signature', type: 'bytes' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'stake',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const COLARY_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual address
