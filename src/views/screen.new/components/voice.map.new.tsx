import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import IconFont from "../../../utils/icon";

interface Map {
    icon: string,
    text: string
};

const MapList: Map[] = [
    {
        icon: 'icon-a-AIIcons-15',
        text: 'We are now building a multi-chain NFT platform that supports NFT trading.'
    },
    {
        icon: 'icon-a-AIIcons-22',
        text: 'We will provide voice training services based on speech intelligence.'
    },
    {
        icon: 'icon-a-AIIcons-7',
        text: 'VoiceNFT owners will create digital works for sale on Pizzap.'
    },
    {
        icon: 'icon-a-AIIcons-1',
        text: 'We will showcase the value of machine-generated creations at the AIGC track,and unlock the commercial potential of the AIGC Collection.'
    },
]

const VoiceMapNew = (): ReactElement<ReactNode> => {
    const mapRef: any = useRef(null);
    const [movingBg, setMovingBg] = useState<string>('white')
    const onScrollMap = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollTop >= 2100) {
            setMovingBg('rgba(32,36,42,0.2)');
        } else {
            setMovingBg('white');
        }
        if (scrollTop >= 2200) {
            setMovingBg('rgba(32,36,42,0.4)');
        }
        if (scrollTop >= 2300) {
            setMovingBg('rgba(32,36,42,0.6)');
        }
        if (scrollTop >= 2400) {
            setMovingBg('rgba(32,36,42,0.8)');
        }
        if (scrollTop >= 2500) {
            setMovingBg('rgba(32,36,42,1)');
        }
        if (scrollTop >= 2900) {
            setMovingBg('rgba(32,36,42,0.8)');
        }
        if (scrollTop >= 2900) {
            setMovingBg('rgba(32,36,42,0.8)');
        }
        if (scrollTop >= 3000) {
            setMovingBg('rgba(32,36,42,0.6)');
        }
        if (scrollTop >= 3100) {
            setMovingBg('rgba(32,36,42,0.4)');
        }
        if (scrollTop >= 3200) {
            setMovingBg('rgba(32,36,42,0.2)');
        }
        if (scrollTop >= 3300) {
            setMovingBg('white');
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', onScrollMap, false);
        return () => {
            window.removeEventListener('scroll', onScrollMap, false)
        }
    }, [])
    return (
        <div className="voice-map-new" ref={mapRef} style={{ background: movingBg }}>
            <img src={require('../../../assets/new/map_text_bg.png')} className="text-mask" alt="" />
            <div className="map-new-inner">
                <div className="left-msg">
                    <p className="map-title public-title">
                        <span>Visionmap</span> of
                    </p>
                    <p className="map-title public-title">Pizzap</p>
                    <ul>
                        {
                            MapList.map((item: Map, index: number) => {
                                return (
                                    <li key={index}>
                                        <div className="icon-box">
                                            <IconFont type={item.icon} />
                                        </div>
                                        <p>{item.text}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="right-pic">
                    <img src={require('../../../assets/new/map_coin.png')} alt="" />
                </div>
            </div>
        </div>
    )
};

export default VoiceMapNew;