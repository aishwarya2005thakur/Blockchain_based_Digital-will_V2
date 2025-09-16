import React from "react";
import useAptosWallet from "../hooks/useAptosWallet";

export default function ProfileWalletButton() {
	const { connected, connecting, address, connect, disconnect } = useAptosWallet();

	if (!connected) {
		return (
			<button onClick={connect} disabled={connecting}>
				{connecting ? "Connecting..." : "Sign in with Aptos Wallet"}
			</button>
		);
	}

	return (
		<div>
			<div style={{ fontSize: 12, color: "#555" }}>Connected</div>
			<div style={{ fontFamily: "monospace" }}>{address}</div>
			<button onClick={disconnect} style={{ marginTop: 8 }}>Disconnect</button>
		</div>
	);
}
