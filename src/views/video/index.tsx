import { ReactElement, ReactNode, useContext } from "react";
import './index.scss'
import IconFont from "../../utils/icon";
import { PNft } from "../../App";
import { web3 } from "../../utils/types";

const URL: string = '/video/pizzap.aigc.s1.mp4'

const VideoView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const shareTwitter = () => {
        // const metaArr = [
        //     'twitter:url', 'https://pizzap.io/#/video',
        //     'twitter:site', '@UIEg9fWlcPrvcMN',
        //     'twitter:creator', '@pizzap_io',
        //     'twitter:title', 'Videos in pizzap',
        //     'twitter:description', 'Pizzap is a user-benefit-oriented and mass-adopted AI ecosystem. Members  can create, show and trade NFTs in this community, as well as build personal art brand in MetaVerse.',
        //     'twitter:card', 'summary_large_image',
        //     'twitter:image', 'http://gg.chendahai.cn/static/image/pkq.jpg'
        // ]
        // const metaParams = metaArr.toString();
        window.open(`https://twitter.com/intent/tweet?refer_source=${encodeURIComponent(`https://pizzap.io/#/video`)}&text=${encodeURIComponent(`Pizzap Video`)}&via=pizzap_io&related=pizzap_io`)
    };
    return (
        <div className="video-view">
            <div className="view-inner">
                <video controls>
                    <source src={URL} type="video/mp4" />
                </video>
                <div className="share-box">
                    <p>Share to</p>
                    <p>
                        <IconFont type="icon-twitter-logo-bold" onClick={shareTwitter} />
                        <IconFont type="icon-telegram-logo-bold" onClick={() => {
                            window.open(`https://t.me/share/url?url=${encodeURIComponent('https://pizzap.io/#/video')}&text=${encodeURIComponent('Videos in Pizzap')}`)
                        }} />
                        <IconFont type="icon-discord-logo-bold"/>
                    </p>
                </div>
            </div>
        </div>
    )
};

export default VideoView;