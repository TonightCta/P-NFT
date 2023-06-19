import { ReactElement, ReactNode, useEffect } from "react";
import { InitCanvas } from '../tool/canvas'
import FooterWapper from "../../../components/footer";

const ScreenIndex = (): ReactElement<ReactNode> => {
    useEffect(() => {
        InitCanvas()
    }, [])
    return (
        <div className="screen-index public-screen">
            <p className="public-title">PIZZAP</p>
            <p>
                <button>ENTER</button>
            </p>
            <div className="waves"></div>
            <FooterWapper/>
        </div>
    )
};

export default ScreenIndex;