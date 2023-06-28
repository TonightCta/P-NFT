import { ReactElement, ReactNode, useEffect } from "react";
import { InitCanvas } from '../tool/canvas'
import FooterWapper from "../../../components/footer";
import { useNavigate } from "react-router-dom";

const ScreenIndex = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    useEffect(() => {
        InitCanvas()
    }, [])
    return (
        <div className="screen-index public-screen">
            <p className="public-title">PIZZAP</p>
            <p>
                <button onClick={() => {
                    navigate('/marketplace')
                }}>ENTER</button>
            </p>
            <div className="waves"></div>
            <FooterWapper/>
        </div>
    )
};

export default ScreenIndex;