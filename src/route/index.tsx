import React, { useEffect } from "react";
import { ReactElement, ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import * as View from '../views/view'
import { Spin } from "antd";
import { VERSION } from "../utils/source";



const RouteConfig = (): ReactElement<ReactNode> => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [location.pathname])
    const Loading = () => {
        return (
            <div className="loading-route">
                <Spin size="large" />
            </div>
        )
    }
    return (
        <Routes>
            <Route path="/" element={<React.Suspense fallback={<Loading />}>
                <View.IndexView />
            </React.Suspense>}>
                <Route index element={<React.Suspense fallback={<Loading />}>
                    {VERSION === 'new' ? <View.ScreenViewNew /> : <View.ScreenView />}
                </React.Suspense>}></Route>
                <Route path="/create" element={<React.Suspense fallback={<Loading />}>
                    {VERSION === 'new' ? <View.VoiceNFTNewView /> : <View.VoiceNFTView />}
                </React.Suspense>}></Route>
                <Route path="/gallery" element={<React.Suspense fallback={<Loading />}>
                    <View.GalleryView />
                </React.Suspense>}></Route>
                <Route path="/campaigns" element={<React.Suspense fallback={<Loading />}>
                    <View.ContestView />
                </React.Suspense>}></Route>
                <Route path="/campaign/:id" element={<React.Suspense fallback={<Loading />}>
                    <View.ContestDetailView />
                </React.Suspense>}></Route>
                <Route path="/airdrop" element={<React.Suspense fallback={<Loading />}>
                    <View.AirdropView />
                </React.Suspense>}></Route>
                <Route path="/collections" element={<React.Suspense fallback={<Loading />}>
                    {VERSION === 'new' ? <View.MarketPlaceViewNew /> : <View.MarketPlaceView />}
                </React.Suspense>}></Route>
                <Route path="/asset/:address" element={<React.Suspense fallback={<Loading />}>
                    {VERSION === 'new' ? <View.MarketViewNew /> : <View.MarketView />}
                </React.Suspense>}></Route>
                <Route path="/collection" element={<React.Suspense fallback={<Loading />}>
                    <View.MarketViewAll />
                </React.Suspense>}></Route>
                <Route path="/profile" element={<React.Suspense fallback={<Loading />}>
                    <View.ProfileView />
                </React.Suspense>}></Route>
                <Route path="/user/:address" element={<React.Suspense fallback={<Loading />}>
                    <View.OwnerNFTSView />
                </React.Suspense>}></Route>
                <Route path="/asset/:chain/:address/:tokenid" element={<React.Suspense fallback={<Loading />}>
                    {VERSION === 'new' ? <View.DetailNewView /> : <View.DetailView />}
                </React.Suspense>}></Route>
                <Route path="/tool" element={<React.Suspense fallback={<Loading />}>
                    <View.ToolView />
                </React.Suspense>}></Route>
                <Route path="*" element={<React.Suspense fallback={<Loading />}>
                    <View.PageNotFound />
                </React.Suspense>}></Route>
            </Route>
        </Routes>
    )
};

export default RouteConfig;