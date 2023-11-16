// import {
//     Chain,
//     connectorsForWallets,
// } from '@rainbow-me/rainbowkit';
// import {
//     injectedWallet,
//     metaMaskWallet,
//     coinbaseWallet,
//     walletConnectWallet,
//     ledgerWallet,
// } from '@rainbow-me/rainbowkit/wallets';
// import { configureChains, createConfig } from 'wagmi';
// import {
//     mainnet,
//     optimism,
//     filecoin,
// } from 'wagmi/chains';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { publicProvider } from 'wagmi/providers/public';



// const Plian: Chain = {
//     id: 8007736,
//     name: 'Plian Mainnet Subchain 1',
//     network: 'plian',
//     iconUrl: 'https://example.com/icon.svg',
//     iconBackground: '#fff',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'PI',
//         symbol: 'PI',
//     },
//     rpcUrls: {
//         public: { http: ['https://mainnet.plian.io/child_0'] },
//         default: { http: ['https://mainnet.plian.io/child_0'] },
//     },
//     blockExplorers: {
//         default: { name: 'PiScan', url: 'https://piscan.plian.org/?chain=1' },
//         etherscan: { name: 'PiScan', url: 'https://piscan.plian.org/?chain=1' },
//     },
//     testnet: false,
// }

// export const { chains, publicClient } = configureChains(
//     [mainnet, optimism, Plian, {...filecoin,iconUrl:'https://pizzap.io/static/media/fil.logo.23730f839b5727ccb4df.png'}],
//     [
//         alchemyProvider({ apiKey: 'ab-urdivNROgH0SNE3IlyQzOqmuOQjs7' }),
//         publicProvider()
//     ]
// );

//9ca823211b5d95d68fbc4bd92e55f960
export const projectId = '9ca823211b5d95d68fbc4bd92e55f960'
// const connectors = connectorsForWallets([
//     {
//         groupName: 'Suggested',
//         wallets: [
//             injectedWallet({ chains }),
//             metaMaskWallet({ projectId, chains }),
//             coinbaseWallet({ chains, appName: 'Pizzap' }),
//             walletConnectWallet({ projectId, chains }),
//             ledgerWallet({ projectId, chains })
//         ],
//     },
// ]);
// export const wagmiConfig = createConfig({
//     autoConnect: true,
//     connectors,
//     publicClient
// })