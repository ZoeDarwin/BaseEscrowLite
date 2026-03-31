"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

function trim(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button className="primary-button" onClick={() => disconnect()} type="button">
        Disconnect {trim(address)}
      </button>
    );
  }

  const connector = connectors[0];

  return (
    <button
      className="primary-button"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
      type="button"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}