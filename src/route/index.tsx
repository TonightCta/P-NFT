import React from "react";
import { ReactElement, ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import * as View from '../views/view'


const RouteConfig = (): ReactElement<ReactNode> => {
    return (
        <Routes>
            <Route path="/" element={<React.Suspense fallback={<>Loading...</>}>
                <View.IndexView />
            </React.Suspense>}>
                <Route index element={<React.Suspense fallback={<>Loading...</>}>
                    <View.ScreenView />
                </React.Suspense>}></Route>
            </Route>
        </Routes>
    )
};

export default RouteConfig;