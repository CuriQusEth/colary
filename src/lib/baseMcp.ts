import { encodeFunctionData } from "viem";
import { SCOREBOARD_ADDRESS, SCOREBOARD_ABI } from "../contracts";
import { DATA_SUFFIX_HEX } from "./erc8021";

// We simulate `baseMcpClient` to call our backend API if not running headless.
// In actual extension contexts, `baseMcpClient` is injected or imported from a real MCP library connected to Claude.
const baseMcpClient = {
  send_calls: async (args: any) => {
    const res = await fetch("/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "base_send_transaction", params: args })
    });
    const data = await res.json();
    return { approvalUrl: data.result?.approvalUrl || "#", requestId: data.result?.requestId || Math.random().toString() };
  },
  chain_rpc_request: async (args: any) => {
    const res = await fetch("/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "chain_rpc_request", params: args })
    });
    const data = await res.json();
    return data.result;
  },
  get_request_status: async (args: any) => {
    return { status: "completed" };
  }
};

function withSuffix(calldata: `0x${string}`): string {
  return calldata + DATA_SUFFIX_HEX;
}

export async function submitMcpCall(method: string, params: any) {
  const res = await fetch("/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "base_send_transaction",
      params
    })
  });
  return res.json();
}

export async function saveScoreViaMcp(score: number) {
  const data = withSuffix(
    encodeFunctionData({
      abi: SCOREBOARD_ABI,
      functionName: "recordScore",
      args: [BigInt(score)],
    }) as `0x${string}`
  );
  // Returns { approvalUrl, requestId }
  return baseMcpClient.send_calls({
    chain: "base",
    calls: [{ to: SCOREBOARD_ADDRESS, data, value: "0x0" }],
  });
}

export async function readScoreViaMcp(player: string): Promise<any> {
  return baseMcpClient.chain_rpc_request({
    method: "eth_call",
    params: [{
      to: SCOREBOARD_ADDRESS,
      data: encodeFunctionData({
        abi: SCOREBOARD_ABI,
        functionName: "getScore",
        args: [player as `0x${string}`],
      }),
    }, "latest"],
    chain: "base",
  });
}

import { GAME_ABI, GAME_CONTRACT_ADDRESS } from "../contracts";
export { GAME_ABI, GAME_CONTRACT_ADDRESS };

export async function sendGMViaMcp() {
  const data = withSuffix(
    encodeFunctionData({ abi: GAME_ABI, functionName: "gm" }) as `0x${string}`
  );
  return baseMcpClient.send_calls({
    chain: "base",
    calls: [{ to: GAME_CONTRACT_ADDRESS, data, value: "0x0" }]
  });
}

export async function submitScoreViaMcp(score: number) {
  const data = withSuffix(
    encodeFunctionData({
      abi: GAME_ABI,
      functionName: "recordScore",
      args: [BigInt(score)]
    }) as `0x${string}`
  );
  return baseMcpClient.send_calls({
    chain: "base",
    calls: [{ to: GAME_CONTRACT_ADDRESS, data, value: "0x0" }]
  });
}

export async function sendGMAndScoreViaMcp(score: number) {
  const gmData = withSuffix(encodeFunctionData({ abi: GAME_ABI, functionName: "gm" }) as `0x${string}`);
  const scoreData = withSuffix(encodeFunctionData({
    abi: GAME_ABI, functionName: "recordScore", args: [BigInt(score)]
  }) as `0x${string}`);
  return baseMcpClient.send_calls({
    chain: "base",
    calls: [
      { to: GAME_CONTRACT_ADDRESS, data: gmData,    value: "0x0" },
      { to: GAME_CONTRACT_ADDRESS, data: scoreData, value: "0x0" },
    ]
  });
}

export async function readGMCountViaMcp(player: string): Promise<any> {
  return baseMcpClient.chain_rpc_request({
    method: "eth_call",
    params: [{
      to: GAME_CONTRACT_ADDRESS,
      data: encodeFunctionData({ abi: GAME_ABI, functionName: "getGMCount", args: [player as `0x${string}`] })
    }, "latest"],
    chain: "base"
  });
}


export async function pollStatus(
  requestId: string,
  intervalMs = 2000,
  timeoutMs  = 120_000
): Promise<"completed" | "failed"> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, intervalMs));
    const { status } = await baseMcpClient.get_request_status({ requestId });
    if (status === "completed" || status === "failed") return status;
  }
  return "failed";
}
