import { ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LAND } from "../../../utils/contract";

const ScreenIndex = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    // useEffect(() => {
    //     InitCanvas()
    // }, [])
    return (
        <div className="screen-index public-screen">
            <p className="public-title">PIZZAP</p>
            <p className="screen-remark">AI Empowers Your Creative Inspiration</p>
            <p>
                <button onClick={() => {
                    navigate('/create')
                }}>ENTER</button>
            </p>
            <div className="waves"></div>
            {LAND !== 'taiko' && <div className="airdrop-banners" onClick={() => {
                navigate('/airdrop')
            }}>
                <ul>
                    {
                        [''].map((item:string,index:number) => {
                            return (
                                <li key={index}>
                                    <img src={item} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>}
            {/* <FooterWapper/> */}
        </div>
    )
};

export default ScreenIndex;