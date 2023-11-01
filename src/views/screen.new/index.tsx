import { ReactElement, ReactNode } from "react";
import './index.scss'
import ScreenIndexNew from "./components/screen.index";
import RibbonWapper from "./components/ribbon";
import CreatorWapper from "./components/creator";
import VoiceMapNew from "./components/voice.map.new";
import BuildInNew from "./components/build.in";
import FooterNew from "./components/footer.new";
import VoiceNftNew from "./components/voice.nft";
import { KeepAlive } from "react-keep-alive";
// import KeepAlive, { AliveScope } from 'react-activation'

const ScreenViewNew = (): ReactElement<ReactNode> => {
    return (
        <div className="screen-view-new">
            {/* <KeepAlive name="screen">
                <ScreenIndexNew />
            </KeepAlive> */}
            <ScreenIndexNew />
            <RibbonWapper />
            <CreatorWapper />
            <VoiceMapNew />
            <BuildInNew />
            <VoiceNftNew />
            <FooterNew />
        </div>
    )
};

export default ScreenViewNew;