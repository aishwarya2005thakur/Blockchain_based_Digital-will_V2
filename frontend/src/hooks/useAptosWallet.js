import { useCallback, useMemo } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function useAptosWallet() {
	const {
		account,
		connected,
		connect,
		disconnect,
		connecting,
		wallet,
		wallets,
	} = useWallet();

	const address = useMemo(() => (account?.address ? account.address : null), [account]);

	const connectWallet = useCallback(async () => {
		if (connected || connecting) return;
		try {
			await connect();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Failed to connect wallet:", error);
			throw error;
		}
	}, [connect, connected, connecting]);

	const disconnectWallet = useCallback(async () => {
		try {
			await disconnect();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Failed to disconnect wallet:", error);
		}
	}, [disconnect]);

	return {
		connected,
		connecting,
		address,
		wallet,
		availableWallets: wallets,
		connect: connectWallet,
		disconnect: disconnectWallet,
	};
}
