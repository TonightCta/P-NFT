import { ReactElement, ReactNode } from "react";
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


const ScreenView = (): ReactElement<ReactNode> => {
    // const { connectMetamask } = useMetamask();
    // const { state } = useContext(PNft);
    // const { connectHiro } = useHiro();
    // const { connectXVerse } = useXVerse();
    // const [metaAddress, setMetaAddress] = useState<string | null>();
    // useEffect(() => {
    //     setMetaAddress(state.address)
    // }, [state.address])
    const tag: string[] = ['HOME', 'AI BUILDING', 'VISIONMAP', 'TRAFFIC OF VOICENFT', 'VOICE POOL','TEST'];
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<p class="' + className + '">' + "<span class='active-line'></span>" + tag[index] + "</p>";
        },
    };
    return (
        <div className="screen-view">
            {/* <FixedTabIndex /> */}
            <Swiper
                mousewheel
                cssMode
                direction={"vertical"}
                className="mySwiper"
                speed={800}
                pagination={pagination}
                modules={[Pagination]}
                onSlideChange={(e: any) => {
                    if(e.activeIndex === 5){
                        alert(123)
                    }
                }}
            >
                <SwiperSlide><ScreenIndex /></SwiperSlide>
                <SwiperSlide><BuildIN /></SwiperSlide>
                <SwiperSlide><VisionMap /></SwiperSlide>
                <SwiperSlide><VoiceNFTWapper /></SwiperSlide>
                <SwiperSlide><VoicePool /></SwiperSlide>
                <SwiperSlide></SwiperSlide>
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