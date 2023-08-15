import { ReactElement, ReactNode, useContext, useEffect } from "react";
// import { Button } from "antd";
import './index.scss'
// import { useMetamask } from "../../utils/metamask";
// import { PNft } from "../../App";
// import { useHiro } from "../../utils/hiro";
// import { useXVerse } from "../../utils/xverse";
// import FixedTabIndex from "./components/fixed.tab";
import ScreenIndex from "./components/screen.index";
import BuildIN from "./components/build.in";
import VisionMap from "./components/vision.map";
import VoiceNFTWapper from "./components/voice.nft";
import VoicePool from "./components/voice.pool";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper'
import 'swiper/css';
import "swiper/css/pagination";

import { flag } from "../../utils/source";
import { PNft } from "../../App";
import { Type } from "../../utils/types";
import { GetUrlKey } from "../../utils";


const ScreenView = (): ReactElement<ReactNode> => {
    // const { dispatch } = useContext(PNft);
    // const { connectMetamask } = useMetamask();
    const { dispatch } = useContext(PNft);
    // const { connectHiro } = useHiro();
    // const { connectXVerse } = useXVerse();
    // const [metaAddress, setMetaAddress] = useState<string | null>();
    // useEffect(() => {
    //     setMetaAddress(state.address)
    // }, [state.address])
    const tag: string[] = ['HOME', 'AI BUILDING', 'VISIONMAP', 'TRAFFIC OF VOICENFT', 'VOICE POOL'];
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<p class="' + className + '">' + "<span class='active-line'></span>" + tag[index] + "</p>";
        },
    };
    useEffect(() => {
        if(GetUrlKey('oauth_token', window.location.href)){
            localStorage.setItem('oauth_token', GetUrlKey('oauth_token', window.location.href) as string);
            localStorage.setItem('oauth_verifier', GetUrlKey('oauth_verifier', window.location.href) as string);
            window.close();
        }
    }, []);
    return (
        <div className="screen-view">
            {/* <FixedTabIndex /> */}
            <Swiper
                mousewheel
                cssMode
                direction={"vertical"}
                className="swiper-index"
                speed={800}
                pagination={pagination}
                modules={[Pagination]}
                onSwiper={(swiper) => {
                    dispatch({
                        type:Type.SET_SWIPER,
                        payload:{
                            swiper_ref:swiper
                        }
                    })
                }}
            >
                <SwiperSlide><ScreenIndex /></SwiperSlide>
                <SwiperSlide><BuildIN /></SwiperSlide>
                <SwiperSlide><VisionMap /></SwiperSlide>
                {!flag && <SwiperSlide><VoiceNFTWapper /></SwiperSlide>}
                <SwiperSlide><VoicePool /></SwiperSlide>
                {/* <SwiperSlide></SwiperSlide> */}
            </Swiper>
            {/* <div>
                <Button type="primary" size="large" onClick={async () => {
                    await connectMetamask();
                }}>Metamask</Button>
                <p>{metaAddress}</p>
            </div>
            <div>
                <Button type="primary" size="large" onClick={() => {
                    connectHiro()
                }}>Hiro Wallet</Button>
                <p>{metaAddress}</p>
            </div>
            <div>
                <Button type="primary" size="large" onClick={() => {
                    connectXVerse()
                }}>Xverse Wallet</Button>
                <p>{metaAddress}</p>
            </div> */}
        </div>
    )
};

export default ScreenView;