// @ts-ignore
import { useSendCalls } from 'wagmi/experimental';
import { generateAttributionSuffix } from '../utils';

export function useERC8021BatchTransaction() {
  const { sendCallsAsync, ...rest } = useSendCalls();

  const sendBatchWithAttribution = async (args: any) => {
    const suffix = generateAttributionSuffix();
    
    return await sendCallsAsync({
      ...args,
      capabilities: {
        ...args.capabilities,
        dataSuffix: {
          value: suffix,
          optional: true,
        },
      },
    });
  };

  return {
    sendCallsAsync: sendBatchWithAttribution,
    ...rest,
  };
}
