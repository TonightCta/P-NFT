import React from 'react';

const IndexView = React.lazy(() => import('./index/index'));
const ScreenView = React.lazy(() => import('./screen/index'));
const ScreenViewNew = React.lazy(() => import('./screen.new/index'));
const MarketView = React.lazy(() => import('./market/index'));
const ProfileView = React.lazy(() => import('./profile/index'));
const DetailView = React.lazy(() => import('./detail/index'));
const OwnerNFTSView = React.lazy(() => import('./nfts/index'));
const VoiceNFTView = React.lazy(() => import('./voice.nft/index'));
const AirdropView = React.lazy(() => import('./airdrop/index'));
const MarketPlaceView = React.lazy(() => import('./market.place/index'));
const ToolView = React.lazy(() => import('./tool/index'))
export {
    IndexView,
    ScreenView,
    ScreenViewNew,
    MarketView,
    ProfileView,
    DetailView,
    OwnerNFTSView,
    VoiceNFTView,
    AirdropView,
    MarketPlaceView,
    ToolView
}