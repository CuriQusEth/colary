import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export const BASE_CANONICAL_REGISTRY = "0x866969596836BD74CDFB765ed59e5C4EBa99fb4"; // Canonical registry address

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const registryAbi = [
  {
    type: 'function',
    name: 'getCodeData', // Generic name, assuming it retrieves code data
    inputs: [{ name: 'code', type: 'string' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  }
] as const;

export async function fetchBuilderCodeData(builderCode: string) {
  try {
    const data = await publicClient.readContract({
      address: BASE_CANONICAL_REGISTRY,
      abi: registryAbi,
      functionName: 'getCodeData',
      args: [builderCode],
    });
    return { valid: true, data };
  } catch (error) {
    console.error(`Error fetching data for registry code ${builderCode}`, error);
    return { valid: false };
  }
}
