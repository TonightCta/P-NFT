import React from 'react';

const IndexView = React.lazy(() => import('./index/index'));
const ScreenView = React.lazy(() => import('./screen/index'));
const MarketView = React.lazy(() => import('./market/index'));
const ProfileView = React.lazy(() => import('./profile/index'));
const DetailView = React.lazy(() => import('./detail/index'));
const OwnerNFTSView = React.lazy(() => import('./nfts/index'));
const VoiceNFTView = React.lazy(() => import('./voice.nft/index'));
const AirdropView = React.lazy(() => import('./airdrop/index'));

export {
    IndexView,
    ScreenView,
    MarketView,
    ProfileView,
    DetailView,
    OwnerNFTSView,
    VoiceNFTView,
    AirdropView
}