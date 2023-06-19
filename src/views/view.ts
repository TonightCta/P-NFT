import React from 'react';

const IndexView = React.lazy(() => import('./index/index'));
const ScreenView = React.lazy(() => import('./screen/index'))
const MarketView = React.lazy(() => import('./market/index'))

export {
    IndexView,
    ScreenView,
    MarketView
}