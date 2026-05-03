import { useSendTransaction } from 'wagmi';
import { generateAttributionSuffix } from '../utils';

export function useERC8021Transaction() {
  const { sendTransactionAsync, ...rest } = useSendTransaction();

  const sendWithAttribution = async (args: any) => {
    const suffix = generateAttributionSuffix();
    const cleanSuffix = suffix.replace('0x', '');
    
    // Append the ERC-8021 suffix to data
    const data = args.data ? `${args.data}${cleanSuffix}` : `0x${cleanSuffix}`;
    
    return await sendTransactionAsync({
      ...args,
      data: data as `0x${string}`,
    });
  };

  return {
    sendTransactionAsync: sendWithAttribution,
    ...rest,
  };
}
