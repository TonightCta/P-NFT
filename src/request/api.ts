import { post } from './index';

type o = {};

//Profile
export const ProfileService = (p: o) => post('/profile/info', p);
//Edit Profile
export const EditProfileService = (p: o) => post('/profile/edit', p);
//Edit Avatar
export const EditAvatarService = (p: o) => post('/profile/uploadavatar', p);
//Upload file
export const UploadFileService = (p: FormData) => post('/file/upload', p);
//Mint NFT
export const NFTMintService = (p: FormData) => post('/nft/mint', p);
//Maker NFT
export const NFTMakerService = (p: o) => post('/order/maker', p);
//Buy NFT
export const NFTBuyService = (p: o) => post('/order/taker', p);
//Off NFT
export const MFTOffService = (p: o) => post('/order/cancel', p);
//Market NFT
export const NFTMarketService = (p: o) => post('/order/list', p);
//Logs NFT
export const NFTLogsService = (p: o) => post('/nft/history', p);
//Owner NFT
export const NFTOwnerService = (p: o) => post('/user/sell', p);
//Wallet NFT
export const NFTWalletService = (p: o) => post('/nft/wallet', p);
//Query File
export const QueryFile = (p: o) => post('/file/url', p);
