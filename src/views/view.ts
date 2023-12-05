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
const ToolView = React.lazy(() => import('./tool/index'));
const MarketViewNew = React.lazy(() => import('./market.new/index'));
const MarketPlaceViewNew = React.lazy(() => import('./market.place.new/index'));
const MarketViewAll = React.lazy(() => import('./market.all/index'));
const DetailNewView = React.lazy(() => import('./detail.new/index'));
const GalleryView = React.lazy(() => import('./gallery/index'));
const ContestView = React.lazy(() => import('./contest/index'));
const ContestDetailView = React.lazy(() => import('./contest.detail/index'))
const VoiceNFTNewView = React.lazy(() => import('./voice.nft.new/index'))
const PageNotFound = React.lazy(() => import('./not.found/index'));
const VideoView = React.lazy(() => import('./video/index'))

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
    ToolView,
    MarketViewNew,
    MarketPlaceViewNew,
    MarketViewAll,
    DetailNewView,
    GalleryView,
    ContestView,
    ContestDetailView,
    VoiceNFTNewView,
    PageNotFound,
    VideoView
}