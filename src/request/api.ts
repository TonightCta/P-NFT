import { post } from './index';

type o = {};

//Profile
export const ProfileService = (p:o) => post('/',p);
//Mint NFT
export const NFTMintService = (p:o) => post('/nft/mint',p);
//Maker NFT
export const NFTMakerService = (p:o) => post('/order/maker',p);
//Off NFT
export const MFTOffService = (p:o) => post('/order/cancel',p);
//Market NFT
export const NFTMarketService = (p:o) => post('/order/list',p);
//Logs NFT
export const NFTLogsService = (p:o) => post('/nft/history',p);
//Owner NFT
export const NFTOwnerService = (p:o) => post('/user/sell',p);
//Wallet NFT
export const NFTWalletService = (p:o) => post('/nft/wallet',p);
