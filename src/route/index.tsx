import React from "react";
import { ReactElement, ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import * as View from '../views/view'
import { Spin } from "antd";


const RouteConfig = (): ReactElement<ReactNode> => {
    const Loading = () => {
        return (
            <div className="loading-route">
                <Spin size="large"/>
            </div>
        )
    }
    return (
        <Routes>
            <Route path="/" element={<React.Suspense fallback={<Loading />}>
                <View.IndexView />
            </React.Suspense>}>
                <Route index element={<React.Suspense fallback={<Loading />}>
                    <View.ScreenView />
                </React.Suspense>}></Route>
                <Route path="/voice-nft" element={<React.Suspense fallback={<Loading />}>
                    <View.VoiceNFTView />
                </React.Suspense>}></Route>
                <Route path="/airdrop" element={<React.Suspense fallback={<Loading />}>
                    <View.AirdropView />
                </React.Suspense>}></Route>
                <Route path="/market" element={<React.Suspense fallback={<Loading />}>
                    <View.MarketView />
                </React.Suspense>}></Route>
                <Route path="/profile" element={<React.Suspense fallback={<Loading />}>
                    <View.ProfileView />
                </React.Suspense>}></Route>
                <Route path="/owner" element={<React.Suspense fallback={<Loading />}>
                    <View.OwnerNFTSView />
                </React.Suspense>}></Route>
                <Route path="/detail" element={<React.Suspense fallback={<Loading />}>
                    <View.DetailView />
                </React.Suspense>}></Route>
            </Route>
        </Routes>
    )
};

export default RouteConfig;