import { ReactElement, ReactNode, useEffect } from "react";
import { InitCanvas } from '../tool/canvas'
import FooterWapper from "../../../components/footer";
import { useNavigate } from "react-router-dom";
import { LAND } from "../../../utils/contract";

const ScreenIndex = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    useEffect(() => {
        InitCanvas()
    }, [])
    return (
        <div className="screen-index public-screen">
            <p className="public-title">PIZZAP</p>
            <p className="screen-remark">Use AI Empower Your Creative Inspiration</p>
            <p>
                <button onClick={() => {
                    navigate('/voice-nft')
                }}>ENTER</button>
            </p>
            <div className="waves"></div>
            {LAND !== 'taiko' && <div className="airdrop-banners" onClick={() => {
                navigate('/airdrop')
            }}>
                <ul>
                    {
                        [require('../../../assets/images/air_drop_1.png'),require('../../../assets/images/air_drop_2.png'),require('../../../assets/images/air_drop_3.png')].map((item:string,index:number) => {
                            return (
                                <li key={index}>
                                    <img src={item} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>}
            <FooterWapper/>
        </div>
    )
};

export default ScreenIndex;