import { createSiweMessage, generateSiweNonce } from 'viem/siwe';
import { useAccount, useSignMessage } from 'wagmi';

export function useSaveScore() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const saveScore = async (score: number) => {
    if (!address || !chainId) throw new Error('Not connected. Cannot save score.');
    
    // Create SIWE message confirming the score for backend verification
    const nonce = generateSiweNonce();
    const message = createSiweMessage({
      address,
      chainId,
      domain: window.location.host,
      nonce,
      uri: window.location.origin,
      version: '1',
      statement: `I am saving my Colary Brain Score: ${score} points.`,
    });

    const signature = await signMessageAsync({ account: address as `0x${string}`, message });
    console.log("Score verified with SIWE signature:", signature);
    
    // Here you would typically POST the signature and score to your backend
    // await fetch('/api/score', { method: 'POST', body: JSON.stringify({ score, signature, message }) });

    return signature;
  };

  return { saveScore };
}
