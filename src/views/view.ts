import React from 'react';

const IndexView = React.lazy(() => import('./index/index'));
const ScreenView = React.lazy(() => import('./screen/index'))

export {
    IndexView,
    ScreenView
}