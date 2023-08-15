import { post,get } from './index';

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
//NFT Info
export const NFTInfoService = (p: o) => post('/order/info', p);
//NFT Info 2
export const NFTInfoService2 = (p: o) => post('/nft/url', p);
//Logs NFT
export const NFTLogsService = (p: o) => post('/nft/history', p);
//Owner NFT
export const NFTOwnerService = (p: o) => post('/user/sell', p);
//Wallet NFT
export const NFTWalletService = (p: o) => post('/nft/wallet', p);
//Query File
export const QueryFile = (p: o) => post('/file/url', p);
//Activity Join
export const ActivityJoinService = (p: o) => post('/invite/register', p);
//Check Join
export const CheckJoinService = (p: o) => post('/invite/isregistered', p);
//Activity Info
export const ActivityInfoService = (p: o) => post('/invite/info', p);
//Activity Rank
export const ActivityRankService = (p: o) => post('/rank/topnftdeal', p);
//Mint Rank
export const MintRankService = (p: o) => post('/rank/topnftmint', p);
//Auth Twitter
export const AuthTwitterService = (p: o) => post('/twitter/requesturl', p);
//Bind Twitter
export const BindTwitterService = (p:o) => get('/twitter/maketoken',p);
//Upload Audio
export const UploadAudioService = (p:FormData) => post('/profile/uploadaudio',p);
//Upload Background
export const UploadBackGroundService = (p:FormData) => post('/profile/uploadbgimg',p);
//Sign-in Info
export const SignInfoService = (p:o) => post('/checkin/info',p);
//Sign-in Up
export const SignUpService = (p:o) => post('/checkin/checkin',p);