import { ReactElement, ReactNode, useEffect } from "react";
import { InitCanvas } from '../tool/canvas'

const ScreenIndex = (): ReactElement<ReactNode> => {
    useEffect(() => {
        InitCanvas()
    }, [])
    return (
        <div className="screen-index public-screen">
            <p>PIZZAP</p>
            <div className="waves"></div>
        </div>
    )
};

export default ScreenIndex;